function json(body, status, headers) {
  return new Response(JSON.stringify(body), { status: status || 200, headers: headers });
}
function safeEqual(a, b) {
  a = String(a || ""); b = String(b || "");
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}
export default {
  async fetch(request, env) {
    const origin = request.headers.get("Origin") || "";
    const allowedOrigin = env.ALLOWED_ORIGIN || "https://vana30421-cpu.github.io";
    const headers = {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
      "Access-Control-Allow-Origin": allowedOrigin,
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, X-Jarvis-Access-Code",
      "Vary": "Origin"
    };
    if (origin && origin !== allowedOrigin) return json({ error: "ORIGIN_NOT_ALLOWED" }, 403, headers);
    if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: headers });
    if (request.method === "GET") {
      if (!env.JARVIS_ACCESS_CODE) return json({ error: "AI_NOT_CONFIGURED", message: "На Worker не настроен секрет JARVIS_ACCESS_CODE." }, 503, headers);
      if (!safeEqual(request.headers.get("X-Jarvis-Access-Code"), env.JARVIS_ACCESS_CODE)) return json({ error: "UNAUTHORIZED", message: "Код доступа Джарвиса неверный." }, 401, headers);
      const url = new URL(request.url);
      if (url.searchParams.get("action") === "memory:get") {
        if (!env.JARVIS_MEMORY) return json({ error: "MEMORY_SYNC_NOT_CONFIGURED", message: "Для синхронизации создай KV binding JARVIS_MEMORY." }, 503, headers);
        const id = url.searchParams.get("id") || "";
        if (!/^[A-Za-z0-9_-]{20,64}$/.test(id)) return json({ error: "INVALID_MEMORY_ID" }, 400, headers);
        const payload = await env.JARVIS_MEMORY.get("jarvis-memory:v1:" + id);
        return json({ ok: true, payload: payload || null }, 200, headers);
      }
      return json({ ok: true, service: "LIFEOS Jarvis", providers: { openai: !!env.OPENAI_API_KEY, gemini: !!env.GEMINI_API_KEY }, rateLimit: !!env.JARVIS_RATE_LIMITS, memorySync: !!env.JARVIS_MEMORY }, 200, headers);
    }
    if (request.method !== "POST") return json({ error: "METHOD_NOT_ALLOWED" }, 405, headers);
    if (!env.JARVIS_ACCESS_CODE) return json({ error: "AI_NOT_CONFIGURED", message: "На Worker не настроен секрет JARVIS_ACCESS_CODE." }, 503, headers);
    if (!safeEqual(request.headers.get("X-Jarvis-Access-Code"), env.JARVIS_ACCESS_CODE)) return json({ error: "UNAUTHORIZED", message: "Код доступа Джарвиса неверный." }, 401, headers);
    const length = Number(request.headers.get("content-length") || 0);
    if (length > 750000) return json({ error: "REQUEST_TOO_LARGE" }, 413, headers);
    if (env.JARVIS_RATE_LIMITS) {
      const ip = request.headers.get("CF-Connecting-IP") || "unknown";
      const key = "jarvis:" + ip + ":" + Math.floor(Date.now() / 60000);
      const used = Number(await env.JARVIS_RATE_LIMITS.get(key) || 0);
      if (used >= 20) return json({ error: "RATE_LIMITED", message: "Слишком много запросов. Подожди минуту." }, 429, headers);
      await env.JARVIS_RATE_LIMITS.put(key, String(used + 1), { expirationTtl: 120 });
    }
    let rawBody;
    try { rawBody = await request.text(); } catch (_) { return json({ error: "INVALID_JSON" }, 400, headers); }
    const bodyBytes = new TextEncoder().encode(rawBody).byteLength;\n    if (bodyBytes > 750000) return json({ error: "REQUEST_TOO_LARGE" }, 413, headers);
    let body;
    try { body = JSON.parse(rawBody); } catch (_) { return json({ error: "INVALID_JSON" }, 400, headers); }
    if (!body || typeof body !== "object" || Array.isArray(body)) return json({ error: "INVALID_BODY" }, 400, headers);
    if (body.action !== "memory:save" && bodyBytes > 24000) return json({ error: "REQUEST_TOO_LARGE" }, 413, headers);
    if (body.action === "memory:save") {
      if (!env.JARVIS_MEMORY) return json({ error: "MEMORY_SYNC_NOT_CONFIGURED", message: "Для синхронизации создай KV binding JARVIS_MEMORY." }, 503, headers);
      const id = typeof body.memoryId === "string" ? body.memoryId : "";
      const payload = typeof body.payload === "string" ? body.payload : "";
      if (!/^[A-Za-z0-9_-]{20,64}$/.test(id)) return json({ error: "INVALID_MEMORY_ID" }, 400, headers);
      if (!payload || payload.length > 700000 || !/^[A-Za-z0-9_-]+$/.test(payload)) return json({ error: "INVALID_MEMORY_PAYLOAD" }, 400, headers);
      await env.JARVIS_MEMORY.put("jarvis-memory:v1:" + id, payload);
      return json({ ok: true, saved: true }, 200, headers);
    }
    const message = typeof body.message === "string" ? body.message.trim().slice(0, 1600) : "";
    if (!message) return json({ error: "EMPTY_MESSAGE" }, 400, headers);
    const history = Array.isArray(body.history) ? body.history.slice(-12).map(function (m) {
      return { role: m && m.role === "assistant" ? "assistant" : "user", content: String(m && m.content || "").slice(0, 1200) };
    }).filter(function (m) { return m.content; }) : [];
    const context = body.context && typeof body.context === "object" ? JSON.stringify(body.context).slice(0, 8000) : "{}";
    const instructions = [
      "Ты — Джарвис, персональный помощник внутри LIFEOS. Общайся естественно на русском, как внимательный собеседник, а не как меню команд.",
      "Отвечай по делу и кратко, но давай конкретные шаги. Используй контекст приложения, различай нулевые значения и отсутствие данных. Не выдумывай метрики и не утверждай, что выполнил действие в приложении, если это не было сделано отдельной командой.",
      "Помогай анализировать привычки, задачи, сон, воду, настроение, экранное время, обучение и зрительные симптомы. Не ставь диагнозы и не назначай лечение. При внезапной потере зрения, сильной боли, новых вспышках или множественных новых мушках советуй срочную очную медицинскую помощь.",
      "Используй раздел jarvisMemory как явно сохранённую пользователем долговременную память. Учитывай только релевантные факты и предпочтения; если записи противоречат друг другу, уточни актуальность. Не утверждай, что помнишь то, чего нет в переданном контексте.",
      "Если данных недостаточно, прямо скажи, каких именно данных не хватает, и предложи один простой следующий шаг."
    ].join("\n");
    const provider = body.provider === "gemini" ? "gemini" : "openai";
    let upstream, data = {}, answer = "";
    try {
      if (provider === "gemini") {
        if (!env.GEMINI_API_KEY) return json({ error: "PROVIDER_NOT_CONFIGURED", message: "Для Gemini добавь секрет GEMINI_API_KEY в Cloudflare Worker." }, 503, headers);
        const contents = history.concat([{ role: "user", content: message }]).map(function (m) {
          return { role: m.role === "assistant" ? "model" : "user", parts: [{ text: m.content }] };
        });
        upstream = await fetch("https://generativelanguage.googleapis.com/v1beta/models/" + (env.GEMINI_MODEL || "gemini-2.5-flash") + ":generateContent", {
          method: "POST",
          headers: { "Content-Type": "application/json", "x-goog-api-key": env.GEMINI_API_KEY },
          body: JSON.stringify({
            systemInstruction: { parts: [{ text: instructions + "\n\nСводка данных LIFEOS (может быть неполной):\n" + context }] },
            contents: contents,
            generationConfig: { maxOutputTokens: 700, temperature: 0.5 }
          })
        });
      } else {
        if (!env.OPENAI_API_KEY) return json({ error: "PROVIDER_NOT_CONFIGURED", message: "Для OpenAI добавь секрет OPENAI_API_KEY в Cloudflare Worker." }, 503, headers);
        upstream = await fetch("https://api.openai.com/v1/responses", {
          method: "POST",
          headers: { "Authorization": "Bearer " + env.OPENAI_API_KEY, "Content-Type": "application/json" },
          body: JSON.stringify({
            model: env.OPENAI_MODEL || "gpt-5-mini",
            instructions: instructions + "\n\nСводка данных LIFEOS (может быть неполной):\n" + context,
            input: history.concat([{ role: "user", content: message }]),
            max_output_tokens: 650
          })
        });
      }
    } catch (_) { return json({ error: "UPSTREAM_UNAVAILABLE", message: "Не удалось связаться с AI-сервисом." }, 502, headers); }
    data = await upstream.json().catch(function () { return {}; });
    if (!upstream.ok) {
      const messageText = data.error && data.error.message || data.error && data.error.status || "AI-сервис вернул ошибку.";
      return json({ error: "AI_PROVIDER_ERROR", message: String(messageText).slice(0, 300) }, 502, headers);
    }
    if (provider === "gemini") {
      const candidates = data.candidates || [];
      answer = candidates.map(function (c) { return (c.content && c.content.parts || []).map(function (p) { return p.text || ""; }).join(""); }).join("\n").trim();
    } else {
      answer = String(data.output_text || "").trim();
      if (!answer && Array.isArray(data.output)) data.output.forEach(function (item) {
        (item.content || []).forEach(function (part) { if (part.type === "output_text" && part.text) answer += part.text; });
      });
    }
    if (!answer) return json({ error: "EMPTY_AI_RESPONSE", message: "Модель не вернула текст. Попробуй ещё раз." }, 502, headers);
    return json({ reply: answer.slice(0, 5000), provider: provider }, 200, headers);
  }
};
