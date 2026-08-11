import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useBookingState } from '@/hooks/useBookingState';
import { calculatePricing, generateConfirmationCode } from '@/services/pricingCalculator';
import { StepIndicator } from './StepIndicator';
import { VehicleSelection, vehicles } from './VehicleSelection';
import { TripDetails } from './TripDetails';
import { LocationPicker } from './LocationPicker';
import { DateTimePicker } from './DateTimePicker';
import { BookingSummary } from './BookingSummary';
import { Confirmation } from './Confirmation';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';

interface BookingWizardProps {
  onClose: () => void;
}

export const BookingWizard = ({ onClose }: BookingWizardProps) => {
  const {
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
    nextStep,
    prevStep,
    goToStep,
    setConfirmationCode,
    resetBooking,
    canProceed,
  } = useBookingState();

  const [direction, setDirection] = useState(1);
  const pricing = calculatePricing(state);
  const { t } = useTranslation();
  const stepLabels = [
    t('bookingWizard.steps.vehicle'),
    t('bookingWizard.steps.details'),
    t('bookingWizard.steps.location'),
    t('bookingWizard.steps.schedule'),
    t('bookingWizard.steps.review'),
    t('bookingWizard.steps.confirmed'),
  ];
  
  const selectedVehicle = vehicles.find(v => v.id === state.vehicle);
  const maxPassengers = selectedVehicle?.passengers || 4;
  const maxLuggage = selectedVehicle?.luggage || 3;

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const handleNext = () => {
    if (canProceed(state.currentStep)) {
      setDirection(1);
      nextStep();
    }
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
    setDirection(1);
    goToStep(5);
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
    switch (state.currentStep) {
      case 0:
        return <VehicleSelection selected={state.vehicle} onSelect={setVehicle} />;
      case 1:
        return (
          <TripDetails
            passengers={state.passengers}
            luggage={state.luggage}
            music={state.music}
            snacks={state.snacks}
            drinks={state.drinks}
            maxPassengers={maxPassengers}
            maxLuggage={maxLuggage}
            onPassengersChange={setPassengers}
            onLuggageChange={setLuggage}
            onMusicChange={setMusic}
            onSnacksChange={setSnacks}
            onDrinksChange={setDrinks}
          />
        );
      case 2:
        return (
          <LocationPicker
            origin={state.origin}
            destination={state.destination}
            onOriginChange={setOrigin}
            onDestinationChange={setDestination}
            onDistanceChange={setDistance}
            onDurationChange={setDuration}
          />
        );
      case 3:
        return (
          <DateTimePicker
            selectedDate={state.pickupDate}
            selectedTime={state.pickupTime}
            onDateChange={setPickupDate}
            onTimeChange={setPickupTime}
          />
        );
      case 4:
        return (
          <BookingSummary
            state={state}
            pricing={pricing}
            onEdit={handleGoToStep}
            onConfirm={handleConfirm}
          />
        );
      case 5:
        return (
          <Confirmation
            state={state}
            pricing={pricing}
            onBookAnother={handleBookAnother}
            onGoHome={onClose}
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
      className="fixed inset-0 z-50 bg-background"
    >
      {/* Header */}
      {state.currentStep < 5 && (
        <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-xl border-b border-border safe-px safe-pt">
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
              totalSteps={5}
              stepLabels={stepLabels.slice(0, 5)}
            />
          </div>
        </div>
      )}

      {/* Content */}
      <div
        className={`${
          state.currentStep < 5 ? 'h-[calc(100dvh-180px)]' : 'h-[100dvh]'
        } overflow-y-auto`}
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
        <div
          className={cn(
            'container mx-auto px-5 py-8',
            state.currentStep < 4 ? 'pb-32' : 'pb-8',
          )}
        >
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
      {state.currentStep < 4 && (
        <div className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-xl border-t border-border safe-px safe-pb shadow-[0_-6px_24px_hsl(30_25%_30%_/_0.08)]">
          <div className="container mx-auto px-5 py-4">
            <div className="flex items-center justify-between">
              <button
                onClick={handlePrev}
                disabled={state.currentStep === 0}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors disabled:opacity-0"
              >
                <ChevronLeft className="w-5 h-5" />
                {t('bookingWizard.actions.back')}
              </button>

              {/* Price preview */}
              {state.vehicle && (
                <div className="text-center">
                  <p className="text-xs text-muted-foreground">{t('bookingWizard.actions.estimated')}</p>
                  <p className="text-lg font-display font-bold text-gradient-gold">
                    ${pricing.total.toFixed(2)}
                  </p>
                </div>
              )}

              <button
                onClick={handleNext}
                disabled={!canProceed(state.currentStep)}
                className="flex items-center gap-2 btn-premium disabled:opacity-50 disabled:cursor-not-allowed"
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
