import { motion } from 'framer-motion';
import { Users, Briefcase, Coffee, GlassWater, Minus, Plus, Trash2 } from 'lucide-react';
import { OrderItem } from '@/types/booking.types';
import { useTranslation } from 'react-i18next';
import {
  MAX_ROWS, MIN_QTY, MAX_QTY, MAX_ITEM_TEXT, DRINK_SUGGESTIONS,
  clampQuantity, sanitizeItemText,
} from '@/lib/orderItems';

interface TripDetailsProps {
  passengers: number;
  luggage: number;
  snacks: OrderItem[];
  drinks: OrderItem[];
  maxPassengers: number;
  maxLuggage: number;
  onPassengersChange: (value: number) => void;
  onLuggageChange: (value: number) => void;
  onSnacksChange: (value: OrderItem[]) => void;
  onDrinksChange: (value: OrderItem[]) => void;
}

interface OrderCategoryProps {
  label: string;
  icon: React.ReactNode;
  placeholder: string;
  items: OrderItem[];
  suggestions?: string[];
  onChange: (items: OrderItem[]) => void;
}

const OrderCategory = ({ label, icon, placeholder, items, suggestions, onChange }: OrderCategoryProps) => {
  const { t } = useTranslation();

  const addRow = (text = '') => {
    if (items.length >= MAX_ROWS) return;
    onChange([...items, { text: sanitizeItemText(text), quantity: MIN_QTY }]);
  };
  const setText = (i: number, text: string) =>
    onChange(items.map((it, idx) => (idx === i ? { ...it, text: sanitizeItemText(text) } : it)));
  const setQty = (i: number, delta: number) =>
    onChange(items.map((it, idx) => (idx === i ? { ...it, quantity: clampQuantity(it.quantity + delta) } : it)));
  const removeRow = (i: number) => onChange(items.filter((_, idx) => idx !== i));

  // Un chip llena la primera fila vacía; si no hay, agrega una nueva.
  const applySuggestion = (text: string) => {
    const emptyIdx = items.findIndex(it => it.text.trim() === '');
    if (emptyIdx >= 0) setText(emptyIdx, text);
    else addRow(text);
  };

  return (
    <div className="space-y-3">
      <label className="text-sm text-muted-foreground flex items-center gap-2">
        {icon}
        {label}
      </label>

      <div className="space-y-2">
        {items.map((item, i) => (
          <div key={i} className="flex items-center gap-2">
            <input
              type="text"
              value={item.text}
              maxLength={MAX_ITEM_TEXT}
              onChange={e => setText(i, e.target.value)}
              placeholder={placeholder}
              className="flex-1 min-w-0 rounded-lg border border-border bg-muted/50 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
            />
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setQty(i, -1)}
                disabled={item.quantity <= MIN_QTY}
                className="w-11 h-11 rounded-lg bg-muted flex items-center justify-center text-foreground hover:bg-muted/80 transition-colors disabled:opacity-50"
                aria-label={t('tripDetails.decreaseQty')}
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-8 text-center text-sm font-semibold text-foreground">{item.quantity}</span>
              <button
                type="button"
                onClick={() => setQty(i, +1)}
                disabled={item.quantity >= MAX_QTY}
                className="w-11 h-11 rounded-lg bg-muted flex items-center justify-center text-foreground hover:bg-muted/80 transition-colors disabled:opacity-50"
                aria-label={t('tripDetails.increaseQty')}
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <button
              type="button"
              onClick={() => removeRow(i)}
              className="w-11 h-11 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              aria-label={t('tripDetails.removeItem')}
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      {items.length < MAX_ROWS && (
        <button
          type="button"
          onClick={() => addRow()}
          className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-muted/50 px-3 py-2 min-h-[44px] text-sm text-foreground hover:border-primary/50 transition-colors"
        >
          <Plus className="w-4 h-4" />
          {t('tripDetails.addItem')}
        </button>
      )}

      {suggestions && suggestions.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {suggestions.map(s => (
            <button
              key={s}
              type="button"
              onClick={() => applySuggestion(s)}
              className="px-3 py-2 min-h-[44px] rounded-lg bg-muted text-sm text-muted-foreground hover:bg-muted/80 transition-colors"
            >
              {s}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

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

          <p className="text-xs text-muted-foreground">{t('tripDetails.orderNote')}</p>

          <OrderCategory
            label={t('tripDetails.snacks')}
            icon={<Coffee className="w-4 h-4" />}
            placeholder={t('tripDetails.snackPlaceholder')}
            items={snacks}
            onChange={onSnacksChange}
          />

          <OrderCategory
            label={t('tripDetails.beverages')}
            icon={<GlassWater className="w-4 h-4" />}
            placeholder={t('tripDetails.drinkPlaceholder')}
            items={drinks}
            suggestions={DRINK_SUGGESTIONS}
            onChange={onDrinksChange}
          />
        </motion.div>
      </div>
    </div>
  );
};
