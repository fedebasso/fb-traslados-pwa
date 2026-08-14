import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { HeroSection } from '@/components/landing/HeroSection';
import { BookingWizard } from '@/components/booking/BookingWizard';
import { TopNav } from '@/components/layout/TopNav';

const Index = () => {
  const [showBooking, setShowBooking] = useState(false);

  return (
    <main className="min-h-[100dvh] bg-background safe-px">
      <TopNav showBooking={showBooking} onHome={() => setShowBooking(false)} />
      <div className="pt-20">
        <AnimatePresence mode="wait">
          {!showBooking ? (
            <HeroSection onBookNow={() => setShowBooking(true)} />
          ) : (
            <BookingWizard onClose={() => setShowBooking(false)} />
          )}
        </AnimatePresence>
      </div>
    </main>
  );
};

export default Index;
