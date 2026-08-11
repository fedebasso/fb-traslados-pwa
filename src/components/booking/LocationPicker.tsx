import { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Navigation, ArrowRight, Search, Plus, Trash2 } from 'lucide-react';
import { Location } from '@/types/booking.types';
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

// Simulated locations for demo
const popularLocations = [
  { address: 'International Airport (EZE)', lat: -34.8222, lng: -58.5358 },
  { address: 'Downtown Business District', lat: -34.6037, lng: -58.3816 },
  { address: 'Puerto Madero Waterfront', lat: -34.6118, lng: -58.3628 },
  { address: 'Palermo Soho', lat: -34.5885, lng: -58.4333 },
  { address: 'Recoleta Center', lat: -34.5869, lng: -58.3933 },
];

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
  const [originSearch, setOriginSearch] = useState(origin?.address || '');
  const [destinationSearch, setDestinationSearch] = useState(destination?.address || '');
  const [showOriginSuggestions, setShowOriginSuggestions] = useState(false);
  const [showDestinationSuggestions, setShowDestinationSuggestions] = useState(false);

  const calculateDistance = (loc1: Location, loc2: Location) => {
    if (!loc1.lat || !loc1.lng || !loc2.lat || !loc2.lng) return 15;
    
    const R = 6371; // Earth's radius in km
    const dLat = (loc2.lat - loc1.lat) * Math.PI / 180;
    const dLon = (loc2.lng - loc1.lng) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(loc1.lat * Math.PI / 180) * Math.cos(loc2.lat * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return Math.round(R * c * 10) / 10;
  };

  const handleSelectLocation = (loc: typeof popularLocations[0], type: 'origin' | 'destination') => {
    const location: Location = { address: loc.address, lat: loc.lat, lng: loc.lng };
    
    if (type === 'origin') {
      onOriginChange(location);
      setOriginSearch(loc.address);
      setShowOriginSuggestions(false);
      
      if (destination) {
        const dist = calculateDistance(location, destination);
        onDistanceChange(dist);
        onDurationChange(Math.round(dist * 2.5));
      }
    } else {
      onDestinationChange(location);
      setDestinationSearch(loc.address);
      setShowDestinationSuggestions(false);
      
      if (origin) {
        const dist = calculateDistance(origin, location);
        onDistanceChange(dist);
        onDurationChange(Math.round(dist * 2.5));
      }
    }
  };

  const filteredLocations = (search: string) => 
    popularLocations.filter(loc => 
      loc.address.toLowerCase().includes(search.toLowerCase())
    );

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
        className="glass-card p-6 space-y-6"
      >
        {/* Route visual */}
        <div className="flex items-center gap-4 px-4">
          <div className="flex flex-col items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-emerald-500" />
            <div className="w-0.5 h-16 bg-gradient-to-b from-emerald-500 to-primary" />
            <div className="w-3 h-3 rounded-full bg-primary" />
          </div>
          
          <div className="flex-1 space-y-4">
            {/* Origin input */}
            <div className="relative">
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-500" />
                <input
                  type="text"
                  value={originSearch}
                  onChange={(e) => {
                    setOriginSearch(e.target.value);
                    setShowOriginSuggestions(true);
                    onOriginChange(e.target.value.trim() ? { address: e.target.value.trim() } : null);
                  }}
                  onFocus={() => setShowOriginSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowOriginSuggestions(false), 200)}
                  placeholder={t('locationPicker.pickupPlaceholder')}
                  className="input-premium w-full pl-12 pr-10"
                />
                <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              </div>
              
              {showOriginSuggestions && originSearch && (
                <div className="absolute z-20 w-full mt-2 py-2 bg-card border border-border rounded-lg shadow-soft">
                  {filteredLocations(originSearch).map((loc, i) => (
                    <button
                      key={i}
                      onClick={() => handleSelectLocation(loc, 'origin')}
                      className="w-full px-4 py-3 text-left hover:bg-muted/50 flex items-center gap-3 transition-colors"
                    >
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm text-foreground">{loc.address}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Destination input */}
            <div className="relative">
              <div className="relative">
                <Navigation className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary" />
                <input
                  type="text"
                  value={destinationSearch}
                  onChange={(e) => {
                    setDestinationSearch(e.target.value);
                    setShowDestinationSuggestions(true);
                    onDestinationChange(e.target.value.trim() ? { address: e.target.value.trim() } : null);
                  }}
                  onFocus={() => setShowDestinationSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowDestinationSuggestions(false), 200)}
                  placeholder={t('locationPicker.dropoffPlaceholder')}
                  className="input-premium w-full pl-12 pr-10"
                />
                <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              </div>
              
              {showDestinationSuggestions && destinationSearch && (
                <div className="absolute z-20 w-full mt-2 py-2 bg-card border border-border rounded-lg shadow-soft">
                  {filteredLocations(destinationSearch).map((loc, i) => (
                    <button
                      key={i}
                      onClick={() => handleSelectLocation(loc, 'destination')}
                      className="w-full px-4 py-3 text-left hover:bg-muted/50 flex items-center gap-3 transition-colors"
                    >
                      <Navigation className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm text-foreground">{loc.address}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Distance info */}
        {origin && destination && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mt-6 p-4 rounded-lg bg-muted/50 border border-border/50"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <ArrowRight className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{t('locationPicker.estimatedRoute')}</p>
                  <p className="text-foreground font-medium">
                    {t('locationPicker.routeLabel', {
                      from: origin.address.split(' ')[0],
                      to: destination.address.split(' ')[0],
                    })}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-display font-bold text-gradient-gold">
                  {t('locationPicker.distanceLabel', { distance: calculateDistance(origin, destination) })}
                </p>
                <p className="text-xs text-muted-foreground">
                  {t('locationPicker.durationLabel', {
                    minutes: Math.round(calculateDistance(origin, destination) * 2.5),
                  })}
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Extra stops / extra pickups along the way */}
        <div className="pt-4 border-t border-border/50 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-foreground">{t('locationPicker.stopsTitle')}</p>
              <p className="text-xs text-muted-foreground">{t('locationPicker.stopsSubtitle')}</p>
            </div>
            <button
              type="button"
              onClick={() => onStopsChange([...stops, { address: '' }])}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-muted text-sm text-foreground hover:bg-muted/80 transition-colors"
            >
              <Plus className="w-4 h-4" />
              {t('locationPicker.addStop')}
            </button>
          </div>

          {stops.map((stop, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="relative flex-1">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
                <input
                  type="text"
                  value={stop.address}
                  onChange={(e) => {
                    const next = [...stops];
                    next[i] = { address: e.target.value };
                    onStopsChange(next);
                  }}
                  placeholder={t('locationPicker.stopPlaceholder', { index: i + 1 })}
                  className="input-premium w-full pl-11"
                />
              </div>
              <button
                type="button"
                onClick={() => onStopsChange(stops.filter((_, idx) => idx !== i))}
                className="p-2.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-muted transition-colors"
                aria-label={t('locationPicker.removeStop')}
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        {/* Popular locations */}
        <div className="pt-4 border-t border-border/50">
          <p className="text-sm text-muted-foreground mb-3">{t('locationPicker.popular')}</p>
          <div className="flex flex-wrap gap-2">
            {popularLocations.slice(0, 4).map((loc, i) => (
              <button
                key={i}
                onClick={() => handleSelectLocation(loc, destination ? 'origin' : 'destination')}
                className="px-3 py-1.5 rounded-full bg-muted text-xs text-muted-foreground hover:bg-muted/80 hover:text-foreground transition-colors"
              >
                {loc.address}
              </button>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};
