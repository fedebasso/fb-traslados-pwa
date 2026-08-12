# FB Traslados — PWA de reservas de traslados

App web (PWA) para solicitar traslados privados en Montevideo. El cliente completa un
wizard paso a paso y la reserva se envía por **WhatsApp** al operador para que cotice.
No hay backend propio ni base de datos: el "envío" es un mensaje de WhatsApp pre-armado.

## Stack

- **Vite** + **React 18** + **TypeScript**
- **Tailwind CSS** + **shadcn/ui** (Radix) — componentes en `src/components/ui`
- **react-router-dom** (una sola ruta real: `/`)
- **react-hook-form** + **zod** para formularios/validación
- **@tanstack/react-query** (provider montado, uso mínimo por ahora)
- **i18next** / **react-i18next** — multi-idioma (ES / EN / PT-BR)
- **framer-motion** para animaciones
- **vite-plugin-pwa** — instalable como PWA
- Origen: proyecto generado con **Lovable** (por eso el README genérico).

## Cómo correr

```sh
npm i
npm run dev        # servidor de desarrollo (Vite)
npm run build      # build de producción -> dist/
npm run lint       # eslint
npm run typecheck  # tsc -b
```

### Variables de entorno (ver `.env.example`)
- `VITE_WHATSAPP_PHONE` — número del operador que recibe las reservas (default 59898006137).
- `VITE_GOOGLE_MAPS_API_KEY` — para autocompletado de direcciones (Google Places).

## Estructura

```
src/
  pages/            Index.tsx (landing + wizard), NotFound.tsx
  components/
    landing/        HeroSection, WaterDropEffect
    booking/        El wizard de reserva (ver abajo)
    layout/         layout compartido
    ui/             shadcn/ui (no editar salvo necesidad puntual)
  services/
    whatsapp.ts         arma el mensaje y abre WhatsApp
    places.ts           Google Places / autocompletado
    confirmationCode.ts genera el código de confirmación
  hooks/
    useBookingState.ts  estado central del wizard
  types/booking.types.ts  BookingState, Vehicle, Location, etc.
  config/contact.ts       WHATSAPP_PHONE y datos de contacto
  lib/i18n.ts             configuración de idiomas
```

## Flujo de la reserva (wizard)

`BookingWizard.tsx` orquesta los pasos. El estado vive en `useBookingState.ts`
(tipo `BookingState`). Pasos aproximados: selección de vehículo → detalles del viaje
(origen/destino/paradas/fecha/hora) → contacto → resumen (`BookingSummary`, incluye
email obligatorio) → confirmación. Al confirmar se llama a `openWhatsApp()`.

### Detalles importantes de `services/whatsapp.ts`
- El mensaje de WhatsApp **siempre se arma en español** (va al operador, no al cliente),
  sin importar el idioma de la UI.
- Se usa `api.whatsapp.com/send?...` **a propósito**, NO `wa.me`: `wa.me` re-encodea el
  texto y rompe los emojis (los convierte en U+FFFD). No cambiar esto.

## Vehículos
Dos opciones: `byd` (eléctrico/eco) y `onix`. Ver tipo `VehicleType` y `Vehicle`.

## Deploy
- Se despliega en **Vercel**. Workflow en `.github/workflows/vercel-deploy.yml`.
- El auto-deploy en push/PR está **desactivado**: el deploy es manual vía
  `workflow_dispatch` (decisión reciente, commit c34b391).

## Convenciones / notas para trabajar acá
- TypeScript estricto; correr `npm run typecheck` y `npm run lint` antes de dar algo por hecho.
- Textos visibles al usuario deben pasar por i18n (ES/EN/PT-BR), no hardcodear.
- Los componentes de `components/ui` son de shadcn: preferí crear componentes nuevos
  en `components/booking` o `components/landing` antes que tocar los de `ui`.
- No agregar backend/DB sin acordarlo: la arquitectura actual es 100% frontend + WhatsApp.
- Idioma de comunicación con el usuario (Fede): **español**.
