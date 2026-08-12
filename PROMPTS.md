# Cómo pedirle cosas a Claude en este repo

Este archivo es una guía para vos (Fede). No lo lee Claude solo; es tu "chuletario"
para escribir pedidos que Claude entienda rápido y bien. Copiá una plantilla, rellenala
y pegala en el chat.

> Claude ya lee `CLAUDE.md` al abrir el repo, así que NO hace falta que le expliques
> el stack ni la arquitectura cada vez. Enfocate en QUÉ querés y CÓMO querés verlo.

---

## Regla de oro de un buen prompt

Un buen pedido tiene 4 cosas:
1. **Objetivo** — qué querés lograr (en una frase).
2. **Contexto/dónde** — qué archivo, pantalla o paso del wizard.
3. **Restricciones** — qué NO tocar, qué mantener (idioma, estilo, i18n, etc.).
4. **Cómo verificar** — cómo sabés que quedó bien (que buildee, que se vea X, etc.).

---

## Plantilla: NUEVA FEATURE
```
Objetivo: quiero agregar [qué].
Dónde: en [pantalla/paso/componente].
Detalles: [comportamiento esperado, casos borde].
Restricciones: mantener i18n (ES/EN/PT-BR), no tocar el envío por WhatsApp,
  seguir el estilo de los componentes de booking.
Verificación: que compile (npm run typecheck) y que [lo que debería verse/pasar].
Antes de codear: si algo no está claro, preguntame primero.
```

## Plantilla: ARREGLAR UN BUG
```
Bug: [qué pasa].
Cómo reproducirlo: [pasos].
Esperado vs actual: esperaba [X], pasa [Y].
Dónde creo que está: [archivo o "no sé"].
Verificación: que deje de pasar y no rompa el resto del wizard.
```

## Plantilla: CAMBIO DE UI / DISEÑO
```
Objetivo: cambiar el diseño de [pantalla/componente].
Qué quiero que se vea distinto: [describilo o pegá una referencia/imagen].
Mantener: responsive, accesibilidad, y consistencia con el resto de la app.
Verificación: mostrame el resultado corriendo o una captura.
```

## Plantilla: ENTENDER EL CÓDIGO
```
Explicame cómo funciona [X] (ej: el paso de fechas, el armado del mensaje de WhatsApp).
No cambies nada todavía, solo quiero entenderlo.
```

## Plantilla: REVISIÓN / LIMPIEZA
```
Revisá [archivo/carpeta] y decime qué se puede simplificar o mejorar,
sin cambiar el comportamiento. Listame las mejoras antes de aplicarlas.
```

---

## Frases útiles
- "Antes de codear, preguntame lo que no esté claro." → evita que asuma cosas.
- "Hacé un plan primero y esperá mi OK." → para cambios grandes.
- "No toques [X]." → protegé partes sensibles (ej: el link de WhatsApp).
- "Mostrame el diff antes de commitear."
- "Corré el typecheck y el lint antes de decir que está listo."

## Cosas de ESTE proyecto que conviene recordarle
- El mensaje de WhatsApp va SIEMPRE en español (es para el operador).
- Usar `api.whatsapp.com`, no `wa.me` (rompe emojis).
- Todo texto visible pasa por i18n (ES/EN/PT-BR).
- No hay backend: es frontend + WhatsApp.
