export type VehicleType = 'byd' | 'onix' | null;

export type MusicPreference = 'classical' | 'jazz' | 'pop' | 'electronic' | 'silence' | 'custom';

export interface Location {
  address: string;
  lat?: number;
  lng?: number;
  placeId?: string;
}

export interface BookingState {
  currentStep: number;
  vehicle: VehicleType;
  fullName: string;
  age: string;
  stops: Location[];
  passengers: number;
  luggage: number;
  music: MusicPreference | null;
  snacks: boolean;
  drinks: string[];
  origin: Location | null;
  destination: Location | null;
  pickupDate: Date | null;
  pickupTime: string | null;
  distance: number;
  duration: number;
  confirmationCode?: string;
}

export interface Vehicle {
  id: VehicleType;
  name: string;
  model: string;
  passengers: number;
  luggage: number;
  features: string[];
  image: string;
  eco?: boolean;
}
