import { Car, ArrowRight, Check, Languages, Menu } from "lucide-react";
import { Sheet, SheetClose, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { languageOptions } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";
import fbLogo from "@/assets/logo-fb-dark.png";

interface TopNavProps {
  onBookNow?: () => void;
}

export const TopNav = ({ onBookNow }: TopNavProps) => {
  const { t, i18n } = useTranslation();
  const activeLanguage =
    languageOptions.find(lang => i18n.language?.startsWith(lang.code))?.code || i18n.language;

  const navigationItems = ['home', 'fleet', 'services', 'contact'];

  const handleLanguageChange = (code: string) => {
    i18n.changeLanguage(code);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-40 border-b border-border/30 bg-background/60 backdrop-blur-xl safe-pt safe-px">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <a href="#" className="flex items-center" aria-label={t('nav.brand')}>
          <img
            src={fbLogo}
            alt={t('nav.brand')}
            className="h-11 w-auto object-contain"
          />
        </a>

        <div className="hidden md:flex items-center gap-6 text-sm">
          {navigationItems.map(item => (
            <a
              key={item}
              href="#"
              className="text-muted-foreground hover:text-foreground transition-colors py-2"
            >
              {t(`nav.menu.${item}`)}
            </a>
          ))}
          <button
            onClick={onBookNow}
            className="btn-premium text-sm px-5 py-2 min-h-[48px] rounded-xl"
          >
            {t('nav.book')}
          </button>
        </div>

        <Sheet>
          <SheetTrigger asChild>
            <button
              className="md:hidden inline-flex items-center justify-center rounded-lg border border-border/60 bg-card/70 p-2 text-foreground shadow-sm touch-target"
              aria-label={t('nav.openMenu')}
            >
              <Menu className="w-5 h-5" />
            </button>
          </SheetTrigger>
          <SheetContent
            side="right"
            className="w-[85vw] max-w-sm overflow-y-auto bg-background/95 backdrop-blur-xl border-border safe-pb safe-pt"
          >
            <SheetHeader className="items-start space-y-1">
              <SheetTitle className="text-left">{t('nav.brand')}</SheetTitle>
              <p className="text-sm text-muted-foreground">{t('nav.tagline')}</p>
            </SheetHeader>

            <div className="mt-6 space-y-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-muted-foreground">
                  <Languages className="w-4 h-4" />
                  <span>{t('nav.language')}</span>
                </div>
                <div className="grid gap-2">
                  {languageOptions.map(lang => {
                    const isActive = activeLanguage === lang.code;
                    return (
                      <button
                        key={lang.code}
                        onClick={() => handleLanguageChange(lang.code)}
                        className={cn(
                          "w-full flex items-center justify-between rounded-lg border px-4 py-3 text-left transition-colors",
                          isActive
                            ? "border-primary bg-primary/10 text-foreground"
                            : "border-border hover:border-primary/40 hover:text-foreground",
                        )}
                      >
                        <span className="text-sm font-medium">{lang.label}</span>
                        {isActive && <Check className="w-4 h-4 text-primary" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">
                  {t('nav.menu.home')}
                </p>
                <div className="grid gap-2 text-sm text-muted-foreground">
                  {navigationItems.map(item => (
                    <SheetClose asChild key={`${item}-mobile`}>
                      <a
                        href="#"
                        className="flex items-center justify-between rounded-lg border border-border px-4 py-3 hover:border-primary/40 hover:text-foreground transition-colors min-h-12"
                      >
                        <span>{t(`nav.menu.${item}`)}</span>
                        <ArrowRight className="w-4 h-4 text-muted-foreground" />
                      </a>
                    </SheetClose>
                  ))}
                </div>
              </div>

              <SheetClose asChild>
                <button
                  onClick={onBookNow}
                  className="w-full btn-premium justify-center text-base min-h-12 flex items-center gap-2"
                >
                  <Car className="w-5 h-5" />
                  <span>{t('nav.book')}</span>
                </button>
              </SheetClose>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
};
