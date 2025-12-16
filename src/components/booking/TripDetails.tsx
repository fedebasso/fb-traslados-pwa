import { motion } from 'framer-motion';
import { Users, Briefcase, Music, Coffee, GlassWater, Minus, Plus } from 'lucide-react';
import { MusicPreference } from '@/types/booking.types';

const musicOptions: { value: MusicPreference; label: string }[] = [
  { value: 'classical', label: 'Classical' },
  { value: 'jazz', label: 'Jazz' },
  { value: 'pop', label: 'Pop' },
  { value: 'electronic', label: 'Electronic' },
  { value: 'silence', label: 'Silence' },
];

const drinkOptions = ['Water', 'Sparkling Water', 'Soft Drinks'];

interface TripDetailsProps {
  passengers: number;
  luggage: number;
  music: MusicPreference | null;
  snacks: boolean;
  drinks: string[];
  maxPassengers: number;
  maxLuggage: number;
  onPassengersChange: (value: number) => void;
  onLuggageChange: (value: number) => void;
  onMusicChange: (value: MusicPreference | null) => void;
  onSnacksChange: (value: boolean) => void;
  onDrinksChange: (value: string[]) => void;
}

export const TripDetails = ({
  passengers,
  luggage,
  music,
  snacks,
  drinks,
  maxPassengers,
  maxLuggage,
  onPassengersChange,
  onLuggageChange,
  onMusicChange,
  onSnacksChange,
  onDrinksChange,
}: TripDetailsProps) => {
  const toggleDrink = (drink: string) => {
    if (drinks.includes(drink)) {
      onDrinksChange(drinks.filter(d => d !== drink));
    } else {
      onDrinksChange([...drinks, drink]);
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
          Trip Details
        </h2>
        <p className="text-muted-foreground">
          Customize your journey experience
        </p>
      </div>

      <div className="grid gap-6">
        {/* Passengers & Luggage */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-6 space-y-6"
        >
          <h3 className="font-display text-lg font-semibold text-foreground flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" />
            Passengers & Luggage
          </h3>

          <div className="grid sm:grid-cols-2 gap-6">
            {/* Passengers counter */}
            <div className="space-y-3">
              <label className="text-sm text-muted-foreground">Number of Passengers</label>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => onPassengersChange(Math.max(1, passengers - 1))}
                  className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center text-foreground hover:bg-muted/80 transition-colors disabled:opacity-50"
                  disabled={passengers <= 1}
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="text-2xl font-semibold text-foreground w-12 text-center">
                  {passengers}
                </span>
                <button
                  onClick={() => onPassengersChange(Math.min(maxPassengers, passengers + 1))}
                  className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center text-foreground hover:bg-muted/80 transition-colors disabled:opacity-50"
                  disabled={passengers >= maxPassengers}
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              {passengers >= maxPassengers && (
                <p className="text-xs text-primary">Maximum capacity reached</p>
              )}
            </div>

            {/* Luggage counter */}
            <div className="space-y-3">
              <label className="text-sm text-muted-foreground flex items-center gap-2">
                <Briefcase className="w-4 h-4" />
                Luggage Items
              </label>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => onLuggageChange(Math.max(0, luggage - 1))}
                  className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center text-foreground hover:bg-muted/80 transition-colors disabled:opacity-50"
                  disabled={luggage <= 0}
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="text-2xl font-semibold text-foreground w-12 text-center">
                  {luggage}
                </span>
                <button
                  onClick={() => onLuggageChange(Math.min(maxLuggage, luggage + 1))}
                  className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center text-foreground hover:bg-muted/80 transition-colors disabled:opacity-50"
                  disabled={luggage >= maxLuggage}
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Amenities */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-6 space-y-6"
        >
          <h3 className="font-display text-lg font-semibold text-foreground flex items-center gap-2">
            <Music className="w-5 h-5 text-primary" />
            Amenities
            <span className="text-xs font-normal text-muted-foreground">(optional)</span>
          </h3>

          {/* Music preference */}
          <div className="space-y-3">
            <label className="text-sm text-muted-foreground">Music Preference</label>
            <div className="flex flex-wrap gap-2">
              {musicOptions.map(option => (
                <button
                  key={option.value}
                  onClick={() => onMusicChange(music === option.value ? null : option.value)}
                  className={`
                    px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
                    ${music === option.value 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-muted text-muted-foreground hover:bg-muted/80'}
                  `}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Snacks */}
          <div className="space-y-3">
            <label className="text-sm text-muted-foreground flex items-center gap-2">
              <Coffee className="w-4 h-4" />
              Premium Snacks
            </label>
            <button
              onClick={() => onSnacksChange(!snacks)}
              className={`
                w-full p-4 rounded-lg border text-left transition-all duration-200
                ${snacks 
                  ? 'border-primary bg-primary/10 text-foreground' 
                  : 'border-border bg-muted/50 text-muted-foreground hover:border-primary/50'}
              `}
            >
              <div className="flex items-center justify-between">
                <span>Gourmet snack selection</span>
                <div className={`
                  w-5 h-5 rounded border flex items-center justify-center
                  ${snacks ? 'bg-primary border-primary' : 'border-muted-foreground/50'}
                `}>
                  {snacks && <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>✓</motion.div>}
                </div>
              </div>
            </button>
          </div>

          {/* Drinks */}
          <div className="space-y-3">
            <label className="text-sm text-muted-foreground flex items-center gap-2">
              <GlassWater className="w-4 h-4" />
              Beverages
            </label>
            <div className="grid grid-cols-3 gap-2">
              {drinkOptions.map(drink => (
                <button
                  key={drink}
                  onClick={() => toggleDrink(drink)}
                  className={`
                    px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200
                    ${drinks.includes(drink) 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-muted text-muted-foreground hover:bg-muted/80'}
                  `}
                >
                  {drink}
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
