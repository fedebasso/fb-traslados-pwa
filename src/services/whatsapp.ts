import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { BookingState } from '@/types/booking.types';
import { WHATSAPP_PHONE } from '@/config/contact';

// The message is always built in Spanish: it is addressed to the operator,
// not to the customer, regardless of the UI language.
export const buildBookingMessage = (state: BookingState, vehicleName?: string): string => {
  const lines: string[] = [];

  lines.push('🚗 *NUEVA SOLICITUD DE RESERVA — FB Traslados*');
  if (state.confirmationCode) lines.push(`Código: ${state.confirmationCode}`);
  lines.push('');
  lines.push(`👤 *Nombre:* ${state.fullName}`);
  lines.push(`🎂 *Edad:* ${state.age}`);
  lines.push('');
  lines.push(`📍 *Origen:* ${state.origin?.address ?? '-'}`);
  lines.push(`🏁 *Destino:* ${state.destination?.address ?? '-'}`);

  if (state.stops.length > 0) {
    lines.push('🛑 *Paradas / pasajeros extra en el camino:*');
    state.stops.forEach((stop, i) => {
      lines.push(`   ${i + 1}. ${stop.address}`);
    });
  } else {
    lines.push('🛑 *Paradas extra:* No');
  }

  lines.push('');
  const dateStr = state.pickupDate
    ? format(state.pickupDate, "EEEE d 'de' MMMM yyyy", { locale: es })
    : '-';
  lines.push(`📅 *Fecha:* ${dateStr}`);
  lines.push(`🕐 *Hora de recogida:* ${state.pickupTime ?? '-'}`);
  lines.push('');
  lines.push(`👥 *Pasajeros:* ${state.passengers}`);
  lines.push(`🧳 *Equipaje:* ${state.luggage > 0 ? `Sí, ${state.luggage} pieza(s)` : 'No'}`);
  const drinkLabels: Record<string, string> = {
    water: 'Agua',
    sparklingWater: 'Agua con gas',
    softDrinks: 'Refrescos',
  };
  const drinks = state.drinks.map(d => drinkLabels[d] ?? d).join(', ');
  lines.push(`🥤 *Bebidas:* ${state.drinks.length > 0 ? `Sí (${drinks})` : 'No'}`);
  if (vehicleName) lines.push(`🚘 *Vehículo:* ${vehicleName}`);
  lines.push('');
  lines.push('_Espero la cotización del viaje. ¡Gracias!_');

  return lines.join('\n');
};

export const getWhatsAppLink = (message: string): string =>
  `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(message)}`;

export const openWhatsApp = (message: string): void => {
  window.open(getWhatsAppLink(message), '_blank', 'noopener,noreferrer');
};
