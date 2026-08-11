import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { QRCodeSVG } from 'qrcode.react';
import { Check, CalendarPlus, Car, ArrowRight, Sparkles, Home, MessageCircle } from 'lucide-react';
import { BookingState, PricingBreakdown } from '@/types/booking.types';
import { vehicles } from './VehicleSelection';
import { buildBookingMessage, openWhatsApp } from '@/services/whatsapp';
import { format } from 'date-fns';
import { useTranslation } from 'react-i18next';
import { getDateLocale } from '@/lib/i18n';

interface ConfirmationProps {
  state: BookingState;
  pricing: PricingBreakdown;
  onBookAnother: () => void;
  onGoHome: () => void;
}

export const Confirmation = ({ state, onBookAnother, onGoHome }: ConfirmationProps) => {
  const [showContent, setShowContent] = useState(false);
  const vehicle = vehicles.find(v => v.id === state.vehicle);
  const { t, i18n } = useTranslation();
  const dateLocale = getDateLocale(i18n.language);
  const vehicleName = vehicle ? t(`vehicleSelection.vehicles.${vehicle.id}.name`, { defaultValue: vehicle.name }) : '';
  const vehicleModel = vehicle ? t(`vehicleSelection.vehicles.${vehicle.id}.model`, { defaultValue: vehicle.model }) : '';

  useEffect(() => {
    const timer = setTimeout(() => setShowContent(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  const qrData = JSON.stringify({
    code: state.confirmationCode,
    vehicle: state.vehicle,
    date: state.pickupDate?.toISOString(),
  });

  const handleAddToCalendar = () => {
    if (!state.pickupDate || !state.pickupTime) return;
    
    const [hours, minutes] = state.pickupTime.split(':');
    const startDate = new Date(state.pickupDate);
    startDate.setHours(parseInt(hours), parseInt(minutes));
    
    const endDate = new Date(startDate);
    endDate.setMinutes(endDate.getMinutes() + state.duration);
    
    const event = {
      title: t('confirmation.calendarTitle', { vehicle: vehicleName || vehicle?.name || '' }),
      start: startDate.toISOString().replace(/-|:|\.\d+/g, ''),
      end: endDate.toISOString().replace(/-|:|\.\d+/g, ''),
      location: state.origin?.address,
      description: t('confirmation.calendarDescription', {
        code: state.confirmationCode,
        vehicle: vehicleName || vehicle?.name || '',
        origin: state.origin?.address,
        destination: state.destination?.address,
      }),
    };
    
    const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&dates=${event.start}/${event.end}&location=${encodeURIComponent(event.location || '')}&details=${encodeURIComponent(event.description)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12">
      <div className="w-full max-w-2xl mx-auto px-4">
        {/* Success animation */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 20 }}
          className="relative w-24 h-24 mx-auto mb-8"
        >
          <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping" />
          <div className="relative w-full h-full rounded-full bg-gradient-to-br from-primary to-gold-dark flex items-center justify-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: 'spring' }}
            >
              <Check className="w-12 h-12 text-primary-foreground" strokeWidth={3} />
            </motion.div>
          </div>
          
          {/* Sparkles */}
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            className="absolute -top-2 -right-2"
          >
            <Sparkles className="w-6 h-6 text-primary" />
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: showContent ? 1 : 0, y: showContent ? 0 : 20 }}
          transition={{ duration: 0.5 }}
          className="space-y-8"
        >
          <div className="text-center space-y-2">
            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground">
              {(() => {
                const titleParts = t('confirmation.title').split(' ');
                const lastWord = titleParts.pop() || '';
                return (
                  <>
                    {titleParts.join(' ')} {''}
                    <span className="text-gradient-gold">{lastWord}</span>
                  </>
                );
              })()}
            </h1>
            <p className="text-lg text-muted-foreground">
              {t('confirmation.subtitle')}
            </p>
          </div>

          {/* Confirmation card */}
          <div className="glass-card p-6 md:p-8 space-y-6">
            {/* Confirmation code */}
            <div className="text-center pb-6 border-b border-border">
              <p className="text-sm text-muted-foreground mb-2">{t('confirmation.code')}</p>
              <p className="text-3xl font-mono font-bold text-gradient-gold tracking-wider">
                {state.confirmationCode}
              </p>
            </div>

            {/* QR Code */}
            <div className="flex justify-center">
              <div className="p-4 bg-white rounded-xl">
                <QRCodeSVG
                  value={qrData}
                  size={150}
                  level="H"
                  includeMargin={false}
                />
              </div>
            </div>
            <p className="text-xs text-center text-muted-foreground">
              {t('confirmation.qrNote')}
            </p>

            {/* Booking details */}
            <div className="space-y-4 pt-6 border-t border-border">
              <div className="flex items-center gap-4">
                <div className="w-16 h-12 rounded-lg bg-muted overflow-hidden flex-shrink-0">
                  {vehicle && <img src={vehicle.image} alt={vehicle.name} className="w-full h-full object-contain" />}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-foreground">{vehicleName}</p>
                  <p className="text-sm text-muted-foreground">{vehicleModel}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gradient-gold max-w-[120px]">
                    {t('confirmation.pricePending')}
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-muted/50">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-2 h-2 rounded-full bg-emerald-500" />
                  <p className="text-sm text-foreground">{state.origin?.address}</p>
                </div>
                <div className="flex items-center gap-3 pl-[3px] mb-3">
                  <ArrowRight className="w-4 h-4 text-muted-foreground" />
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  <p className="text-sm text-foreground">{state.destination?.address}</p>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{t('confirmation.pickupTime')}</span>
                <span className="text-foreground font-medium">
                  {state.pickupDate && format(state.pickupDate, 'MMM d, yyyy', { locale: dateLocale })} {t('dateTimePicker.pickupAt', { time: state.pickupTime || '' })}
                </span>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <button
            onClick={() =>
              openWhatsApp(
                buildBookingMessage(
                  state,
                  vehicle ? `${vehicle.name} (${vehicle.model})` : undefined,
                ),
              )
            }
            className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-[#25D366] text-white font-medium hover:brightness-95 transition-all"
          >
            <MessageCircle className="w-5 h-5" />
            {t('confirmation.resendWhatsApp')}
          </button>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleAddToCalendar}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-muted text-foreground font-medium hover:bg-muted/80 transition-colors"
            >
              <CalendarPlus className="w-5 h-5" />
              {t('confirmation.addToCalendar')}
            </button>
            <button
              onClick={onBookAnother}
              className="flex-1 btn-premium justify-center"
            >
              <Car className="w-5 h-5" />
              {t('confirmation.bookAnother')}
            </button>
          </div>

          <button
            onClick={onGoHome}
            className="w-full flex items-center justify-center gap-2 rounded-lg border border-border px-6 py-3 text-foreground hover:bg-muted/60 transition-colors"
          >
            <Home className="w-5 h-5" />
            {t('confirmation.goHome', { defaultValue: 'Go to home' })}
          </button>

          <p className="text-center text-sm text-muted-foreground">
            {t('confirmation.footer')
              .split('\n')
              .map((line, i) => (
                <span key={line}>
                  {line}
                  {i === 0 && <br />}
                </span>
              ))}
          </p>
        </motion.div>
      </div>
    </div>
  );
};
