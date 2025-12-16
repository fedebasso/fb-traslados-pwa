import { motion } from 'framer-motion';
import { WaterDropEffect } from './WaterDropEffect';
import { ChevronRight, Shield, Clock, Star } from 'lucide-react';

interface HeroSectionProps {
  onBookNow: () => void;
}

export const HeroSection = ({ onBookNow }: HeroSectionProps) => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-background via-background to-card">
      {/* Ambient background effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_hsl(45_70%_50%_/_0.05),_transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_hsl(222_47%_15%_/_0.3),_transparent_60%)]" />
      
      {/* Water ripple canvas */}
      <WaterDropEffect />
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="space-y-8"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium"
          >
            <Star className="w-4 h-4 fill-primary" />
            Premium Shuttle Service
          </motion.div>

          {/* Main headline */}
          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-bold leading-tight">
            <span className="text-foreground">Travel in</span>
            <br />
            <span className="text-gradient-gold">Elegance</span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Experience the pinnacle of comfort with our premium shuttle service. 
            Luxury vehicles, professional chauffeurs, and seamless journeys await.
          </p>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="pt-4"
          >
            <button
              onClick={onBookNow}
              className="group relative inline-flex items-center gap-3 btn-premium text-lg"
            >
              Book Your Premium Ride
              <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </button>
          </motion.div>

          {/* Trust indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="pt-12 flex flex-wrap items-center justify-center gap-8 md:gap-12"
          >
            <div className="flex items-center gap-3 text-muted-foreground">
              <div className="p-2 rounded-lg bg-primary/10">
                <Shield className="w-5 h-5 text-primary" />
              </div>
              <span className="text-sm">Insured & Licensed</span>
            </div>
            <div className="flex items-center gap-3 text-muted-foreground">
              <div className="p-2 rounded-lg bg-primary/10">
                <Clock className="w-5 h-5 text-primary" />
              </div>
              <span className="text-sm">24/7 Availability</span>
            </div>
            <div className="flex items-center gap-3 text-muted-foreground">
              <div className="p-2 rounded-lg bg-primary/10">
                <Star className="w-5 h-5 text-primary" />
              </div>
              <span className="text-sm">5-Star Rated</span>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};
