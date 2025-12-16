import { motion } from 'framer-motion';
import { Car, Users, Briefcase, Music, Coffee, GlassWater, MapPin, Navigation, Calendar, Clock, Edit2 } from 'lucide-react';
import { BookingState, PricingBreakdown } from '@/types/booking.types';
import { vehicles } from './VehicleSelection';
import { formatCurrency } from '@/services/pricingCalculator';
import { format } from 'date-fns';
import { useTranslation } from 'react-i18next';
import { getDateLocale } from '@/lib/i18n';

interface BookingSummaryProps {
  state: BookingState;
  pricing: PricingBreakdown;
  onEdit: (step: number) => void;
  onConfirm: () => void;
}

export const BookingSummary = ({ state, pricing, onEdit, onConfirm }: BookingSummaryProps) => {
  const vehicle = vehicles.find(v => v.id === state.vehicle);
  const { t, i18n } = useTranslation();
  const dateLocale = getDateLocale(i18n.language);
  const vehicleName = vehicle ? t(`vehicleSelection.vehicles.${vehicle.id}.name`, { defaultValue: vehicle.name }) : '';
  const vehicleModel = vehicle ? t(`vehicleSelection.vehicles.${vehicle.id}.model`, { defaultValue: vehicle.model }) : '';

  return (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
          {t('bookingSummary.title')}
        </h2>
        <p className="text-muted-foreground">
          {t('bookingSummary.subtitle')}
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left column - Details */}
        <div className="lg:col-span-2 space-y-4">
          {/* Vehicle */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-5"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="w-20 h-14 rounded-lg bg-muted overflow-hidden">
                  {vehicle && (
                    <img src={vehicle.image} alt={vehicle.name} className="w-full h-full object-contain" />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                    <Car className="w-4 h-4" />
                    {t('bookingSummary.vehicle')}
                  </div>
                  <p className="text-lg font-semibold text-foreground">{vehicleName}</p>
                  <p className="text-sm text-muted-foreground">{vehicleModel}</p>
                </div>
              </div>
              <button onClick={() => onEdit(0)} className="p-2 rounded-lg hover:bg-muted transition-colors">
                <Edit2 className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>
          </motion.div>

          {/* Trip details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="glass-card p-5"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Users className="w-4 h-4" />
                {t('bookingSummary.tripDetails')}
              </div>
              <button onClick={() => onEdit(1)} className="p-2 rounded-lg hover:bg-muted transition-colors">
                <Edit2 className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <p className="text-xs text-muted-foreground mb-1">{t('bookingSummary.passengers')}</p>
                <p className="text-foreground font-medium flex items-center gap-2">
                  <Users className="w-4 h-4 text-primary" />
                  {state.passengers}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">{t('bookingSummary.luggage')}</p>
                <p className="text-foreground font-medium flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-primary" />
                  {state.luggage}
                </p>
              </div>
              {state.music && (
                <div>
                  <p className="text-xs text-muted-foreground mb-1">{t('bookingSummary.music')}</p>
                  <p className="text-foreground font-medium flex items-center gap-2">
                    <Music className="w-4 h-4 text-primary" />
                    {t(`tripDetails.musicOptions.${state.music}`, { defaultValue: state.music })}
                  </p>
                </div>
              )}
              {state.snacks && (
                <div>
                  <p className="text-xs text-muted-foreground mb-1">{t('bookingSummary.snacks')}</p>
                  <p className="text-foreground font-medium flex items-center gap-2">
                    <Coffee className="w-4 h-4 text-primary" />
                    {t('bookingSummary.snacksIncluded')}
                  </p>
                </div>
              )}
              {state.drinks.length > 0 && (
                <div className="col-span-2">
                  <p className="text-xs text-muted-foreground mb-1">{t('bookingSummary.beverages')}</p>
                  <p className="text-foreground font-medium flex items-center gap-2">
                    <GlassWater className="w-4 h-4 text-primary" />
                    {state.drinks.map(drink => t(`tripDetails.drinkOptions.${drink}`, { defaultValue: drink })).join(', ')}
                  </p>
                </div>
              )}
            </div>
          </motion.div>

          {/* Route */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card p-5"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4" />
                {t('bookingSummary.route')}
              </div>
              <button onClick={() => onEdit(2)} className="p-2 rounded-lg hover:bg-muted transition-colors">
                <Edit2 className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-6 flex flex-col items-center">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <div className="w-0.5 h-8 bg-gradient-to-b from-emerald-500 to-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground">{t('bookingSummary.pickup')}</p>
                  <p className="text-foreground font-medium">{state.origin?.address}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 flex justify-center">
                  <div className="w-2.5 h-2.5 rounded-full bg-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground">{t('bookingSummary.dropoff')}</p>
                  <p className="text-foreground font-medium">{state.destination?.address}</p>
                </div>
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t border-border/50 flex items-center justify-between">
              <span className="text-sm text-muted-foreground">{t('bookingSummary.estimatedDistance')}</span>
              <span className="text-foreground font-semibold">
                {state.distance} km • ~{state.duration} min
              </span>
            </div>
          </motion.div>

          {/* Date & Time */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="glass-card p-5"
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                  <Calendar className="w-4 h-4" />
                  {t('bookingSummary.pickupSchedule')}
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-primary" />
                    <span className="text-foreground font-medium">
                      {state.pickupDate && format(state.pickupDate, 'EEE, MMM d, yyyy', { locale: dateLocale })}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-primary" />
                    <span className="text-foreground font-medium">{state.pickupTime}</span>
                  </div>
                </div>
              </div>
              <button onClick={() => onEdit(3)} className="p-2 rounded-lg hover:bg-muted transition-colors">
                <Edit2 className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>
          </motion.div>
        </div>

        {/* Right column - Pricing */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-6 h-fit sticky top-6"
        >
          <h3 className="font-display text-lg font-semibold text-foreground mb-6">
            {t('bookingSummary.priceBreakdown')}
          </h3>
          
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">{t('bookingSummary.baseFare')}</span>
              <span className="text-foreground">{formatCurrency(pricing.baseFare)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">
                {t('bookingSummary.distanceCharge', { distance: state.distance })}
              </span>
              <span className="text-foreground">{formatCurrency(pricing.distanceCharge)}</span>
            </div>
            {pricing.passengerSurcharge > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">{t('bookingSummary.extraPassengers')}</span>
                <span className="text-foreground">{formatCurrency(pricing.passengerSurcharge)}</span>
              </div>
            )}
            {pricing.amenities > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">{t('bookingSummary.amenities')}</span>
                <span className="text-foreground">{formatCurrency(pricing.amenities)}</span>
              </div>
            )}
            
            <div className="pt-4 mt-4 border-t border-border">
              <div className="flex justify-between items-center">
                <span className="text-foreground font-medium">{t('bookingSummary.total')}</span>
                <span className="text-2xl font-display font-bold text-gradient-gold">
                  {formatCurrency(pricing.total)}
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={onConfirm}
            className="w-full mt-6 btn-premium justify-center"
          >
            {t('bookingSummary.confirmCta')}
          </button>
          
          <p className="text-xs text-muted-foreground text-center mt-4">
            {t('bookingSummary.terms')}
          </p>
        </motion.div>
      </div>
    </div>
  );
};
