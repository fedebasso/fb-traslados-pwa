# Snacks y Bebidas como listas de texto libre + eliminar Música — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reemplazar `snacks` (boolean) y `drinks` (string[]) por listas de ítems de texto libre con cantidad, eliminar por completo la preferencia de música, y arreglar el bug por el que los snacks nunca llegaban en el mensaje de WhatsApp.

**Architecture:** Un nuevo tipo `OrderItem { text; quantity }` reemplaza ambos campos. Un módulo helper (`src/lib/orderItems.ts`) centraliza límites, saneo y formateo (`formatOrderItems`) para que UI, resumen, confirmación y mensaje de WhatsApp usen la misma lógica (DRY). La migración de datos se hace **versionando `STORAGE_KEY` a v3**, lo que descarta limpiamente las sesiones viejas (snacks:true, drinks string[], music seteada) sin dejar datos rotos ni campos muertos.

**Tech Stack:** Vite + React 18 + TypeScript, Tailwind + shadcn/ui, i18next (ES/EN/PT-BR), lucide-react. **No hay test runner en el proyecto**: la verificación de cada tarea es `npm run typecheck` + `npm run lint` en verde, más una verificación manual del mensaje de WhatsApp al final.

## Global Constraints

- No tocar colores ni tipografías (solo estructura/JSX y lógica).
- No cambiar el uso de `api.whatsapp.com` en `whatsapp.ts` (el redirect de `wa.me` rompe emojis).
- Todos los botones interactivos: mínimo 44px (`w-11 h-11` = 44px, o `min-h-[44px]`).
- Textos de interfaz traducidos a ES/EN/PT-BR. **Lo que escribe el cliente NO se traduce** (los nombres de productos y los chips de sugerencia van literales).
- El mensaje de WhatsApp se arma siempre en español (va al operador).
- **Límites (críticos: el mensaje viaja dentro de una URL de WhatsApp y si se pasa de largo el link falla sin avisar):** 40 caracteres por ítem, 6 filas por categoría, cantidad de 1 a 20. Las filas vacías se descartan al avanzar de paso.
- Chips de sugerencia de bebidas: `Agua, Coca-Cola, Fanta, Sprite, Pomelo`. Snacks sin chips por ahora. Los chips son atajos, NO limitan lo que se puede escribir.
- Texto chico aclaratorio en la UI: lo que se pide se compra y se suma a la cotización.
- Commits frecuentes (una pieza terminada = un commit).

---

## File Structure

- `src/types/booking.types.ts` — **Modify**: agregar `OrderItem`; cambiar `snacks`/`drinks`; borrar `MusicPreference` y campo `music`.
- `src/lib/orderItems.ts` — **Create**: constantes de límites, `DRINK_SUGGESTIONS`, `clampQuantity`, `sanitizeItemText`, `cleanOrderItems`, `formatOrderItems`.
- `src/hooks/useBookingState.ts` — **Modify**: setters con nuevos tipos, `initialState`, bump `STORAGE_KEY` a v3, borrar `normalizeDrinks` y `setMusic`.
- `src/components/booking/BookingWizard.tsx` — **Modify**: sacar `setMusic`/props de música; pasar snacks/drinks como `OrderItem[]`; descartar filas vacías al avanzar de `details`.
- `src/components/booking/TripDetails.tsx` — **Modify (reescritura del bloque amenities)**: quitar música y toggles viejos; UI de filas por categoría (input + contador −/+ + eliminar), botón "+ Agregar", chips de bebidas, nota aclaratoria.
- `src/services/whatsapp.ts` — **Modify**: línea de Snacks (bug) + línea de Bebidas con `formatOrderItems`; borrar `drinkLabels`.
- `src/components/booking/BookingSummary.tsx` — **Modify**: mostrar snacks/drinks con `formatOrderItems`; quitar bloque de música e ícono `Music`.
- `src/components/booking/Confirmation.tsx` — **Modify**: agregar bloque compacto de extras (snacks/drinks) con `formatOrderItems` (ver nota de decisión en Task 2, Step 8).
- `src/lib/i18n.ts` — **Modify**: borrar `musicPreference`/`musicOptions`/`snackDescription`/`bookingSummary.music`/`bookingSummary.snacksIncluded`; agregar labels nuevos (addItem, placeholders, quantity, removeItem, orderNote) en los 3 idiomas.

---

## Task 1: Eliminar la preferencia de música por completo

Tarea autocontenida y verde por sí sola (la música no depende del cambio de modelo de snacks/drinks). Se hace primero para dejar un commit limpio.

**Files:**
- Modify: `src/types/booking.types.ts`
- Modify: `src/hooks/useBookingState.ts`
- Modify: `src/components/booking/BookingWizard.tsx`
- Modify: `src/components/booking/TripDetails.tsx`
- Modify: `src/components/booking/BookingSummary.tsx`
- Modify: `src/lib/i18n.ts`

**Interfaces:**
- Produces: `BookingState` sin el campo `music`; `useBookingState()` sin `setMusic`; `TripDetails` sin props `music`/`onMusicChange`.

- [ ] **Step 1: Sacar el tipo `MusicPreference` y el campo `music` de los tipos**

En `src/types/booking.types.ts`:
- Borrar la línea `export type MusicPreference = 'classical' | 'jazz' | 'pop' | 'electronic' | 'silence' | 'custom';`
- Borrar la línea `music: MusicPreference | null;` de `interface BookingState`.

- [ ] **Step 2: Sacar `music` del hook**

En `src/hooks/useBookingState.ts`:
- En el import de la línea 2, sacar `MusicPreference`: queda `import { BookingState, VehicleType, Location } from '@/types/booking.types';`
- En `initialState`, borrar `music: null,`.
- Borrar el `useCallback` `setMusic` completo (líneas ~141-143).
- Borrar `setMusic,` del objeto `return`.

- [ ] **Step 3: Sacar música del wizard**

En `src/components/booking/BookingWizard.tsx`:
- Borrar `setMusic,` del destructuring de `useBookingState()`.
- En el render de `TripDetails` (case `'details'`), borrar las props `music={state.music}` y `onMusicChange={setMusic}`.

- [ ] **Step 4: Sacar música de TripDetails**

En `src/components/booking/TripDetails.tsx`:
- En el import de `lucide-react`, sacar `Music`.
- Sacar `import { MusicPreference } from '@/types/booking.types';` (ya no se usa en este paso; se re-evalúa en Task 2).
- Borrar `const musicOptions: MusicPreference[] = [...]`.
- En `TripDetailsProps`, borrar `music: MusicPreference | null;` y `onMusicChange: (value: MusicPreference | null) => void;`.
- Borrar `music,` y `onMusicChange,` de la desestructuración de props.
- Borrar el bloque JSX completo `{/* Music preference */}` (el `<div className="space-y-3">` con `musicOptions.map(...)`).
- En el `<h3>` de "Amenities", el ícono era `<Music ... />`. Reemplazarlo por `<Coffee className="w-5 h-5 text-primary" />` (Coffee ya está importado).

- [ ] **Step 5: Sacar música de BookingSummary**

En `src/components/booking/BookingSummary.tsx`:
- En el import de `lucide-react`, sacar `Music`.
- Borrar el bloque JSX `{state.music && ( ... )}` (líneas ~121-129).

- [ ] **Step 6: Sacar música de i18n (los 3 idiomas)**

En `src/lib/i18n.ts`, en cada uno de los 3 bloques de idioma:
- En `tripDetails`: borrar `musicPreference: "..."` y el objeto `musicOptions: { ... }` completo.
- En `bookingSummary`: borrar `music: "..."`.

(EN ~111-118 y ~168; ES ~300-307 y ~358; PT-BR ~489-496 y ~correspondiente.)

- [ ] **Step 7: Verificar verde y commitear**

Run: `npm run typecheck` → Expected: sin errores.
Run: `npm run lint` → Expected: 0 errors (warnings preexistentes de `ui/` OK).

```bash
git add src/types/booking.types.ts src/hooks/useBookingState.ts src/components/booking/BookingWizard.tsx src/components/booking/TripDetails.tsx src/components/booking/BookingSummary.tsx src/lib/i18n.ts
git commit -m "feat(booking): eliminar preferencia de musica por completo"
```

---

## Task 2: Snacks y bebidas como listas de texto libre con cantidad

Unidad atómica de compilación: el cambio de tipos rompe a la vez el hook, TripDetails, whatsapp, BookingSummary y Confirmation, así que todo va en un solo commit verde. Los pasos están ordenados; correr typecheck recién al final del bloque.

**Files:**
- Modify: `src/types/booking.types.ts`
- Create: `src/lib/orderItems.ts`
- Modify: `src/hooks/useBookingState.ts`
- Modify: `src/components/booking/BookingWizard.tsx`
- Modify: `src/components/booking/TripDetails.tsx`
- Modify: `src/services/whatsapp.ts`
- Modify: `src/components/booking/BookingSummary.tsx`
- Modify: `src/components/booking/Confirmation.tsx`
- Modify: `src/lib/i18n.ts`

**Interfaces:**
- Produces:
  - `interface OrderItem { text: string; quantity: number }` (en `booking.types.ts`)
  - `BookingState.snacks: OrderItem[]`, `BookingState.drinks: OrderItem[]`
  - En `src/lib/orderItems.ts`: `MAX_ITEM_TEXT=40`, `MAX_ROWS=6`, `MIN_QTY=1`, `MAX_QTY=20`, `DRINK_SUGGESTIONS: string[]`, `clampQuantity(n:number):number`, `sanitizeItemText(t:string):string`, `cleanOrderItems(items:OrderItem[]):OrderItem[]`, `formatOrderItems(items:OrderItem[]):string`.
- Consumes: setters `setSnacks(items:OrderItem[])`, `setDrinks(items:OrderItem[])` de `useBookingState`.

- [ ] **Step 1: Tipos — agregar `OrderItem` y cambiar los campos**

En `src/types/booking.types.ts`, agregar arriba de `interface BookingState`:

```ts
export interface OrderItem {
  text: string;
  quantity: number;
}
```

En `interface BookingState` reemplazar:
```ts
  snacks: boolean;
  drinks: string[];
```
por:
```ts
  snacks: OrderItem[];
  drinks: OrderItem[];
```

- [ ] **Step 2: Crear el helper `src/lib/orderItems.ts`**

```ts
import { OrderItem } from '@/types/booking.types';

// El mensaje viaja dentro de una URL de WhatsApp; si se pasa de largo el link
// falla sin avisar. Estos topes acotan el largo total del texto.
export const MAX_ITEM_TEXT = 40;
export const MAX_ROWS = 6;
export const MIN_QTY = 1;
export const MAX_QTY = 20;

// Atajos de bebidas. Son nombres de producto literales: NO se traducen.
export const DRINK_SUGGESTIONS = ['Agua', 'Coca-Cola', 'Fanta', 'Sprite', 'Pomelo'];

export const clampQuantity = (n: number): number =>
  Math.min(MAX_QTY, Math.max(MIN_QTY, Math.round(Number.isFinite(n) ? n : MIN_QTY)));

export const sanitizeItemText = (text: string): string => text.slice(0, MAX_ITEM_TEXT);

// Descarta filas en blanco, recorta el texto, clampa la cantidad y limita a MAX_ROWS.
export const cleanOrderItems = (items: OrderItem[]): OrderItem[] =>
  items
    .map(item => ({
      text: item.text.trim().slice(0, MAX_ITEM_TEXT),
      quantity: clampQuantity(item.quantity),
    }))
    .filter(item => item.text.length > 0)
    .slice(0, MAX_ROWS);

// "2x Coca-Cola, 4x Agua" — solo filas con texto; '' si no se pidió nada.
export const formatOrderItems = (items: OrderItem[]): string =>
  cleanOrderItems(items)
    .map(item => `${item.quantity}x ${item.text}`)
    .join(', ');
```

- [ ] **Step 3: Hook — setters, initialState, migración por versión**

En `src/hooks/useBookingState.ts`:
- Import: `import { BookingState, VehicleType, Location, OrderItem } from '@/types/booking.types';`
- Cambiar `const STORAGE_KEY = 'premium-shuttle-booking-v2';` → `'premium-shuttle-booking-v3';` y actualizar el comentario de arriba para reflejar que v3 descarta las sesiones v2 (snacks boolean, drinks string[], music) limpiamente.
- Borrar la función `normalizeDrinks` completa (líneas ~88-96).
- En el `useState` inicial, cambiar el objeto `restored` para NO llamar a `normalizeDrinks`:
```ts
      const restored: BookingState = {
        ...initialState,
        ...parsed,
        pickupDate: parsed.pickupDate ? new Date(parsed.pickupDate) : null,
      };
```
- En `initialState`, cambiar `snacks: false,` → `snacks: [],` y `drinks: [],` (ya es `[]`, dejar). (Recordá que `music` ya salió en Task 1.)
- Cambiar las firmas de los setters:
```ts
  const setSnacks = useCallback((snacks: OrderItem[]) => {
    setState(prev => ({ ...prev, snacks }));
  }, []);

  const setDrinks = useCallback((drinks: OrderItem[]) => {
    setState(prev => ({ ...prev, drinks }));
  }, []);
```

- [ ] **Step 4: Wizard — tipos de props y descarte de filas vacías al avanzar**

En `src/components/booking/BookingWizard.tsx`:
- Import del helper: `import { cleanOrderItems } from '@/lib/orderItems';`
- Reemplazar `handleNext` por:
```ts
  const handleNext = () => {
    if (!canProceed(state.currentStep)) return;
    // Las filas vacías se descartan al salir del paso de detalles.
    if (STEPS[state.currentStep] === 'details') {
      setSnacks(cleanOrderItems(state.snacks));
      setDrinks(cleanOrderItems(state.drinks));
    }
    setDirection(1);
    nextStep();
  };
```
- El render de `TripDetails` ya pasa `snacks={state.snacks}` y `drinks={state.drinks}`; ahora son `OrderItem[]`. Sin cambios en esas líneas.

- [ ] **Step 5: TripDetails — UI de filas por categoría**

En `src/components/booking/TripDetails.tsx`, reescribir el bloque de amenities. Imports:
```ts
import { motion } from 'framer-motion';
import { Users, Briefcase, Coffee, GlassWater, Minus, Plus, Trash2 } from 'lucide-react';
import { OrderItem } from '@/types/booking.types';
import { useTranslation } from 'react-i18next';
import {
  MAX_ROWS, MIN_QTY, MAX_QTY, MAX_ITEM_TEXT, DRINK_SUGGESTIONS,
  clampQuantity, sanitizeItemText,
} from '@/lib/orderItems';
```
(Borrar el import de `MusicPreference`, `musicOptions` y `drinkOptions` viejos.)

Props:
```ts
interface TripDetailsProps {
  passengers: number;
  luggage: number;
  snacks: OrderItem[];
  drinks: OrderItem[];
  maxPassengers: number;
  maxLuggage: number;
  onPassengersChange: (value: number) => void;
  onLuggageChange: (value: number) => void;
  onSnacksChange: (value: OrderItem[]) => void;
  onDrinksChange: (value: OrderItem[]) => void;
}
```

Dentro del componente, un subcomponente reutilizable por categoría (definirlo en el mismo archivo, arriba de `TripDetails`):
```tsx
interface OrderCategoryProps {
  label: string;
  icon: React.ReactNode;
  placeholder: string;
  items: OrderItem[];
  suggestions?: string[];
  onChange: (items: OrderItem[]) => void;
}

const OrderCategory = ({ label, icon, placeholder, items, suggestions, onChange }: OrderCategoryProps) => {
  const { t } = useTranslation();

  const addRow = (text = '') => {
    if (items.length >= MAX_ROWS) return;
    onChange([...items, { text: sanitizeItemText(text), quantity: MIN_QTY }]);
  };
  const setText = (i: number, text: string) =>
    onChange(items.map((it, idx) => (idx === i ? { ...it, text: sanitizeItemText(text) } : it)));
  const setQty = (i: number, delta: number) =>
    onChange(items.map((it, idx) => (idx === i ? { ...it, quantity: clampQuantity(it.quantity + delta) } : it)));
  const removeRow = (i: number) => onChange(items.filter((_, idx) => idx !== i));

  // Un chip llena la primera fila vacía; si no hay, agrega una nueva.
  const applySuggestion = (text: string) => {
    const emptyIdx = items.findIndex(it => it.text.trim() === '');
    if (emptyIdx >= 0) setText(emptyIdx, text);
    else addRow(text);
  };

  return (
    <div className="space-y-3">
      <label className="text-sm text-muted-foreground flex items-center gap-2">
        {icon}
        {label}
      </label>

      <div className="space-y-2">
        {items.map((item, i) => (
          <div key={i} className="flex items-center gap-2">
            <input
              type="text"
              value={item.text}
              maxLength={MAX_ITEM_TEXT}
              onChange={e => setText(i, e.target.value)}
              placeholder={placeholder}
              className="flex-1 min-w-0 rounded-lg border border-border bg-muted/50 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
            />
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setQty(i, -1)}
                disabled={item.quantity <= MIN_QTY}
                className="w-11 h-11 rounded-lg bg-muted flex items-center justify-center text-foreground hover:bg-muted/80 transition-colors disabled:opacity-50"
                aria-label={t('tripDetails.decreaseQty')}
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-8 text-center text-sm font-semibold text-foreground">{item.quantity}</span>
              <button
                type="button"
                onClick={() => setQty(i, +1)}
                disabled={item.quantity >= MAX_QTY}
                className="w-11 h-11 rounded-lg bg-muted flex items-center justify-center text-foreground hover:bg-muted/80 transition-colors disabled:opacity-50"
                aria-label={t('tripDetails.increaseQty')}
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <button
              type="button"
              onClick={() => removeRow(i)}
              className="w-11 h-11 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              aria-label={t('tripDetails.removeItem')}
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      {items.length < MAX_ROWS && (
        <button
          type="button"
          onClick={() => addRow()}
          className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-muted/50 px-3 py-2 min-h-[44px] text-sm text-foreground hover:border-primary/50 transition-colors"
        >
          <Plus className="w-4 h-4" />
          {t('tripDetails.addItem')}
        </button>
      )}

      {suggestions && suggestions.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {suggestions.map(s => (
            <button
              key={s}
              type="button"
              onClick={() => applySuggestion(s)}
              className="px-3 py-2 min-h-[44px] rounded-lg bg-muted text-sm text-muted-foreground hover:bg-muted/80 transition-colors"
            >
              {s}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
```

En el JSX de `TripDetails`, reemplazar TODO el bloque `{/* Amenities */}` (snacks + drinks viejos) por:
```tsx
        {/* Amenities */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-6 space-y-6"
        >
          <h3 className="font-display text-lg font-semibold text-foreground flex items-center gap-2">
            <Coffee className="w-5 h-5 text-primary" />
            {t('tripDetails.amenities')}
            <span className="text-xs font-normal text-muted-foreground">{t('tripDetails.optional')}</span>
          </h3>

          <p className="text-xs text-muted-foreground">{t('tripDetails.orderNote')}</p>

          <OrderCategory
            label={t('tripDetails.snacks')}
            icon={<Coffee className="w-4 h-4" />}
            placeholder={t('tripDetails.snackPlaceholder')}
            items={snacks}
            onChange={onSnacksChange}
          />

          <OrderCategory
            label={t('tripDetails.beverages')}
            icon={<GlassWater className="w-4 h-4" />}
            placeholder={t('tripDetails.drinkPlaceholder')}
            items={drinks}
            suggestions={DRINK_SUGGESTIONS}
            onChange={onDrinksChange}
          />
        </motion.div>
```
Actualizar la desestructuración de props de `TripDetails` a `{ passengers, luggage, snacks, drinks, maxPassengers, maxLuggage, onPassengersChange, onLuggageChange, onSnacksChange, onDrinksChange }`.

- [ ] **Step 6: whatsapp.ts — arreglar snacks (bug) + bebidas con formato nuevo**

En `src/services/whatsapp.ts`:
- Agregar import: `import { formatOrderItems } from '@/lib/orderItems';`
- Borrar el objeto `drinkLabels` y las líneas viejas de bebidas (`const drinks = ...` y el `lines.push` de bebidas).
- Reemplazar por (antes de la línea de Vehículo):
```ts
  const snacks = formatOrderItems(state.snacks);
  const drinks = formatOrderItems(state.drinks);
  lines.push(`🍪 *Snacks:* ${snacks || 'No'}`);
  lines.push(`🥤 *Bebidas:* ${drinks || 'No'}`);
```
(Esto arregla el bug: antes la línea de snacks nunca se agregaba.)

- [ ] **Step 7: BookingSummary — mostrar snacks/drinks con formato nuevo**

En `src/components/booking/BookingSummary.tsx`:
- Import: `import { formatOrderItems } from '@/lib/orderItems';`
- Reemplazar los bloques `{state.snacks && (...)}` y `{state.drinks.length > 0 && (...)}` por:
```tsx
              {formatOrderItems(state.snacks) && (
                <div className="col-span-2">
                  <p className="text-xs text-muted-foreground mb-1">{t('bookingSummary.snacks')}</p>
                  <p className="text-foreground font-medium flex items-center gap-2">
                    <Coffee className="w-4 h-4 text-primary" />
                    {formatOrderItems(state.snacks)}
                  </p>
                </div>
              )}
              {formatOrderItems(state.drinks) && (
                <div className="col-span-2">
                  <p className="text-xs text-muted-foreground mb-1">{t('bookingSummary.beverages')}</p>
                  <p className="text-foreground font-medium flex items-center gap-2">
                    <GlassWater className="w-4 h-4 text-primary" />
                    {formatOrderItems(state.drinks)}
                  </p>
                </div>
              )}
```
(El ícono `Coffee` y `GlassWater` ya están importados; `Music` se sacó en Task 1.)

- [ ] **Step 8: Confirmation — bloque compacto de extras**

> **NOTA DE DECISIÓN (confirmar con Fede):** hoy `Confirmation.tsx` NO muestra snacks/drinks/música (solo vehículo, ruta y horario). El spec dice "lo mismo en BookingSummary y Confirmation", así que este paso AGREGA un bloque de extras. Si Fede prefiere no mostrarlos en la confirmación, se omite este paso (el mensaje de WhatsApp ya los incluye igual vía `buildBookingMessage`).

En `src/components/booking/Confirmation.tsx`:
- Import: `import { Check, CalendarPlus, Car, ArrowRight, Sparkles, Home, MessageCircle, Coffee, GlassWater } from 'lucide-react';`
- Import: `import { formatOrderItems } from '@/lib/orderItems';`
- Dentro del render, calcular arriba:
```ts
  const snacksText = formatOrderItems(state.snacks);
  const drinksText = formatOrderItems(state.drinks);
```
- Agregar dentro de la tarjeta de "Booking details", después del bloque de `pickupTime` (línea ~188) y antes de cerrar ese `<div className="space-y-4 ...">`:
```tsx
              {(snacksText || drinksText) && (
                <div className="pt-4 border-t border-border space-y-2">
                  {snacksText && (
                    <div className="flex items-center gap-2 text-sm">
                      <Coffee className="w-4 h-4 text-primary" />
                      <span className="text-muted-foreground">{t('bookingSummary.snacks')}:</span>
                      <span className="text-foreground font-medium">{snacksText}</span>
                    </div>
                  )}
                  {drinksText && (
                    <div className="flex items-center gap-2 text-sm">
                      <GlassWater className="w-4 h-4 text-primary" />
                      <span className="text-muted-foreground">{t('bookingSummary.beverages')}:</span>
                      <span className="text-foreground font-medium">{drinksText}</span>
                    </div>
                  )}
                </div>
              )}
```

- [ ] **Step 9: i18n — labels nuevos y borrar los muertos (3 idiomas)**

En `src/lib/i18n.ts`, en `tripDetails` de cada idioma: borrar `snackDescription`, agregar los labels nuevos. En `bookingSummary` de cada idioma: borrar `snacksIncluded` (ya no se usa). Mantener `snacks` y `beverages`.

**EN — `tripDetails`:** dejar `amenities`, `optional`, `snacks: "Snacks"`, `beverages: "Beverages"` y agregar:
```ts
        orderNote: "Anything you order is purchased and added to the quote.",
        addItem: "Add item",
        snackPlaceholder: "e.g. Potato chips",
        drinkPlaceholder: "e.g. Coca-Cola 1.5L",
        increaseQty: "Increase quantity",
        decreaseQty: "Decrease quantity",
        removeItem: "Remove item",
```
**ES — `tripDetails`:** `snacks: "Snacks"`, `beverages: "Bebidas"` y:
```ts
        orderNote: "Lo que pedís se compra y se suma a la cotización.",
        addItem: "Agregar",
        snackPlaceholder: "Ej: Papas fritas",
        drinkPlaceholder: "Ej: Coca-Cola 1.5L",
        increaseQty: "Aumentar cantidad",
        decreaseQty: "Disminuir cantidad",
        removeItem: "Eliminar ítem",
```
**PT-BR — `tripDetails`:** `snacks: "Snacks"`, `beverages: "Bebidas"` y:
```ts
        orderNote: "O que você pedir é comprado e somado ao orçamento.",
        addItem: "Adicionar",
        snackPlaceholder: "Ex: Batata frita",
        drinkPlaceholder: "Ex: Coca-Cola 1.5L",
        increaseQty: "Aumentar quantidade",
        decreaseQty: "Diminuir quantidade",
        removeItem: "Remover item",
```
En `bookingSummary` de los 3: borrar `snacksIncluded`. (`snacks`, `beverages` quedan.)

- [ ] **Step 10: Verificar verde**

Run: `npm run typecheck` → Expected: sin errores.
Run: `npm run lint` → Expected: 0 errors.

- [ ] **Step 11: Verificación manual del mensaje de WhatsApp**

Levantar `npm run dev`, completar una reserva con **dos bebidas y un snack** (ej: snack "Papas fritas" x1; bebidas "Coca-Cola 1.5L" x2 y "Agua" x4) y confirmar que el mensaje contiene:
```
🍪 *Snacks:* 1x Papas fritas
🥤 *Bebidas:* 2x Coca-Cola 1.5L, 4x Agua
```
Y que si no se pide nada, ambas líneas dicen `No`. Mostrarle el mensaje a Fede.

- [ ] **Step 12: Commit**

```bash
git add src/types/booking.types.ts src/lib/orderItems.ts src/hooks/useBookingState.ts src/components/booking/BookingWizard.tsx src/components/booking/TripDetails.tsx src/services/whatsapp.ts src/components/booking/BookingSummary.tsx src/components/booking/Confirmation.tsx src/lib/i18n.ts
git commit -m "feat(booking): snacks y bebidas como listas de texto libre con cantidad; fix snacks en WhatsApp; migrar storage a v3"
```

---

## Self-Review (cobertura del spec)

- **Bug snacks en WhatsApp** → Task 2 Step 6. ✅
- **Eliminar música** (types, hook, wizard, tripdetails, summary, i18n) → Task 1. ✅
- **Tipos snacks/drinks → OrderItem[]** → Task 2 Steps 1-3. ✅
- **UI por categoría (filas, +Agregar, −/+ , eliminar, chips bebidas, snacks sin chips)** → Task 2 Step 5. ✅
- **Límites (40 char, 6 filas, qty 1-20, filas vacías se descartan al avanzar)** → `orderItems.ts` (Step 2) + `maxLength` en input (Step 5) + `cleanOrderItems` en `handleNext` (Step 4). ✅
- **Texto aclaratorio** → `orderNote` (Steps 5 y 9). ✅
- **Mensaje WhatsApp: solo filas con texto, cantidad adelante, "No" si nada** → `formatOrderItems` + Step 6. ✅
- **Lo mismo en BookingSummary y Confirmation** → Steps 7 y 8. ✅
- **Migración / versión de STORAGE_KEY** → Task 2 Step 3 (v3, borra `normalizeDrinks`). ✅
- **Traducir solo labels de UI, no lo que escribe el cliente** → Step 9 (labels) + chips y nombres literales. ✅
- **Restricciones (colores/tipografía, api.whatsapp.com, botones 44px)** → Global Constraints, respetadas en el código de los steps. ✅

## Puntos abiertos para Fede

1. **Confirmation** (Task 2 Step 8): hoy no muestra extras. El plan los agrega. ¿OK o lo dejamos solo en el mensaje de WhatsApp?
2. **Migración**: se descartan las sesiones viejas guardadas (bump a v3) en vez de convertirlas. Es lo más limpio y sigue el patrón existente. ¿OK?
