import { motion } from 'framer-motion';
import { Check, Users, Briefcase, Zap, Leaf } from 'lucide-react';
import { VehicleType, Vehicle } from '@/types/booking.types';
import bydImage from '@/assets/byd-yuan-pro.jpg';
import onixImage from '@/assets/chevrolet-onix.jpeg';
import { useTranslation } from 'react-i18next';

const vehicles: Vehicle[] = [
  {
    id: 'byd',
    name: 'BYD Yuan Pro',
    model: 'Electric SUV',
    passengers: 4,
    luggage: 3,
    features: ['electric', 'panoramicRoof', 'premiumSound', 'climateControl'],
    image: bydImage,
    eco: true,
  },
  {
    id: 'onix',
    name: 'Chevrolet Onix',
    model: 'Premium Sedan',
    passengers: 4,
    luggage: 2,
    features: ['fuelEfficient', 'leatherSeats', 'bluetooth', 'usbCharging'],
    image: onixImage,
  },
];

interface VehicleSelectionProps {
  selected: VehicleType;
  onSelect: (vehicle: VehicleType) => void;
}

export const VehicleSelection = ({ selected, onSelect }: VehicleSelectionProps) => {
  const { t } = useTranslation();

  return (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
          {t('vehicleSelection.title')}
        </h2>
        <p className="text-muted-foreground">
          {t('vehicleSelection.subtitle')}
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {vehicles.map((vehicle, index) => {
          const isSelected = selected === vehicle.id;
          
          return (
            <motion.div
              key={vehicle.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              onClick={() => onSelect(vehicle.id)}
              className={`vehicle-card ${isSelected ? 'selected' : ''}`}
            >
              {/* Selection indicator */}
              <div className={`
                absolute top-4 right-4 w-6 h-6 rounded-full border-2 flex items-center justify-center
                transition-all duration-300
                ${isSelected ? 'bg-primary border-primary' : 'border-muted-foreground/30'}
              `}>
                {isSelected && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  >
                    <Check className="w-3.5 h-3.5 text-primary-foreground" />
                  </motion.div>
                )}
              </div>

              {/* Eco badge */}
              {vehicle.eco && (
                <div className="absolute top-4 left-4 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-medium">
                  <Leaf className="w-3 h-3" />
                  {t('vehicleSelection.ecoBadge')}
                </div>
              )}

              {/* Vehicle image */}
              <div className="relative h-48 mb-4 overflow-hidden rounded-lg bg-gradient-to-br from-muted/50 to-muted">
                <img
                  src={vehicle.image}
                  alt={vehicle.name}
                  className="w-full h-full object-contain transform transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              {/* Vehicle info */}
              <div className="space-y-4">
                <div>
                  <h3 className="font-display text-xl font-semibold text-foreground">
                    {t(`vehicleSelection.vehicles.${vehicle.id}.name`, { defaultValue: vehicle.name })}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {t(`vehicleSelection.vehicles.${vehicle.id}.model`, { defaultValue: vehicle.model })}
                  </p>
                </div>

                {/* Capacity */}
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Users className="w-4 h-4 text-primary" />
                    <span>{t('vehicleSelection.capacity.passengers', { count: vehicle.passengers })}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Briefcase className="w-4 h-4 text-primary" />
                    <span>{t('vehicleSelection.capacity.luggage', { count: vehicle.luggage })}</span>
                  </div>
                </div>

                {/* Features */}
                <div className="flex flex-wrap gap-2">
                  {vehicle.features.map((feature, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-muted text-xs text-muted-foreground"
                    >
                      <Zap className="w-3 h-3 text-primary" />
                      {t(`vehicleSelection.features.${feature}`)}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export { vehicles };
