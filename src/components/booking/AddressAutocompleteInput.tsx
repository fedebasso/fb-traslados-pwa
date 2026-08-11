import { useEffect, useRef, useState } from 'react';
import { Loader2, MapPin } from 'lucide-react';
import { Location } from '@/types/booking.types';
import { PlaceSuggestion, getSuggestions, isPlacesConfigured, resolvePlace } from '@/services/places';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';

interface AddressAutocompleteInputProps {
  id: string;
  value: Location | null;
  onChange: (location: Location | null) => void;
  placeholder: string;
  icon: React.ReactNode;
  className?: string;
  required?: boolean;
}

// Address input with optional Google Places autocomplete. When the Maps key is
// missing or the API errors, it silently behaves as a plain text input: the
// typed address is always committed to state, so the wizard never blocks.
export const AddressAutocompleteInput = ({
  id,
  value,
  onChange,
  placeholder,
  icon,
  className,
  required,
}: AddressAutocompleteInputProps) => {
  const { t } = useTranslation();
  const [text, setText] = useState(value?.address ?? '');
  const [suggestions, setSuggestions] = useState<PlaceSuggestion[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [placesFailed, setPlacesFailed] = useState(!isPlacesConfigured());
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();
  const requestSeq = useRef(0);
  const committedAddress = useRef(value?.address ?? '');

  // Sync local text only on EXTERNAL value changes (quick picks, reset).
  // Comparing against the last committed address avoids clobbering in-progress
  // typing (state holds the trimmed address, the input may have a trailing space).
  useEffect(() => {
    const address = value?.address ?? '';
    if (address !== committedAddress.current) {
      committedAddress.current = address;
      setText(address);
    }
  }, [value?.address]);

  const handleInput = (raw: string) => {
    setText(raw);
    const trimmed = raw.trim();
    // Typing always commits the raw address and drops stale structured data
    // (placeId/coords) from any previously selected suggestion.
    committedAddress.current = trimmed;
    onChange(trimmed ? { address: trimmed } : null);

    if (placesFailed || trimmed.length < 3) {
      setSuggestions([]);
      setOpen(false);
      setLoading(false);
      return;
    }

    setLoading(true);
    setOpen(true);
    clearTimeout(debounceRef.current);
    const seq = ++requestSeq.current;
    debounceRef.current = setTimeout(async () => {
      try {
        const results = await getSuggestions(trimmed);
        if (seq !== requestSeq.current) return;
        setSuggestions(results);
        setLoading(false);
      } catch {
        if (seq !== requestSeq.current) return;
        setPlacesFailed(true);
        setSuggestions([]);
        setOpen(false);
        setLoading(false);
      }
    }, 300);
  };

  const handleSelect = async (suggestion: PlaceSuggestion) => {
    setText(suggestion.description);
    setOpen(false);
    setSuggestions([]);
    // Commit the address immediately; coordinates arrive when geocoding resolves.
    committedAddress.current = suggestion.description;
    onChange({ address: suggestion.description, placeId: suggestion.placeId });
    try {
      const location = await resolvePlace(suggestion);
      // Skip if the user already typed something else meanwhile.
      if (committedAddress.current === suggestion.description) {
        onChange(location);
      }
    } catch {
      // Address text is already committed; losing coordinates is acceptable.
    }
  };

  const showEmpty = open && !loading && suggestions.length === 0;

  return (
    <div className={cn('relative', className)}>
      <div className="relative">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">{icon}</span>
        <input
          id={id}
          type="text"
          value={text}
          autoComplete="off"
          required={required}
          onChange={(e) => handleInput(e.target.value)}
          onFocus={() => {
            if (suggestions.length > 0) setOpen(true);
          }}
          onBlur={() => setTimeout(() => setOpen(false), 200)}
          placeholder={placeholder}
          className="input-premium w-full pl-12 pr-10 min-h-12"
          role="combobox"
          aria-expanded={open}
          aria-autocomplete="list"
        />
        {loading && (
          <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground animate-spin" />
        )}
      </div>

      {open && (
        <div className="absolute z-30 w-full mt-2 py-2 bg-card border border-border rounded-lg shadow-soft max-h-64 overflow-y-auto">
          {loading && suggestions.length === 0 && (
            <p className="px-4 py-3 text-sm text-muted-foreground">
              {t('locationPicker.searching')}
            </p>
          )}
          {showEmpty && (
            <p className="px-4 py-3 text-sm text-muted-foreground">
              {t('locationPicker.noResults')}
            </p>
          )}
          {suggestions.map(suggestion => (
            <button
              key={suggestion.placeId}
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => handleSelect(suggestion)}
              className="w-full px-4 py-3 text-left hover:bg-muted/50 focus:bg-muted/50 focus:outline-none flex items-start gap-3 transition-colors"
            >
              <MapPin className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
              <span className="min-w-0">
                <span className="block text-sm text-foreground truncate">{suggestion.mainText}</span>
                {suggestion.secondaryText && (
                  <span className="block text-xs text-muted-foreground truncate">
                    {suggestion.secondaryText}
                  </span>
                )}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
