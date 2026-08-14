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
