import { motion } from 'framer-motion';
import { Car, Users, Briefcase, Music, Coffee, GlassWater, MapPin, Navigation, Calendar, Clock, Edit2 } from 'lucide-react';
import { BookingState, PricingBreakdown } from '@/types/booking.types';
import { vehicles } from './VehicleSelection';
import { formatCurrency } from '@/services/pricingCalculator';
import { format } from 'date-fns';

interface BookingSummaryProps {
  state: BookingState;
  pricing: PricingBreakdown;
  onEdit: (step: number) => void;
  onConfirm: () => void;
}

export const BookingSummary = ({ state, pricing, onEdit, onConfirm }: BookingSummaryProps) => {
  const vehicle = vehicles.find(v => v.id === state.vehicle);

  return (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
          Review Your Booking
        </h2>
        <p className="text-muted-foreground">
          Please confirm all details before proceeding
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
                    Vehicle
                  </div>
                  <p className="text-lg font-semibold text-foreground">{vehicle?.name}</p>
                  <p className="text-sm text-muted-foreground">{vehicle?.model}</p>
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
                Trip Details
              </div>
              <button onClick={() => onEdit(1)} className="p-2 rounded-lg hover:bg-muted transition-colors">
                <Edit2 className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Passengers</p>
                <p className="text-foreground font-medium flex items-center gap-2">
                  <Users className="w-4 h-4 text-primary" />
                  {state.passengers}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Luggage</p>
                <p className="text-foreground font-medium flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-primary" />
                  {state.luggage}
                </p>
              </div>
              {state.music && (
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Music</p>
                  <p className="text-foreground font-medium flex items-center gap-2">
                    <Music className="w-4 h-4 text-primary" />
                    {state.music}
                  </p>
                </div>
              )}
              {state.snacks && (
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Snacks</p>
                  <p className="text-foreground font-medium flex items-center gap-2">
                    <Coffee className="w-4 h-4 text-primary" />
                    Included
                  </p>
                </div>
              )}
              {state.drinks.length > 0 && (
                <div className="col-span-2">
                  <p className="text-xs text-muted-foreground mb-1">Beverages</p>
                  <p className="text-foreground font-medium flex items-center gap-2">
                    <GlassWater className="w-4 h-4 text-primary" />
                    {state.drinks.join(', ')}
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
                Route
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
                  <p className="text-xs text-muted-foreground">Pickup</p>
                  <p className="text-foreground font-medium">{state.origin?.address}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 flex justify-center">
                  <div className="w-2.5 h-2.5 rounded-full bg-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground">Drop-off</p>
                  <p className="text-foreground font-medium">{state.destination?.address}</p>
                </div>
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t border-border/50 flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Estimated distance</span>
              <span className="text-foreground font-semibold">{state.distance} km • ~{state.duration} min</span>
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
                  Pickup Schedule
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-primary" />
                    <span className="text-foreground font-medium">
                      {state.pickupDate && format(state.pickupDate, 'EEE, MMM d, yyyy')}
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
            Price Breakdown
          </h3>
          
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Base fare</span>
              <span className="text-foreground">{formatCurrency(pricing.baseFare)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Distance ({state.distance} km)</span>
              <span className="text-foreground">{formatCurrency(pricing.distanceCharge)}</span>
            </div>
            {pricing.passengerSurcharge > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Extra passengers</span>
                <span className="text-foreground">{formatCurrency(pricing.passengerSurcharge)}</span>
              </div>
            )}
            {pricing.amenities > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Amenities</span>
                <span className="text-foreground">{formatCurrency(pricing.amenities)}</span>
              </div>
            )}
            
            <div className="pt-4 mt-4 border-t border-border">
              <div className="flex justify-between items-center">
                <span className="text-foreground font-medium">Total</span>
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
            Confirm Booking
          </button>
          
          <p className="text-xs text-muted-foreground text-center mt-4">
            By confirming, you agree to our terms of service
          </p>
        </motion.div>
      </div>
    </div>
  );
};
