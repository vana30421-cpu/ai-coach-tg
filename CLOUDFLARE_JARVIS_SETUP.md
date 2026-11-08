# Подключение разговорного Джарвиса

Сайт LIFEOS сейчас публикуется через GitHub Pages. GitHub Pages не исполняет Cloudflare Pages Functions, поэтому для реального AI-диалога используется отдельный Cloudflare Worker: `workers/jarvis-worker.js`. Конфигурация — `wrangler.jarvis.toml`.

## Обязательные секреты Cloudflare Pages

В терминале в корне репозитория выполни:

```bash
npx wrangler secret put OPENAI_API_KEY --config wrangler.jarvis.toml
npx wrangler secret put JARVIS_ACCESS_CODE --config wrangler.jarvis.toml
npx wrangler deploy --config wrangler.jarvis.toml
```

Либо создай Worker вручную в Cloudflare Dashboard из `workers/jarvis-worker.js`. Добавь Worker Secrets:

- `OPENAI_API_KEY` — Secret, API-ключ OpenAI. Не вставлять его в HTML, JavaScript или GitHub.
- `JARVIS_ACCESS_CODE` — Secret, придумай отдельный длинный код доступа. Его нужно будет ввести в настройках Джарвиса внутри LIFEOS.

Переменные Worker:
- `OPENAI_MODEL` — уже задана в `wrangler.jarvis.toml` (`gpt-5-mini`).
- `ALLOWED_ORIGIN` — уже задана как `https://vana30421-cpu.github.io`; если у сайта другой домен, измени её.

После деплоя скопируй URL Worker вида `https://lifeos-jarvis-api.<твой-subdomain>.workers.dev`.

В LIFEOS открой Джарвиса, вставь URL Worker в поле «URL AI-сервера», введи тот же `JARVIS_ACCESS_CODE`, включи «Разговорный ИИ» и подтверди передачу контекста.

## Ограничение расходов

Если хочешь включить лимит 20 запросов в минуту на IP, создай KV namespace `JARVIS_RATE_LIMITS` и добавь его binding в `wrangler.jarvis.toml`. Без KV Worker проверяет секретный код, но не применяет минутный лимит.

## Приватность

При включённом разговорном ИИ на сервер OpenAI отправляются текст текущего сообщения, до 12 последних реплик и ограниченная сводка LIFEOS: названия активных задач, статусы привычек, записи сна, воды, настроения, экранного времени и зрительных симптомов. API-ключ остаётся только в Cloudflare. Не включай функцию, если не согласен передавать эти данные внешнему AI-провайдеру.

Подписка ChatGPT сама по себе не включает API-баланс: использование OpenAI API тарифицируется отдельно.
