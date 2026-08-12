import { motion } from 'framer-motion';
import { WaterDropEffect } from './WaterDropEffect';
import { ChevronRight, Shield, Clock, Star } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import fbLogo from '@/assets/logo-fb-dark.png';

interface HeroSectionProps {
  onBookNow: () => void;
}

export const HeroSection = ({ onBookNow }: HeroSectionProps) => {
  const { t } = useTranslation();

  return (
    <section className="relative flex min-h-[100dvh] flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-background via-background to-card pt-16 sm:pt-20 safe-px safe-pt safe-pb">
      {/* Ambient background effects — cálidos */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_hsl(30_46%_60%_/_0.12),_transparent_55%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_hsl(28_42%_52%_/_0.08),_transparent_60%)]" />
      
      {/* Water ripple canvas */}
      <WaterDropEffect />
      
      {/* Content */}
      <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-col items-center px-6 py-10 text-center sm:px-8 sm:py-16 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="space-y-5 sm:space-y-8"
        >
          <div className="flex justify-center">
            <img
              src={fbLogo}
              alt={t('nav.brand')}
              className="mx-auto block h-auto w-full max-w-[15rem] sm:max-w-xs object-contain"
              loading="eager"
            />
          </div>

          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="flex items-center justify-center gap-4 text-primary"
          >
            <span className="h-px w-10 bg-primary/40" />
            <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-[0.28em] whitespace-nowrap">
              {t('hero.badge')}
            </span>
            <span className="h-px w-10 bg-primary/40" />
          </motion.div>

          {/* Main headline */}
          <h1 className="font-display text-[clamp(2.5rem,6vw,4.75rem)] font-bold leading-tight">
            <span className="text-foreground">{t('hero.title.lead')}</span>
            <br />
            <span className="text-gradient-gold">{t('hero.title.highlight')}</span>
          </h1>

          {/* Subtitle */}
          <p className="mx-auto max-w-2xl px-2 text-base leading-relaxed text-muted-foreground sm:px-0 sm:text-lg">
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
            className="pt-6 sm:pt-12 flex flex-wrap items-center justify-center gap-x-5 gap-y-3 text-muted-foreground"
          >
            <span className="inline-flex items-center gap-2 text-sm">
              <Shield className="w-4 h-4 text-primary" />
              {t('hero.trust.insured')}
            </span>
            <span className="hidden sm:inline-block h-4 w-px bg-border" />
            <span className="inline-flex items-center gap-2 text-sm">
              <Clock className="w-4 h-4 text-primary" />
              {t('hero.trust.availability')}
            </span>
            <span className="hidden sm:inline-block h-4 w-px bg-border" />
            <span className="inline-flex items-center gap-2 text-sm">
              <Star className="w-4 h-4 text-primary" />
              {t('hero.trust.rating')}
            </span>
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};
