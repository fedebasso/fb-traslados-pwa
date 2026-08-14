import { motion } from 'framer-motion';
import { Users, Briefcase, Coffee, GlassWater, Minus, Plus } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const drinkOptions = ['water', 'sparklingWater', 'softDrinks'];

interface TripDetailsProps {
  passengers: number;
  luggage: number;
  snacks: boolean;
  drinks: string[];
  maxPassengers: number;
  maxLuggage: number;
  onPassengersChange: (value: number) => void;
  onLuggageChange: (value: number) => void;
  onSnacksChange: (value: boolean) => void;
  onDrinksChange: (value: string[]) => void;
}

export const TripDetails = ({
  passengers,
  luggage,
  snacks,
  drinks,
  maxPassengers,
  maxLuggage,
  onPassengersChange,
  onLuggageChange,
  onSnacksChange,
  onDrinksChange,
}: TripDetailsProps) => {
  const { t } = useTranslation();

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
          {t('tripDetails.title')}
        </h2>
        <p className="text-muted-foreground">
          {t('tripDetails.subtitle')}
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
            {t('tripDetails.passengersAndLuggage')}
          </h3>

          <div className="grid sm:grid-cols-2 gap-6">
            {/* Passengers counter */}
            <div className="space-y-3">
              <label className="text-sm text-muted-foreground">{t('tripDetails.passengerCount')}</label>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => onPassengersChange(Math.max(1, passengers - 1))}
                  className="w-11 h-11 rounded-lg bg-muted flex items-center justify-center text-foreground hover:bg-muted/80 transition-colors disabled:opacity-50"
                  disabled={passengers <= 1}
                  aria-label="-"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="text-2xl font-semibold text-foreground w-12 text-center">
                  {passengers}
                </span>
                <button
                  onClick={() => onPassengersChange(Math.min(maxPassengers, passengers + 1))}
                  className="w-11 h-11 rounded-lg bg-muted flex items-center justify-center text-foreground hover:bg-muted/80 transition-colors disabled:opacity-50"
                  disabled={passengers >= maxPassengers}
                  aria-label="+"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              {passengers >= maxPassengers && (
                <p className="text-xs text-primary">{t('tripDetails.maxPassengers')}</p>
              )}
            </div>

            {/* Luggage counter */}
            <div className="space-y-3">
              <label className="text-sm text-muted-foreground flex items-center gap-2">
                <Briefcase className="w-4 h-4" />
                {t('tripDetails.luggageLabel')}
              </label>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => onLuggageChange(Math.max(0, luggage - 1))}
                  className="w-11 h-11 rounded-lg bg-muted flex items-center justify-center text-foreground hover:bg-muted/80 transition-colors disabled:opacity-50"
                  disabled={luggage <= 0}
                  aria-label="-"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="text-2xl font-semibold text-foreground w-12 text-center">
                  {luggage}
                </span>
                <button
                  onClick={() => onLuggageChange(Math.min(maxLuggage, luggage + 1))}
                  className="w-11 h-11 rounded-lg bg-muted flex items-center justify-center text-foreground hover:bg-muted/80 transition-colors disabled:opacity-50"
                  disabled={luggage >= maxLuggage}
                  aria-label="+"
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
            <Coffee className="w-5 h-5 text-primary" />
            {t('tripDetails.amenities')}
            <span className="text-xs font-normal text-muted-foreground">{t('tripDetails.optional')}</span>
          </h3>

          {/* Snacks */}
          <div className="space-y-3">
            <label className="text-sm text-muted-foreground flex items-center gap-2">
              <Coffee className="w-4 h-4" />
              {t('tripDetails.snacks')}
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
                <span>{t('tripDetails.snackDescription')}</span>
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
              {t('tripDetails.beverages')}
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
                  {t(`tripDetails.drinkOptions.${drink}`)}
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
