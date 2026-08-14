import { useState, useEffect, useCallback } from 'react';
import { BookingState, VehicleType, Location, OrderItem } from '@/types/booking.types';

// Bumped when the stored shape changes: v2 sessions held snacks as a boolean,
// drinks as string[] and a music field. v3 drops all of that, so reusing a v2
// session would carry incompatible data. Changing the key discards those stale
// sessions cleanly.
const STORAGE_KEY = 'premium-shuttle-booking-v3';

// Single source of truth for the wizard flow. Order, total, labels and every
// numeric index are derived from this array — re-enabling a step is one line.
// To bring back vehicle selection: add 'vehicle' back at the front.
export type StepId = 'vehicle' | 'contact' | 'details' | 'location' | 'schedule' | 'review';

export const STEPS: StepId[] = ['contact', 'details', 'location', 'schedule', 'review'];

// The terminal "confirmed" screen sits right after the last navigable step.
export const CONFIRMED_STEP = STEPS.length;

// Index of a step in the active flow, or -1 if that step is currently disabled.
export const stepIndex = (id: StepId): number => STEPS.indexOf(id);

// Completion rules per wizard step, shared by live validation (canProceed)
// and by state restoration, so a stale saved session can never strand the
// user past a step whose data is missing. Keyed by step id (not index) so the
// rules follow the step regardless of its position in the flow.
const isStepComplete = (state: BookingState, step: number): boolean => {
  switch (STEPS[step]) {
    case 'vehicle':
      return state.vehicle !== null;
    case 'contact': {
      const age = Number(state.age);
      return (
        state.fullName.trim().length >= 2 &&
        state.age.trim() !== '' &&
        Number.isFinite(age) &&
        age >= 1 &&
        age <= 120
      );
    }
    case 'details':
      return state.passengers > 0;
    case 'location':
      return (
        state.origin !== null &&
        state.destination !== null &&
        state.stops.every(stop => stop.address.trim().length > 0)
      );
    case 'schedule':
      return state.pickupDate !== null && state.pickupTime !== null;
    case 'review':
      return true;
    default:
      return false;
  }
};

// A restored session resumes at its saved step only if every prior step is
// still complete; otherwise it resumes at the first incomplete step. A saved
// "confirmed" screen resumes at the last navigable step (review).
const clampRestoredStep = (state: BookingState): number => {
  const target = Math.min(Math.max(state.currentStep, 0), STEPS.length - 1);
  for (let step = 0; step < target; step++) {
    if (!isStepComplete(state, step)) return step;
  }
  return target;
};

const initialState: BookingState = {
  currentStep: 0,
  vehicle: null,
  fullName: '',
  age: '',
  stops: [],
  passengers: 1,
  luggage: 0,
  snacks: [],
  drinks: [],
  origin: null,
  destination: null,
  pickupDate: null,
  pickupTime: null,
  distance: 0,
  duration: 0,
};

export const useBookingState = () => {
  const [state, setState] = useState<BookingState>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      const restored: BookingState = {
        ...initialState,
        ...parsed,
        pickupDate: parsed.pickupDate ? new Date(parsed.pickupDate) : null,
      };
      return { ...restored, currentStep: clampRestoredStep(restored) };
    }
    return initialState;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const setVehicle = useCallback((vehicle: VehicleType) => {
    setState(prev => ({ ...prev, vehicle }));
  }, []);

  const setFullName = useCallback((fullName: string) => {
    setState(prev => ({ ...prev, fullName }));
  }, []);

  const setAge = useCallback((age: string) => {
    setState(prev => ({ ...prev, age }));
  }, []);

  const setStops = useCallback((stops: Location[]) => {
    setState(prev => ({ ...prev, stops }));
  }, []);

  const setPassengers = useCallback((passengers: number) => {
    setState(prev => ({ ...prev, passengers }));
  }, []);

  const setLuggage = useCallback((luggage: number) => {
    setState(prev => ({ ...prev, luggage }));
  }, []);

  const setSnacks = useCallback((snacks: OrderItem[]) => {
    setState(prev => ({ ...prev, snacks }));
  }, []);

  const setDrinks = useCallback((drinks: OrderItem[]) => {
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

  const nextStep = useCallback(() => {
    setState(prev => ({ ...prev, currentStep: Math.min(prev.currentStep + 1, CONFIRMED_STEP) }));
  }, []);

  const prevStep = useCallback(() => {
    setState(prev => ({ ...prev, currentStep: Math.max(prev.currentStep - 1, 0) }));
  }, []);

  const goToStep = useCallback((step: number) => {
    setState(prev => ({ ...prev, currentStep: Math.max(0, Math.min(step, CONFIRMED_STEP)) }));
  }, []);

  const setConfirmationCode = useCallback((code: string) => {
    setState(prev => ({ ...prev, confirmationCode: code }));
  }, []);

  const resetBooking = useCallback(() => {
    setState(initialState);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const canProceed = useCallback(
    (step: number): boolean => isStepComplete(state, step),
    [state],
  );

  return {
    state,
    setVehicle,
    setFullName,
    setAge,
    setStops,
    setPassengers,
    setLuggage,
    setSnacks,
    setDrinks,
    setOrigin,
    setDestination,
    setPickupDate,
    setPickupTime,
    setDistance,
    setDuration,
    nextStep,
    prevStep,
    goToStep,
    setConfirmationCode,
    resetBooking,
    canProceed,
  };
};
