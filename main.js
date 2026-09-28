// main.js — Bot de Telegram vía API HTTP (funciona en XploitOS)
const TOKEN = "8964315899:AAFTQ_x3QjDVN3XZyV3eXaQbQHDm9PoLlk";
const API = `https://api.telegram.org/bot${TOKEN}`;

context.log("Bot iniciado. Escuchando mensajes...");

let offset = 0;
let running = true;

// Manejar cancelación
context.signal.addEventListener('abort', () => { running = false; context.warn("Bot detenido"); });

async function getUpdates() {
  const r = await fetch(`${API}/getUpdates?timeout=30&offset=${offset}`);
  return r.json();
}
async function sendMessage(chatId, text) {
  return fetch(`${API}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text })
  }).then(r => r.json());
}

// Long polling
while (running) {
  if (context.signal.aborted) break;
  try {
    const data = await getUpdates();
    if (data.ok && data.result.length) {
      for (const upd of data.result) {
        offset = upd.update_id + 1;
        const msg = upd.message;
        if (!msg || !msg.text) continue;
        context.log(`[${msg.from.username || msg.from.id}] ${msg.text}`);
        if (/\/hola/i.test(msg.text)) {
          await sendMessage(msg.chat.id, "hola 👋");
        } else if (/\/start/i.test(msg.text)) {
          await sendMessage(msg.chat.id, "¡Bot activo!");
        }
      }
    }
  } catch (e) {
    context.error("Error: " + e.message);
  }
  await context.sleep(1000);
}
context.log("Bot detenido.");