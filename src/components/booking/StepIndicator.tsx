import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
  stepLabels: string[];
}

export const StepIndicator = ({ currentStep, totalSteps, stepLabels }: StepIndicatorProps) => {
  return (
    <div className="w-full py-6">
      {/* Progress bar */}
      <div className="relative mb-4">
        <div className="h-1 bg-muted rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-primary to-gold-light rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
        </div>
      </div>

      {/* Step dots */}
      <div className="flex justify-between items-center">
        {stepLabels.map((label, index) => {
          const isCompleted = index < currentStep;
          const isActive = index === currentStep;

          return (
            <div key={index} className="flex flex-col items-center gap-2">
              <motion.div
                className={`
                  relative w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium
                  transition-all duration-300
                  ${isCompleted ? 'bg-primary text-primary-foreground' : ''}
                  ${isActive ? 'bg-primary/20 border-2 border-primary text-primary' : ''}
                  ${!isCompleted && !isActive ? 'bg-muted text-muted-foreground' : ''}
                `}
                animate={isActive ? { scale: [1, 1.1, 1] } : {}}
                transition={{ duration: 0.5, repeat: isActive ? Infinity : 0, repeatDelay: 2 }}
              >
                {isCompleted ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <span>{index + 1}</span>
                )}
              </motion.div>
              <span className={`
                text-xs font-medium hidden md:block
                ${isActive ? 'text-primary' : 'text-muted-foreground'}
              `}>
                {label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
