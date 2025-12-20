import { useState, useEffect, useCallback } from 'react';
import { BookingState, VehicleType, MusicPreference, Location } from '@/types/booking.types';

const STORAGE_KEY = 'premium-shuttle-booking';

const initialState: BookingState = {
  currentStep: 0,
  vehicle: null,
  passengers: 1,
  luggage: 0,
  music: null,
  snacks: false,
  drinks: [],
  origin: null,
  destination: null,
  pickupDate: null,
  pickupTime: null,
  distance: 0,
  duration: 0,
  email: '',
};

export const useBookingState = () => {
  const normalizeDrinks = (drinks: string[]) =>
    drinks.map(drink => {
      const lower = drink.toLowerCase();
      if (lower.includes('sparkling')) return 'sparklingWater';
      if (lower.includes('soft')) return 'softDrinks';
      if (lower.includes('agua con gas')) return 'sparklingWater';
      if (lower.includes('refriger')) return 'softDrinks';
      return lower.includes('water') ? 'water' : drink;
    });

  const [state, setState] = useState<BookingState>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        ...parsed,
        pickupDate: parsed.pickupDate ? new Date(parsed.pickupDate) : null,
        drinks: parsed.drinks ? normalizeDrinks(parsed.drinks) : [],
      };
    }
    return initialState;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const setVehicle = useCallback((vehicle: VehicleType) => {
    setState(prev => ({ ...prev, vehicle }));
  }, []);

  const setPassengers = useCallback((passengers: number) => {
    setState(prev => ({ ...prev, passengers }));
  }, []);

  const setLuggage = useCallback((luggage: number) => {
    setState(prev => ({ ...prev, luggage }));
  }, []);

  const setMusic = useCallback((music: MusicPreference | null) => {
    setState(prev => ({ ...prev, music }));
  }, []);

  const setSnacks = useCallback((snacks: boolean) => {
    setState(prev => ({ ...prev, snacks }));
  }, []);

  const setDrinks = useCallback((drinks: string[]) => {
    setState(prev => ({ ...prev, drinks }));
  }, []);

  const setOrigin = useCallback((origin: Location | null) => {
    setState(prev => ({ ...prev, origin }));
  }, []);

  const setDestination = useCallback((destination: Location | null) => {
    setState(prev => ({ ...prev, destination }));
  }, []);

  const setPickupDate = useCallback((pickupDate: Date | null) => {
    setState(prev => ({ ...prev, pickupDate }));
  }, []);

  const setPickupTime = useCallback((pickupTime: string | null) => {
    setState(prev => ({ ...prev, pickupTime }));
  }, []);

  const setDistance = useCallback((distance: number) => {
    setState(prev => ({ ...prev, distance }));
  }, []);

  const setDuration = useCallback((duration: number) => {
    setState(prev => ({ ...prev, duration }));
  }, []);

  const setEmail = useCallback((email: string) => {
    setState(prev => ({ ...prev, email }));
  }, []);

  const nextStep = useCallback(() => {
    setState(prev => ({ ...prev, currentStep: Math.min(prev.currentStep + 1, 5) }));
  }, []);

  const prevStep = useCallback(() => {
    setState(prev => ({ ...prev, currentStep: Math.max(prev.currentStep - 1, 0) }));
  }, []);

  const goToStep = useCallback((step: number) => {
    setState(prev => ({ ...prev, currentStep: Math.max(0, Math.min(step, 5)) }));
  }, []);

  const setConfirmationCode = useCallback((code: string) => {
    setState(prev => ({ ...prev, confirmationCode: code }));
  }, []);

  const resetBooking = useCallback(() => {
    setState(initialState);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const canProceed = useCallback((step: number): boolean => {
    switch (step) {
      case 0:
        return state.vehicle !== null;
      case 1:
        return state.passengers > 0;
      case 2:
        return state.origin !== null && state.destination !== null;
      case 3:
        return state.pickupDate !== null && state.pickupTime !== null;
      case 4:
        return isValidEmail(state.email);
      default:
        return false;
    }
  }, [state]);

  return {
    state,
    setVehicle,
    setPassengers,
    setLuggage,
    setMusic,
    setSnacks,
    setDrinks,
    setOrigin,
    setDestination,
    setPickupDate,
    setPickupTime,
    setDistance,
    setDuration,
    setEmail,
    nextStep,
    prevStep,
    goToStep,
    setConfirmationCode,
    resetBooking,
    canProceed,
  };
};
