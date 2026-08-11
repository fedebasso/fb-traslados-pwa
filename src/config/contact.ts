// WhatsApp number that receives booking requests, in international format
// without "+", spaces or dashes (e.g. Uruguay mobile: 59891234567).
// Override per-environment with VITE_WHATSAPP_PHONE.
export const WHATSAPP_PHONE =
  (import.meta.env.VITE_WHATSAPP_PHONE as string | undefined) || '59898006137';
