import { motion } from 'framer-motion';
import { WaterDropEffect } from './WaterDropEffect';
import { ChevronRight, Shield, Clock, Star } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import fbLogoMobile from '@/assets/Fb_logo_2_192x192.png';
import fbLogoDesktop from '@/assets/Fb_logo_2_512x512.png';

interface HeroSectionProps {
  onBookNow: () => void;
}

export const HeroSection = ({ onBookNow }: HeroSectionProps) => {
  const { t } = useTranslation();

  return (
    <section className="relative flex min-h-[100dvh] flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-background via-background to-card pt-20 safe-px safe-pt safe-pb">
      {/* Ambient background effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_hsl(45_70%_50%_/_0.05),_transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_hsl(222_47%_15%_/_0.3),_transparent_60%)]" />
      
      {/* Water ripple canvas */}
      <WaterDropEffect />
      
      {/* Content */}
      <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-col items-center px-4 py-16 text-center sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="space-y-8"
        >
          <div className="flex justify-center" style={{ marginBottom: '5px' }}>
            <picture className="mx-auto block w-full max-w-xs sm:max-w-sm">
              <source media="(min-width: 768px)" srcSet={fbLogoDesktop} />
              <img
                src={fbLogoMobile}
                alt={t('nav.brand')}
                className="h-auto w-full object-contain"
                loading="lazy"
                sizes="(min-width: 768px) 400px, 240px"
              />
            </picture>
          </div>

          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium"
          >
            <Star className="w-4 h-4 fill-primary" />
            {t('hero.badge')}
          </motion.div>

          {/* Main headline */}
          <h1 className="font-display text-[clamp(2.5rem,6vw,4.75rem)] font-bold leading-tight">
            <span className="text-foreground">{t('hero.title.lead')}</span>
            <br />
            <span className="text-gradient-gold">{t('hero.title.highlight')}</span>
          </h1>

          {/* Subtitle */}
          <p className="mx-auto max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            {t('hero.subtitle')}
          </p>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="pt-4"
          >
            <button onClick={onBookNow} className="group relative inline-flex items-center gap-3 btn-premium text-lg min-h-[56px]">
              {t('hero.cta')}
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
              <span className="text-sm">{t('hero.trust.insured')}</span>
            </div>
            <div className="flex items-center gap-3 text-muted-foreground">
              <div className="p-2 rounded-lg bg-primary/10">
                <Clock className="w-5 h-5 text-primary" />
              </div>
              <span className="text-sm">{t('hero.trust.availability')}</span>
            </div>
            <div className="flex items-center gap-3 text-muted-foreground">
              <div className="p-2 rounded-lg bg-primary/10">
                <Star className="w-5 h-5 text-primary" />
              </div>
              <span className="text-sm">{t('hero.trust.rating')}</span>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};
