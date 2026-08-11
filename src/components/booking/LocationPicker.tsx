import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Navigation, ArrowRight, Plus, Trash2 } from 'lucide-react';
import { Location } from '@/types/booking.types';
import { AddressAutocompleteInput } from './AddressAutocompleteInput';
import { useTranslation } from 'react-i18next';

interface LocationPickerProps {
  origin: Location | null;
  destination: Location | null;
  onOriginChange: (location: Location | null) => void;
  onDestinationChange: (location: Location | null) => void;
  onDistanceChange: (distance: number) => void;
  onDurationChange: (duration: number) => void;
  stops: Location[];
  onStopsChange: (stops: Location[]) => void;
}

// Real, frequently requested pickup/drop-off points in Uruguay.
const quickPicks: Location[] = [
  { address: 'Aeropuerto Internacional de Carrasco', lat: -34.8384, lng: -56.0308 },
  { address: 'Terminal Tres Cruces, Montevideo', lat: -34.8942, lng: -56.1663 },
  { address: 'Puerto de Montevideo', lat: -34.9011, lng: -56.2145 },
  { address: 'Punta del Este', lat: -34.9608, lng: -54.9433 },
];

const haversineKm = (a: Location, b: Location): number | null => {
  if (a.lat == null || a.lng == null || b.lat == null || b.lng == null) return null;
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLon = ((b.lng - a.lng) * Math.PI) / 180;
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((a.lat * Math.PI) / 180) * Math.cos((b.lat * Math.PI) / 180) * Math.sin(dLon / 2) ** 2;
  return Math.round(R * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h)) * 10) / 10;
};

export const LocationPicker = ({
  origin,
  destination,
  onOriginChange,
  onDestinationChange,
  onDistanceChange,
  onDurationChange,
  stops,
  onStopsChange,
}: LocationPickerProps) => {
  const { t } = useTranslation();

  const distance = origin && destination ? haversineKm(origin, destination) : null;

  // Keep distance/duration in state consistent with the current locations,
  // clearing them whenever coordinates are unavailable (free-text addresses).
  useEffect(() => {
    onDistanceChange(distance ?? 0);
    onDurationChange(distance ? Math.round(distance * 2.5) : 0);
  }, [distance, onDistanceChange, onDurationChange]);

  const handleQuickPick = (pick: Location) => {
    if (!origin) {
      onOriginChange({ ...pick });
    } else {
      onDestinationChange({ ...pick });
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
          {t('locationPicker.title')}
        </h2>
        <p className="text-muted-foreground">
          {t('locationPicker.subtitle')}
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-4 sm:p-6 space-y-6"
      >
        {/* Origin + destination */}
        <div className="flex items-stretch gap-3 sm:gap-4">
          <div className="flex flex-col items-center pt-4">
            <div className="w-3 h-3 rounded-full bg-emerald-500 flex-shrink-0" />
            <div className="w-0.5 flex-1 bg-gradient-to-b from-emerald-500 to-primary" />
            <div className="w-3 h-3 rounded-full bg-primary flex-shrink-0" />
          </div>

          <div className="flex-1 min-w-0 space-y-4">
            <div className="space-y-1.5">
              <label htmlFor="booking-origin" className="text-sm font-medium text-foreground">
                {t('locationPicker.pickupLabel')}
              </label>
              <AddressAutocompleteInput
                id="booking-origin"
                value={origin}
                onChange={onOriginChange}
                placeholder={t('locationPicker.pickupPlaceholder')}
                icon={<MapPin className="w-5 h-5 text-emerald-500" />}
                required
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="booking-destination" className="text-sm font-medium text-foreground">
                {t('locationPicker.dropoffLabel')}
              </label>
              <AddressAutocompleteInput
                id="booking-destination"
                value={destination}
                onChange={onDestinationChange}
                placeholder={t('locationPicker.dropoffPlaceholder')}
                icon={<Navigation className="w-5 h-5 text-primary" />}
                required
              />
            </div>
          </div>
        </div>

        {/* Distance info (only when both locations have coordinates) */}
        {distance !== null && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="p-4 rounded-lg bg-muted/50 border border-border/50"
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="p-2 rounded-lg bg-primary/10 flex-shrink-0">
                  <ArrowRight className="w-5 h-5 text-primary" />
                </div>
                <p className="text-sm text-muted-foreground truncate">
                  {t('locationPicker.estimatedRoute')}
                </p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-xl font-display font-bold text-gradient-gold">
                  {t('locationPicker.distanceLabel', { distance })}
                </p>
                <p className="text-xs text-muted-foreground">
                  {t('locationPicker.durationLabel', { minutes: Math.round(distance * 2.5) })}
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Extra stops / extra pickups along the way */}
        <div className="pt-4 border-t border-border/50 space-y-3">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="text-sm font-medium text-foreground">{t('locationPicker.stopsTitle')}</p>
              <p className="text-xs text-muted-foreground">{t('locationPicker.stopsSubtitle')}</p>
            </div>
            <button
              type="button"
              onClick={() => onStopsChange([...stops, { address: '' }])}
              className="flex items-center gap-1.5 px-3 rounded-lg bg-muted text-sm text-foreground hover:bg-muted/80 transition-colors touch-target flex-shrink-0"
            >
              <Plus className="w-4 h-4" />
              {t('locationPicker.addStop')}
            </button>
          </div>

          {stops.map((stop, i) => {
            const isEmpty = stop.address.trim().length === 0;
            return (
              <div key={i} className="space-y-1">
                <div className="flex items-center gap-2">
                  <AddressAutocompleteInput
                    id={`booking-stop-${i}`}
                    value={stop.address ? stop : null}
                    onChange={(location) => {
                      const next = [...stops];
                      next[i] = location ?? { address: '' };
                      onStopsChange(next);
                    }}
                    placeholder={t('locationPicker.stopPlaceholder', { index: i + 1 })}
                    icon={<MapPin className="w-4 h-4 text-primary" />}
                    className="flex-1 min-w-0"
                  />
                  <button
                    type="button"
                    onClick={() => onStopsChange(stops.filter((_, idx) => idx !== i))}
                    className="p-3 rounded-lg text-muted-foreground hover:text-destructive hover:bg-muted transition-colors flex-shrink-0"
                    aria-label={t('locationPicker.removeStop')}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                {isEmpty && (
                  <p className="text-xs text-primary" role="alert">
                    {t('locationPicker.emptyStopHint')}
                  </p>
                )}
              </div>
            );
          })}
        </div>

        {/* Quick picks */}
        <div className="pt-4 border-t border-border/50">
          <p className="text-sm text-muted-foreground mb-3">{t('locationPicker.popular')}</p>
          <div className="flex flex-wrap gap-2">
            {quickPicks.map(pick => (
              <button
                key={pick.address}
                type="button"
                onClick={() => handleQuickPick(pick)}
                className="px-3 py-2 rounded-full bg-muted text-xs text-muted-foreground hover:bg-muted/80 hover:text-foreground transition-colors min-h-9"
              >
                {pick.address}
              </button>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};
