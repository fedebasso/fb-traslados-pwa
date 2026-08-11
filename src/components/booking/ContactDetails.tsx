import { motion } from 'framer-motion';
import { User, Cake } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface ContactDetailsProps {
  fullName: string;
  age: string;
  onFullNameChange: (value: string) => void;
  onAgeChange: (value: string) => void;
}

export const ContactDetails = ({
  fullName,
  age,
  onFullNameChange,
  onAgeChange,
}: ContactDetailsProps) => {
  const { t } = useTranslation();

  return (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
          {t('contactDetails.title')}
        </h2>
        <p className="text-muted-foreground">
          {t('contactDetails.subtitle')}
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-6 space-y-6 max-w-xl mx-auto"
      >
        <div className="space-y-2">
          <label htmlFor="booking-full-name" className="text-sm font-medium text-foreground">
            {t('contactDetails.fullName')}
          </label>
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary" />
            <input
              id="booking-full-name"
              type="text"
              autoComplete="name"
              value={fullName}
              onChange={(e) => onFullNameChange(e.target.value)}
              placeholder={t('contactDetails.fullNamePlaceholder')}
              className="input-premium w-full pl-12"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="booking-age" className="text-sm font-medium text-foreground">
            {t('contactDetails.age')}
          </label>
          <div className="relative">
            <Cake className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary" />
            <input
              id="booking-age"
              type="number"
              inputMode="numeric"
              min={1}
              max={120}
              value={age}
              onChange={(e) => onAgeChange(e.target.value)}
              placeholder={t('contactDetails.agePlaceholder')}
              className="input-premium w-full pl-12"
            />
          </div>
        </div>

        <p className="text-xs text-muted-foreground">
          {t('contactDetails.privacyNote')}
        </p>
      </motion.div>
    </div>
  );
};
