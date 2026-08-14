import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useBookingState, STEPS, CONFIRMED_STEP, StepId } from '@/hooks/useBookingState';
import { generateConfirmationCode } from '@/services/confirmationCode';
import { buildBookingMessage, openWhatsApp } from '@/services/whatsapp';
import { cleanOrderItems } from '@/lib/orderItems';
import { StepIndicator } from './StepIndicator';
import { VehicleSelection, vehicles } from './VehicleSelection';
import { ContactDetails } from './ContactDetails';
import { TripDetails } from './TripDetails';
import { LocationPicker } from './LocationPicker';
import { DateTimePicker } from './DateTimePicker';
import { BookingSummary } from './BookingSummary';
import { Confirmation } from './Confirmation';
import { useTranslation } from 'react-i18next';

interface BookingWizardProps {
  onClose: () => void;
}

export const BookingWizard = ({ onClose }: BookingWizardProps) => {
  const {
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
  } = useBookingState();

  const [direction, setDirection] = useState(1);
  const { t } = useTranslation();

  // Labels for the navigable steps, derived from the active flow config.
  const stepLabelKeys: Record<StepId, string> = {
    vehicle: 'bookingWizard.steps.vehicle',
    contact: 'bookingWizard.steps.contact',
    details: 'bookingWizard.steps.details',
    location: 'bookingWizard.steps.location',
    schedule: 'bookingWizard.steps.schedule',
    review: 'bookingWizard.steps.review',
  };
  const stepLabels = STEPS.map(id => t(stepLabelKeys[id]));

  const selectedVehicle = vehicles.find(v => v.id === state.vehicle);
  // Explicit defaults so passenger/luggage limits don't depend on a selected
  // vehicle (the vehicle step is currently disabled).
  const maxPassengers = selectedVehicle?.passengers ?? 4;
  const maxLuggage = selectedVehicle?.luggage ?? 3;

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const handleNext = () => {
    if (!canProceed(state.currentStep)) return;
    // Las filas vacías se descartan al salir del paso de detalles.
    if (STEPS[state.currentStep] === 'details') {
      setSnacks(cleanOrderItems(state.snacks));
      setDrinks(cleanOrderItems(state.drinks));
    }
    setDirection(1);
    nextStep();
  };

  const handlePrev = () => {
    setDirection(-1);
    prevStep();
  };

  const handleGoToStep = (step: number) => {
    setDirection(step > state.currentStep ? 1 : -1);
    goToStep(step);
  };

  const handleConfirm = () => {
    const code = generateConfirmationCode();
    setConfirmationCode(code);
    const vehicleName = selectedVehicle
      ? `${selectedVehicle.name} (${selectedVehicle.model})`
      : undefined;
    openWhatsApp(buildBookingMessage({ ...state, confirmationCode: code }, vehicleName));
    setDirection(1);
    goToStep(CONFIRMED_STEP);
  };

  const handleBookAnother = () => {
    resetBooking();
    setDirection(-1);
    goToStep(0);
  };

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 100 : -100,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction > 0 ? -100 : 100,
      opacity: 0,
    }),
  };

  const renderStep = () => {
    if (state.currentStep === CONFIRMED_STEP) {
      return (
        <Confirmation
          state={state}
          onBookAnother={handleBookAnother}
          onGoHome={onClose}
        />
      );
    }

    switch (STEPS[state.currentStep]) {
      case 'vehicle':
        return <VehicleSelection selected={state.vehicle} onSelect={setVehicle} />;
      case 'contact':
        return (
          <ContactDetails
            fullName={state.fullName}
            age={state.age}
            onFullNameChange={setFullName}
            onAgeChange={setAge}
          />
        );
      case 'details':
        return (
          <TripDetails
            passengers={state.passengers}
            luggage={state.luggage}
            snacks={state.snacks}
            drinks={state.drinks}
            maxPassengers={maxPassengers}
            maxLuggage={maxLuggage}
            onPassengersChange={setPassengers}
            onLuggageChange={setLuggage}
            onSnacksChange={setSnacks}
            onDrinksChange={setDrinks}
          />
        );
      case 'location':
        return (
          <LocationPicker
            origin={state.origin}
            destination={state.destination}
            onOriginChange={setOrigin}
            onDestinationChange={setDestination}
            onDistanceChange={setDistance}
            onDurationChange={setDuration}
            stops={state.stops}
            onStopsChange={setStops}
          />
        );
      case 'schedule':
        return (
          <DateTimePicker
            selectedDate={state.pickupDate}
            selectedTime={state.pickupTime}
            onDateChange={setPickupDate}
            onTimeChange={setPickupTime}
          />
        );
      case 'review':
        return (
          <BookingSummary
            state={state}
            onEdit={handleGoToStep}
            onConfirm={handleConfirm}
          />
        );
      default:
        return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-background flex flex-col"
    >
      {/* Header */}
      {state.currentStep < CONFIRMED_STEP && (
        <div className="flex-shrink-0 z-10 bg-background/80 backdrop-blur-xl border-b border-border safe-px safe-pt">
          <div className="container mx-auto px-5 py-4">
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </button>
              <h1 className="font-display text-xl font-semibold text-foreground">
                {t('bookingWizard.title')}
              </h1>
              <div className="w-9" /> {/* Spacer */}
            </div>
            <StepIndicator
              currentStep={state.currentStep}
              totalSteps={STEPS.length}
              stepLabels={stepLabels}
            />
          </div>
        </div>
      )}

      {/* Content */}
      <div
        className="flex-1 min-h-0 overflow-y-auto"
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
        <div className="container mx-auto px-5 py-8">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={state.currentStep}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3, ease: 'easeInOut' }}
            >
              {renderStep()}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Footer navigation */}
      {state.currentStep < STEPS.length - 1 && (
        <div className="flex-shrink-0 bg-card/95 backdrop-blur-xl border-t border-border safe-px safe-pb shadow-[0_-6px_24px_hsl(30_25%_30%_/_0.08)]">
          <div className="container mx-auto px-5 py-3">
            <div className="flex items-center justify-between gap-2">
              <button
                onClick={handlePrev}
                disabled={state.currentStep === 0}
                className="flex items-center gap-1.5 px-3 py-3 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors disabled:opacity-0 min-h-12"
              >
                <ChevronLeft className="w-5 h-5" />
                <span className="hidden sm:inline">{t('bookingWizard.actions.back')}</span>
              </button>

              {/* Step progress */}
              <p className="text-xs text-muted-foreground text-center">
                {t('bookingWizard.stepOf', {
                  current: state.currentStep + 1,
                  total: STEPS.length,
                })}
              </p>

              <button
                onClick={handleNext}
                disabled={!canProceed(state.currentStep)}
                className="flex items-center gap-1.5 btn-premium px-5 py-3 min-h-12 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {t('bookingWizard.actions.continue')}
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};
