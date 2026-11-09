# Подключение разговорного Джарвиса

Сайт LIFEOS сейчас публикуется через GitHub Pages. GitHub Pages не исполняет Cloudflare Pages Functions, поэтому для реального AI-диалога используется отдельный Cloudflare Worker: `workers/jarvis-worker.js`. Конфигурация — `wrangler.jarvis.toml`.

## Секреты Cloudflare Worker

В терминале в корне репозитория выполни:

```bash
npx wrangler deploy --config wrangler.jarvis.toml
npx wrangler secret put JARVIS_ACCESS_CODE --config wrangler.jarvis.toml
# Добавь один или оба ключа — в зависимости от выбранного провайдера:
npx wrangler secret put OPENAI_API_KEY --config wrangler.jarvis.toml
npx wrangler secret put GEMINI_API_KEY --config wrangler.jarvis.toml
```

Либо создай Worker вручную в Cloudflare Dashboard из `workers/jarvis-worker.js`. Добавь Worker Secrets:

- `OPENAI_API_KEY` — Secret, API-ключ OpenAI (если используешь OpenAI).
- `GEMINI_API_KEY` — Secret, ключ Google AI Studio (если используешь Gemini). Можно добавить оба и переключать провайдера в настройках Джарвиса. Ключи нельзя вставлять в HTML, JavaScript или GitHub.
- `JARVIS_ACCESS_CODE` — Secret, придумай отдельный длинный код доступа. Его нужно будет ввести в настройках Джарвиса внутри LIFEOS.

Переменные Worker:
- `OPENAI_MODEL` — `gpt-5-mini`.
- `GEMINI_MODEL` — `gemini-2.5-flash`.
- `ALLOWED_ORIGIN` — уже задана как `https://vana30421-cpu.github.io`; если у сайта другой домен, измени её.

После деплоя скопируй URL Worker вида `https://lifeos-jarvis-api.<твой-subdomain>.workers.dev`.

В LIFEOS открой Джарвиса, вставь URL Worker в поле «URL AI-сервера», введи тот же `JARVIS_ACCESS_CODE`, включи «Разговорный ИИ» и подтверди передачу контекста.

## Ограничение расходов

Если хочешь включить лимит 20 запросов в минуту на IP, создай KV namespace `JARVIS_RATE_LIMITS` и добавь его binding в `wrangler.jarvis.toml`. Без KV Worker проверяет секретный код, но не применяет минутный лимит.

## Приватность

При включённом разговорном ИИ на выбранный серверный провайдер (OpenAI или Google Gemini) отправляются текст текущего сообщения, до 12 последних реплик и ограниченная сводка LIFEOS: названия активных задач, привычки, сон, вода, настроение, зрение, дневник, события календаря, экранное время, антистресс-записи, состояние питомца, названия, теги и короткие фрагменты текста (до 240 символов на заметку, не более 8 последних заметок) второго мозга, а также месячные итоги финансов. API-ключ остаётся только в Cloudflare. Не включай функцию, если не согласен передавать эти данные внешнему AI-провайдеру.

Подписка ChatGPT или Gemini сама по себе не включает API-баланс: API выбранного провайдера тарифицируется отдельно.

## Зашифрованная синхронизация памяти между устройствами

В LIFEOS добавлена синхронизация памяти, пользовательских навыков и напоминаний через отдельный Cloudflare KV namespace. Шифрование AES-GCM выполняется в браузере до отправки: Worker получает только ID хранилища и шифротекст, но не ключ расшифровки.

1. Создай отдельный KV namespace:
   ```bash
   npx wrangler kv namespace create JARVIS_MEMORY
   ```
2. Скопируй выданный `id` и добавь в `wrangler.jarvis.toml`:
   ```toml
   [[kv_namespaces]]
   binding = "JARVIS_MEMORY"
   id = "ВСТАВЬ_ID_СОЗДАННОГО_NAMESPACE"
   ```
3. Если используешь rate limit, сохрани существующий binding `JARVIS_RATE_LIMITS` отдельно — не подставляй его namespace вместо `JARVIS_MEMORY`.
4. Повторно разверни Worker:
   ```bash
   npx wrangler deploy --config wrangler.jarvis.toml
   ```
5. В LIFEOS открой Джарвиса → «Постоянная память» → «Синхронизация между устройствами» → «Создать ключ». Скопируй ключ и сохрани в менеджере паролей. На втором устройстве вставь этот ключ и нажми «Применить ключ», затем «Синхронизировать».

Ключ имеет вид `ID.КЛЮЧ`. Он не передаётся Worker; потеря ключа означает невозможность расшифровать облачную копию. Не отправляй его в чат и не публикуй. Удаление KV namespace удалит облачные копии. Локальная память и резервный JSON остаются отдельными.

Синхронизация объединяет записи по ID, не перезаписывает всё хранилище одним устройством. Из-за eventual consistency Cloudflare KV синхронизируй устройства последовательно, а не одновременно. Лимиты Worker и KV применяются отдельно.
