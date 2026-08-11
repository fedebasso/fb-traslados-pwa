import { Location } from '@/types/booking.types';

// Google Maps JS API loader + Places Autocomplete helpers.
// The key is a browser-restricted Maps key provided via env; when it is absent
// or the API fails, callers fall back to plain free-text address input.
const API_KEY = (import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string | undefined) || '';

export interface PlaceSuggestion {
  placeId: string;
  description: string;
  mainText: string;
  secondaryText: string;
}

export const isPlacesConfigured = (): boolean => API_KEY.length > 0;

type GoogleMaps = typeof google.maps;

let loaderPromise: Promise<GoogleMaps> | null = null;

export const loadGoogleMaps = (): Promise<GoogleMaps> => {
  if (!isPlacesConfigured()) {
    return Promise.reject(new Error('Google Maps API key not configured'));
  }
  if (typeof google !== 'undefined' && google.maps?.places) {
    return Promise.resolve(google.maps);
  }
  if (loaderPromise) return loaderPromise;

  loaderPromise = new Promise<GoogleMaps>((resolve, reject) => {
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(API_KEY)}&libraries=places&language=es&region=UY&loading=async&callback=__fbTrasladosMapsReady`;
    script.async = true;
    (window as unknown as Record<string, unknown>).__fbTrasladosMapsReady = () => {
      resolve(google.maps);
    };
    script.onerror = () => {
      loaderPromise = null;
      reject(new Error('Failed to load Google Maps'));
    };
    document.head.appendChild(script);
  });
  return loaderPromise;
};

let autocompleteService: google.maps.places.AutocompleteService | null = null;
let geocoder: google.maps.Geocoder | null = null;
let sessionToken: google.maps.places.AutocompleteSessionToken | null = null;

export const getSuggestions = async (input: string): Promise<PlaceSuggestion[]> => {
  const maps = await loadGoogleMaps();
  autocompleteService ??= new maps.places.AutocompleteService();
  sessionToken ??= new maps.places.AutocompleteSessionToken();

  const { predictions } = await autocompleteService.getPlacePredictions({
    input,
    sessionToken,
    componentRestrictions: { country: 'uy' },
  });

  return predictions.map(p => ({
    placeId: p.place_id,
    description: p.description,
    mainText: p.structured_formatting?.main_text ?? p.description,
    secondaryText: p.structured_formatting?.secondary_text ?? '',
  }));
};

// Resolves a selected suggestion into a full Location (address + coordinates).
export const resolvePlace = async (suggestion: PlaceSuggestion): Promise<Location> => {
  const maps = await loadGoogleMaps();
  geocoder ??= new maps.Geocoder();
  // A completed selection ends the Places billing session.
  sessionToken = null;

  const { results } = await geocoder.geocode({ placeId: suggestion.placeId });
  const result = results[0];
  if (!result) {
    return { address: suggestion.description, placeId: suggestion.placeId };
  }
  return {
    address: suggestion.description,
    placeId: suggestion.placeId,
    lat: result.geometry.location.lat(),
    lng: result.geometry.location.lng(),
  };
};
