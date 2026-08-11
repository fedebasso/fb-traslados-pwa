import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { enUS, es, ptBR } from "date-fns/locale";

export const languageOptions = [
  { code: "en", label: "English" },
  { code: "es", label: "Español" },
  { code: "pt-BR", label: "Português (Brasil)" },
];

const resources = {
  en: {
    translation: {
      nav: {
        brand: "FB | TRASLADOS",
        tagline: "Luxury Ride",
        menu: {
          home: "Home",
          fleet: "Fleet",
          services: "Services",
          contact: "Contact",
        },
        book: "Book a ride",
        language: "Language",
      },
      hero: {
        badge: "Premium Shuttle Service",
        title: {
          lead: "Travel in",
          highlight: "Elegance",
        },
        subtitle:
          "Experience the pinnacle of comfort with our premium shuttle service. Luxury vehicles, professional chauffeurs, and seamless journeys await.",
        cta: "Book Your Premium Ride",
        trust: {
          insured: "Insured & Licensed",
          availability: "24/7 Availability",
          rating: "5-Star Rated",
        },
      },
      bookingWizard: {
        title: "Book Your Ride",
        steps: {
          vehicle: "Vehicle",
          details: "Details",
          location: "Location",
          schedule: "Schedule",
          review: "Review",
          confirmed: "Confirmed",
        },
        actions: {
          back: "Back",
          continue: "Continue",
          estimated: "Estimated",
          confirm: "Confirm Booking",
          bookAnother: "Book Another Ride",
          addToCalendar: "Add to Calendar",
        },
      },
      vehicleSelection: {
        title: "Choose Your Vehicle",
        subtitle: "Select the perfect ride for your journey",
        ecoBadge: "Eco-Friendly",
        capacity: {
          passengers_one: "{{count}} passenger",
          passengers_other: "{{count}} passengers",
          luggage_one: "{{count}} bag",
          luggage_other: "{{count}} bags",
        },
        vehicles: {
          byd: {
            name: "BYD Yuan Pro",
            model: "Electric SUV",
          },
          onix: {
            name: "Chevrolet Onix",
            model: "Premium Sedan",
          },
        },
        features: {
          electric: "100% Electric",
          panoramicRoof: "Panoramic Roof",
          premiumSound: "Premium Sound",
          climateControl: "Climate Control",
          fuelEfficient: "Fuel Efficient",
          leatherSeats: "Leather Seats",
          bluetooth: "Bluetooth Audio",
          usbCharging: "USB Charging",
        },
      },
      tripDetails: {
        title: "Trip Details",
        subtitle: "Customize your journey experience",
        passengersAndLuggage: "Passengers & Luggage",
        passengerCount: "Number of Passengers",
        maxPassengers: "Maximum capacity reached",
        luggageLabel: "Luggage Items",
        amenities: "Amenities",
        optional: "(optional)",
        musicPreference: "Music Preference",
        musicOptions: {
          classical: "Classical",
          jazz: "Jazz",
          pop: "Pop",
          electronic: "Electronic",
          silence: "Silence",
        },
        snacks: "Premium Snacks",
        snackDescription: "Gourmet snack selection",
        beverages: "Beverages",
        drinkOptions: {
          water: "Water",
          sparklingWater: "Sparkling Water",
          softDrinks: "Soft Drinks",
        },
      },
      locationPicker: {
        title: "Select Locations",
        subtitle: "Where would you like to go?",
        pickupPlaceholder: "Pickup location",
        dropoffPlaceholder: "Drop-off location",
        estimatedRoute: "Estimated Route",
        routeLabel: "{{from}} \u2192 {{to}}",
        distanceLabel: "{{distance}} km",
        durationLabel: "~{{minutes}} min",
        popular: "Popular destinations",
      },
      dateTimePicker: {
        title: "Pick Date & Time",
        subtitle: "When should we pick you up?",
        selectDate: "Select Date",
        selectTime: "Select Time",
        pickupAt: "Pickup at {{time}}",
        scheduleSummary: "Your pickup is scheduled for {{date}} at {{time}}",
        weekdays: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
      },
      bookingSummary: {
        title: "Review Your Booking",
        subtitle: "Please confirm all details before proceeding",
        vehicle: "Vehicle",
        tripDetails: "Trip Details",
        passengers: "Passengers",
        luggage: "Luggage",
        music: "Music",
        snacks: "Snacks",
        snacksIncluded: "Included",
        beverages: "Beverages",
        route: "Route",
        pickup: "Pickup",
        dropoff: "Drop-off",
        estimatedDistance: "Estimated distance",
        pickupSchedule: "Pickup Schedule",
        priceBreakdown: "Price Breakdown",
        baseFare: "Base fare",
        distanceCharge: "Distance ({{distance}} km)",
        extraPassengers: "Extra passengers",
        amenities: "Amenities",
        total: "Total",
        confirmCta: "Confirm Booking",
        terms: "By confirming, you agree to our terms of service",
      },
      confirmation: {
        title: "Booking Confirmed!",
        subtitle: "Your premium ride has been successfully booked",
        code: "Confirmation Code",
        qrNote: "Show this QR code to your driver for verification",
        pickupTime: "Pickup Date & Time",
        addToCalendar: "Add to Calendar",
        bookAnother: "Book Another Ride",
        goHome: "Go to home",
        footer:
          "A confirmation email has been sent with all the details.\nThank you for choosing Premium Shuttle!",
        calendarTitle: "Premium Shuttle - {{vehicle}}",
        calendarDescription:
          "Confirmation: {{code}}\nVehicle: {{vehicle}}\nFrom: {{origin}}\nTo: {{destination}}",
      },
    },
  },
  es: {
    translation: {
      nav: {
        brand: "FB | TRASLADOS",
        tagline: "Luxury Ride",
        menu: {
          home: "Inicio",
          fleet: "Flota",
          services: "Servicios",
          contact: "Contacto",
        },
        book: "Reservar viaje",
        language: "Idioma",
      },
      hero: {
        badge: "Servicio de traslado premium",
        title: {
          lead: "Viaja con",
          highlight: "Elegancia",
        },
        subtitle:
          "Experimenta el pináculo del confort con nuestro servicio de traslado premium. Vehículos de lujo, choferes profesionales y trayectos sin fricciones.",
        cta: "Reserva tu viaje premium",
        trust: {
          insured: "Asegurado y habilitado",
          availability: "Disponibilidad 24/7",
          rating: "Calificación 5 estrellas",
        },
      },
      bookingWizard: {
        title: "Reserva tu viaje",
        steps: {
          vehicle: "Vehículo",
          details: "Detalles",
          location: "Ubicación",
          schedule: "Horario",
          review: "Revisar",
          confirmed: "Confirmado",
        },
        actions: {
          back: "Atrás",
          continue: "Continuar",
          estimated: "Estimado",
          confirm: "Confirmar reserva",
          bookAnother: "Reservar otro viaje",
          addToCalendar: "Agregar al calendario",
        },
      },
      vehicleSelection: {
        title: "Elige tu vehículo",
        subtitle: "Selecciona el auto perfecto para tu viaje",
        ecoBadge: "Ecológico",
        capacity: {
          passengers_one: "{{count}} pasajero",
          passengers_other: "{{count}} pasajeros",
          luggage_one: "{{count}} maleta",
          luggage_other: "{{count}} maletas",
        },
        vehicles: {
          byd: {
            name: "BYD Yuan Pro",
            model: "SUV eléctrica",
          },
          onix: {
            name: "Chevrolet Onix",
            model: "Sedán premium",
          },
        },
        features: {
          electric: "100% eléctrico",
          panoramicRoof: "Techo panorámico",
          premiumSound: "Sonido premium",
          climateControl: "Climatizador",
          fuelEfficient: "Eficiente en combustible",
          leatherSeats: "Asientos de cuero",
          bluetooth: "Audio Bluetooth",
          usbCharging: "Carga USB",
        },
      },
      tripDetails: {
        title: "Detalles del viaje",
        subtitle: "Personaliza tu experiencia",
        passengersAndLuggage: "Pasajeros y equipaje",
        passengerCount: "Número de pasajeros",
        maxPassengers: "Capacidad máxima alcanzada",
        luggageLabel: "Piezas de equipaje",
        amenities: "Comodidades",
        optional: "(opcional)",
        musicPreference: "Preferencia musical",
        musicOptions: {
          classical: "Clásica",
          jazz: "Jazz",
          pop: "Pop",
          electronic: "Electrónica",
          silence: "Silencio",
        },
        snacks: "Snacks premium",
        snackDescription: "Selección gourmet de snacks",
        beverages: "Bebidas",
        drinkOptions: {
          water: "Agua",
          sparklingWater: "Agua con gas",
          softDrinks: "Bebidas sin alcohol",
        },
      },
      locationPicker: {
        title: "Selecciona ubicaciones",
        subtitle: "¿A dónde te llevamos?",
        pickupPlaceholder: "Lugar de recogida",
        dropoffPlaceholder: "Lugar de destino",
        estimatedRoute: "Ruta estimada",
        routeLabel: "{{from}} \u2192 {{to}}",
        distanceLabel: "{{distance}} km",
        durationLabel: "~{{minutes}} min",
        popular: "Destinos populares",
      },
      dateTimePicker: {
        title: "Elige fecha y hora",
        subtitle: "¿Cuándo te recogemos?",
        selectDate: "Selecciona fecha",
        selectTime: "Selecciona hora",
        pickupAt: "Recogida a las {{time}}",
        scheduleSummary: "Tu recogida está programada para {{date}} a las {{time}}",
        weekdays: ["Do", "Lu", "Ma", "Mi", "Ju", "Vi", "Sa"],
      },
      bookingSummary: {
        title: "Revisa tu reserva",
        subtitle: "Confirma todos los detalles antes de continuar",
        vehicle: "Vehículo",
        tripDetails: "Detalles del viaje",
        passengers: "Pasajeros",
        luggage: "Equipaje",
        music: "Música",
        snacks: "Snacks",
        snacksIncluded: "Incluido",
        beverages: "Bebidas",
        route: "Ruta",
        pickup: "Recogida",
        dropoff: "Destino",
        estimatedDistance: "Distancia estimada",
        pickupSchedule: "Horario de recogida",
        priceBreakdown: "Desglose de precios",
        baseFare: "Tarifa base",
        distanceCharge: "Distancia ({{distance}} km)",
        extraPassengers: "Pasajeros extra",
        amenities: "Comodidades",
        total: "Total",
        confirmCta: "Confirmar reserva",
        terms: "Al confirmar aceptas nuestros términos de servicio",
      },
      confirmation: {
        title: "¡Reserva confirmada!",
        subtitle: "Tu viaje premium ha sido reservado con éxito",
        code: "Código de confirmación",
        qrNote: "Muestra este código QR al conductor para verificar",
        pickupTime: "Fecha y hora de recogida",
        addToCalendar: "Agregar al calendario",
        bookAnother: "Reservar otro viaje",
        goHome: "Volver al inicio",
        footer:
          "Se envió un correo de confirmación con todos los detalles.\nGracias por elegir Premium Shuttle!",
        calendarTitle: "Traslado premium - {{vehicle}}",
        calendarDescription:
          "Confirmación: {{code}}\nVehículo: {{vehicle}}\nDesde: {{origin}}\nHasta: {{destination}}",
      },
    },
  },
  "pt-BR": {
    translation: {
      nav: {
        brand: "FB | TRASLADOS",
        tagline: "Luxury Ride",
        menu: {
          home: "Início",
          fleet: "Frota",
          services: "Serviços",
          contact: "Contato",
        },
        book: "Reservar viagem",
        language: "Idioma",
      },
      hero: {
        badge: "Serviço de traslado premium",
        title: {
          lead: "Viaje com",
          highlight: "Elegância",
        },
        subtitle:
          "Experimente o auge do conforto com nosso serviço premium. Veículos de luxo, motoristas profissionais e trajetos sem fricção.",
        cta: "Reserve sua viagem premium",
        trust: {
          insured: "Segurado e licenciado",
          availability: "Disponível 24/7",
          rating: "Avaliação 5 estrelas",
        },
      },
      bookingWizard: {
        title: "Reserve sua viagem",
        steps: {
          vehicle: "Veículo",
          details: "Detalhes",
          location: "Local",
          schedule: "Horário",
          review: "Revisar",
          confirmed: "Confirmado",
        },
        actions: {
          back: "Voltar",
          continue: "Continuar",
          estimated: "Estimativa",
          confirm: "Confirmar reserva",
          bookAnother: "Reservar outra viagem",
          addToCalendar: "Adicionar ao calendário",
        },
      },
      vehicleSelection: {
        title: "Escolha seu veículo",
        subtitle: "Selecione o carro ideal para a viagem",
        ecoBadge: "Ecológico",
        capacity: {
          passengers_one: "{{count}} passageiro",
          passengers_other: "{{count}} passageiros",
          luggage_one: "{{count}} mala",
          luggage_other: "{{count}} malas",
        },
        vehicles: {
          byd: {
            name: "BYD Yuan Pro",
            model: "SUV elétrica",
          },
          onix: {
            name: "Chevrolet Onix",
            model: "Sedã premium",
          },
        },
        features: {
          electric: "100% elétrico",
          panoramicRoof: "Teto panorâmico",
          premiumSound: "Som premium",
          climateControl: "Ar-condicionado digital",
          fuelEfficient: "Eficiente em combustível",
          leatherSeats: "Bancos de couro",
          bluetooth: "Áudio Bluetooth",
          usbCharging: "Carregamento USB",
        },
      },
      tripDetails: {
        title: "Detalhes da viagem",
        subtitle: "Personalize sua experiência",
        passengersAndLuggage: "Passageiros e bagagem",
        passengerCount: "Número de passageiros",
        maxPassengers: "Capacidade máxima atingida",
        luggageLabel: "Volumes de bagagem",
        amenities: "Comodidades",
        optional: "(opcional)",
        musicPreference: "Preferência musical",
        musicOptions: {
          classical: "Clássica",
          jazz: "Jazz",
          pop: "Pop",
          electronic: "Eletrônica",
          silence: "Silêncio",
        },
        snacks: "Snacks premium",
        snackDescription: "Seleção gourmet de snacks",
        beverages: "Bebidas",
        drinkOptions: {
          water: "Água",
          sparklingWater: "Água com gás",
          softDrinks: "Refrigerantes",
        },
      },
      locationPicker: {
        title: "Selecione os locais",
        subtitle: "Para onde devemos levá-lo?",
        pickupPlaceholder: "Local de embarque",
        dropoffPlaceholder: "Local de destino",
        estimatedRoute: "Rota estimada",
        routeLabel: "{{from}} \u2192 {{to}}",
        distanceLabel: "{{distance}} km",
        durationLabel: "~{{minutes}} min",
        popular: "Destinos populares",
      },
      dateTimePicker: {
        title: "Escolha data e horário",
        subtitle: "Quando devemos buscá-lo?",
        selectDate: "Selecione a data",
        selectTime: "Selecione o horário",
        pickupAt: "Embarque às {{time}}",
        scheduleSummary: "Seu embarque está marcado para {{date}} às {{time}}",
        weekdays: ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"],
      },
      bookingSummary: {
        title: "Revise sua reserva",
        subtitle: "Confirme todos os detalhes antes de continuar",
        vehicle: "Veículo",
        tripDetails: "Detalhes da viagem",
        passengers: "Passageiros",
        luggage: "Bagagem",
        music: "Música",
        snacks: "Snacks",
        snacksIncluded: "Incluído",
        beverages: "Bebidas",
        route: "Rota",
        pickup: "Embarque",
        dropoff: "Desembarque",
        estimatedDistance: "Distância estimada",
        pickupSchedule: "Horário de embarque",
        priceBreakdown: "Detalhamento de preço",
        baseFare: "Tarifa base",
        distanceCharge: "Distância ({{distance}} km)",
        extraPassengers: "Passageiros extras",
        amenities: "Comodidades",
        total: "Total",
        confirmCta: "Confirmar reserva",
        terms: "Ao confirmar, você concorda com nossos termos de serviço",
      },
      confirmation: {
        title: "Reserva confirmada!",
        subtitle: "Sua viagem premium foi reservada com sucesso",
        code: "Código de confirmação",
        qrNote: "Mostre este QR code ao motorista para verificação",
        pickupTime: "Data e horário de embarque",
        addToCalendar: "Adicionar ao calendário",
        bookAnother: "Reservar outra viagem",
        goHome: "Voltar para o início",
        footer:
          "Um e-mail de confirmação foi enviado com todos os detalhes.\nObrigado por escolher a Premium Shuttle!",
        calendarTitle: "Traslado premium - {{vehicle}}",
        calendarDescription:
          "Confirmação: {{code}}\nVeículo: {{vehicle}}\nDe: {{origin}}\nPara: {{destination}}",
      },
    },
  },
};

const storedLanguage = typeof window !== "undefined" ? localStorage.getItem("language") : null;
const fallbackLng = "es";

i18n.use(initReactI18next).init({
  resources,
  lng: storedLanguage || fallbackLng,
  fallbackLng,
  interpolation: { escapeValue: false },
  react: { useSuspense: false },
});

if (typeof window !== "undefined") {
  document.documentElement.lang = i18n.language;
}

i18n.on("languageChanged", (lng) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("language", lng);
    document.documentElement.lang = lng;
  }
});

export const getDateLocale = (lng?: string) => {
  switch (lng) {
    case "es":
      return es;
    case "pt-BR":
      return ptBR;
    default:
      return enUS;
  }
};

export default i18n;
