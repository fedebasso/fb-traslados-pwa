import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { HeroSection } from '@/components/landing/HeroSection';
import { BookingWizard } from '@/components/booking/BookingWizard';

const Index = () => {
  const [showBooking, setShowBooking] = useState(false);

  return (
    <main className="min-h-screen bg-background">
      <AnimatePresence mode="wait">
        {!showBooking ? (
          <HeroSection onBookNow={() => setShowBooking(true)} />
        ) : (
          <BookingWizard onClose={() => setShowBooking(false)} />
        )}
      </AnimatePresence>
    </main>
  );
};

export default Index;
