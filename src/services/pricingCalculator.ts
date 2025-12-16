import { BookingState, PricingBreakdown, VehicleType } from '@/types/booking.types';

const BASE_FARES: Record<NonNullable<VehicleType>, number> = {
  byd: 55,
  onix: 45,
};

const RATE_PER_KM = 2.5;
const PASSENGER_SURCHARGE_THRESHOLD = 2;
const PASSENGER_SURCHARGE_RATE = 5;
const AMENITIES_FEE = 15;

export const calculatePricing = (state: BookingState): PricingBreakdown => {
  const baseFare = state.vehicle ? BASE_FARES[state.vehicle] : 0;
  
  const distanceCharge = state.distance * RATE_PER_KM;
  
  const extraPassengers = Math.max(0, state.passengers - PASSENGER_SURCHARGE_THRESHOLD);
  const passengerSurcharge = extraPassengers * PASSENGER_SURCHARGE_RATE;
  
  const hasAmenities = state.snacks || state.drinks.length > 0 || state.music !== null;
  const amenities = hasAmenities ? AMENITIES_FEE : 0;
  
  const total = baseFare + distanceCharge + passengerSurcharge + amenities;
  
  return {
    baseFare,
    distanceCharge: Math.round(distanceCharge * 100) / 100,
    passengerSurcharge,
    amenities,
    total: Math.round(total * 100) / 100,
  };
};

export const generateConfirmationCode = (): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const segment1 = Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  const segment2 = Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  return `PS-${segment1}-${segment2}`;
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};
