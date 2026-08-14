import { Check, Languages } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { languageOptions } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";
import fbLogo from "@/assets/logo-fb-dark.png";

interface TopNavProps {
  // El logo del header solo aparece fuera del inicio: en el inicio la única
  // marca es el logo grande del centro del hero.
  showBooking: boolean;
  onHome: () => void;
}

export const TopNav = ({ showBooking, onHome }: TopNavProps) => {
  const { t, i18n } = useTranslation();
  const activeLanguage =
    languageOptions.find(lang => i18n.language?.startsWith(lang.code))?.code || i18n.language;
  const activeLabel = (activeLanguage || "es").split("-")[0].toUpperCase();

  const handleLanguageChange = (code: string) => {
    i18n.changeLanguage(code);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-40 border-b border-border/30 bg-background/60 backdrop-blur-xl safe-pt safe-px">
      {/* min-h fija (= alto del logo) para que la barra mida igual con y sin
          logo: así el pt-20 de Index alinea igual y no hay salto al pasar de
          inicio a wizard. */}
      <div className="container mx-auto px-4 py-3 flex items-center justify-between min-h-[44px]">
        {showBooking && (
          <button type="button" onClick={onHome} className="flex items-center" aria-label={t('nav.brand')}>
            <img
              src={fbLogo}
              alt={t('nav.brand')}
              className="h-11 w-auto object-contain"
            />
          </button>
        )}

        {/* ml-auto mantiene el selector a la derecha aunque el logo no se
            renderice (con un solo hijo, justify-between lo mandaría a la izq). */}
        <div className="flex items-center gap-2 sm:gap-3 ml-auto">
          <Popover>
            <PopoverTrigger asChild>
              <button
                className="inline-flex items-center gap-1.5 rounded-lg border border-border/60 bg-card/70 px-3 py-2 text-sm font-medium text-foreground shadow-sm transition-colors hover:border-primary/40 touch-target"
                aria-label={t('nav.language')}
              >
                <Languages className="w-4 h-4" />
                <span>{activeLabel}</span>
              </button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-52 p-2">
              <div className="grid gap-1">
                {languageOptions.map(lang => {
                  const isActive = activeLanguage === lang.code;
                  return (
                    <button
                      key={lang.code}
                      onClick={() => handleLanguageChange(lang.code)}
                      className={cn(
                        "w-full flex items-center justify-between rounded-md px-3 py-2 text-left text-sm transition-colors",
                        isActive
                          ? "bg-primary/10 text-foreground"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground",
                      )}
                    >
                      <span className="font-medium">{lang.label}</span>
                      {isActive && <Check className="w-4 h-4 text-primary" />}
                    </button>
                  );
                })}
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </header>
  );
};
