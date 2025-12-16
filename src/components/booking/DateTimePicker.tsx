import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import { format, addDays, isBefore, startOfDay, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, isToday } from 'date-fns';
import { useTranslation } from 'react-i18next';
import { getDateLocale } from '@/lib/i18n';

interface DateTimePickerProps {
  selectedDate: Date | null;
  selectedTime: string | null;
  onDateChange: (date: Date | null) => void;
  onTimeChange: (time: string | null) => void;
}

const timeSlots = [
  '06:00', '06:30', '07:00', '07:30', '08:00', '08:30',
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
  '15:00', '15:30', '16:00', '16:30', '17:00', '17:30',
  '18:00', '18:30', '19:00', '19:30', '20:00', '20:30',
  '21:00', '21:30', '22:00', '22:30', '23:00', '23:30',
];

export const DateTimePicker = ({
  selectedDate,
  selectedTime,
  onDateChange,
  onTimeChange,
}: DateTimePickerProps) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const { t, i18n } = useTranslation();
  const dateLocale = getDateLocale(i18n.language);
  const weekdayLabels = t('dateTimePicker.weekdays', { returnObjects: true }) as string[];
  
  const today = startOfDay(new Date());
  const minDate = addDays(today, 1); // Minimum 24h advance
  const maxDate = addDays(today, 90); // Max 90 days in advance
  
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });
  
  // Get day of week for first day (0 = Sunday)
  const startDay = monthStart.getDay();
  
  const isDateDisabled = (date: Date) => {
    return isBefore(date, minDate) || isBefore(maxDate, date);
  };

  const handlePrevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
          {t('dateTimePicker.title')}
        </h2>
        <p className="text-muted-foreground">
          {t('dateTimePicker.subtitle')}
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Calendar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-primary/10">
              <Calendar className="w-5 h-5 text-primary" />
            </div>
            <h3 className="font-display text-lg font-semibold text-foreground">{t('dateTimePicker.selectDate')}</h3>
          </div>

          {/* Month navigation */}
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={handlePrevMonth}
              className="p-2 rounded-lg hover:bg-muted transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-muted-foreground" />
            </button>
            <span className="font-medium text-foreground">
              {format(currentMonth, 'MMMM yyyy', { locale: dateLocale })}
            </span>
            <button
              onClick={handleNextMonth}
              className="p-2 rounded-lg hover:bg-muted transition-colors"
            >
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>

          {/* Weekday headers */}
          <div className="grid grid-cols-7 mb-2">
            {weekdayLabels?.map(day => (
              <div key={day} className="text-center text-xs text-muted-foreground py-2">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-1">
            {/* Empty cells for days before month starts */}
            {Array.from({ length: startDay }).map((_, i) => (
              <div key={`empty-${i}`} />
            ))}
            
            {daysInMonth.map(day => {
              const disabled = isDateDisabled(day);
              const selected = selectedDate && isSameDay(day, selectedDate);
              const current = isToday(day);
              
              return (
                <button
                  key={day.toISOString()}
                  onClick={() => !disabled && onDateChange(day)}
                  disabled={disabled}
                  className={`
                    aspect-square rounded-lg text-sm font-medium transition-all duration-200
                    ${disabled ? 'text-muted-foreground/30 cursor-not-allowed' : 'hover:bg-muted'}
                    ${selected ? 'bg-primary text-primary-foreground hover:bg-primary' : ''}
                    ${current && !selected ? 'border border-primary/50' : ''}
                    ${!isSameMonth(day, currentMonth) ? 'text-muted-foreground/50' : 'text-foreground'}
                  `}
                >
                  {format(day, 'd')}
                </button>
              );
            })}
          </div>

          {selectedDate && (
            <div className="mt-4 p-3 rounded-lg bg-primary/10 text-center">
              <p className="text-sm text-primary font-medium">
                {format(selectedDate, 'EEEE, MMMM d, yyyy', { locale: dateLocale })}
              </p>
            </div>
          )}
        </motion.div>

        {/* Time selection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-primary/10">
              <Clock className="w-5 h-5 text-primary" />
            </div>
            <h3 className="font-display text-lg font-semibold text-foreground">{t('dateTimePicker.selectTime')}</h3>
          </div>

          <div className="grid grid-cols-4 gap-2 max-h-80 overflow-y-auto pr-2 custom-scrollbar">
            {timeSlots.map(time => (
              <button
                key={time}
                onClick={() => onTimeChange(time)}
                className={`
                  py-2.5 rounded-lg text-sm font-medium transition-all duration-200
                  ${selectedTime === time 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground'}
                `}
              >
                {time}
              </button>
            ))}
          </div>

          {selectedTime && (
            <div className="mt-4 p-3 rounded-lg bg-primary/10 text-center">
              <p className="text-sm text-primary font-medium">
                {t('dateTimePicker.pickupAt', { time: selectedTime })}
              </p>
            </div>
          )}
        </motion.div>
      </div>

      {/* Combined selection display */}
      {selectedDate && selectedTime && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center p-4 rounded-lg bg-muted/50 border border-primary/20"
        >
          <p className="text-lg text-foreground">
            {t('dateTimePicker.scheduleSummary', {
              date: format(selectedDate, 'MMMM d, yyyy', { locale: dateLocale }),
              time: selectedTime,
            })}
          </p>
        </motion.div>
      )}
    </div>
  );
};
