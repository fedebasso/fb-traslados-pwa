import { useState, useCallback } from 'react';
import { Mail, AlertCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface EmailInputProps {
  value: string;
  onChange: (email: string) => void;
  onBlur?: () => void;
  disabled?: boolean;
}

export const EmailInput = ({ value, onChange, onBlur, disabled = false }: EmailInputProps) => {
  const { t } = useTranslation();
  const [touched, setTouched] = useState(false);

  const isValidEmail = useCallback((email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }, []);

  const isInvalid = touched && value.length > 0 && !isValidEmail(value);
  const isEmpty = touched && value.length === 0;

  const handleBlur = () => {
    setTouched(true);
    onBlur?.();
  };

  return (
    <div className="space-y-2">
      <label
        htmlFor="email-input"
        className="block text-sm font-medium text-foreground"
      >
        {t('bookingSummary.emailLabel', { defaultValue: 'Email Address' })}
        <span className="text-primary ml-1">*</span>
      </label>

      <div className="relative">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
          <Mail className="w-5 h-5" />
        </div>

        <input
          id="email-input"
          type="email"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={handleBlur}
          disabled={disabled}
          placeholder={t('bookingSummary.emailPlaceholder', { defaultValue: 'your@email.com' })}
          aria-invalid={isInvalid || isEmpty}
          aria-describedby={isInvalid || isEmpty ? 'email-error' : undefined}
          className={`
            w-full pl-12 pr-4 py-3 rounded-lg
            bg-muted/50 border-2 transition-all duration-200
            font-medium text-foreground placeholder:text-muted-foreground
            focus:outline-none focus:bg-muted focus:border-primary
            disabled:opacity-50 disabled:cursor-not-allowed
            ${isInvalid || isEmpty ? 'border-destructive focus:border-destructive' : 'border-border'}
          `}
        />

        {(isInvalid || isEmpty) && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-destructive">
            <AlertCircle className="w-5 h-5" />
          </div>
        )}
      </div>

      {isEmpty && (
        <p
          id="email-error"
          className="text-sm text-destructive flex items-center gap-2"
        >
          {t('bookingSummary.emailRequired', { defaultValue: 'Email is required' })}
        </p>
      )}

      {isInvalid && (
        <p
          id="email-error"
          className="text-sm text-destructive flex items-center gap-2"
        >
          {t('bookingSummary.emailInvalid', { defaultValue: 'Please enter a valid email address' })}
        </p>
      )}
    </div>
  );
};

