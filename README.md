# Free LLM Proxy (Safe Mode)

OpenAI-compatible proxy for combining multiple provider APIs behind a single `/v1` interface with **free-only routing**, retries, and failover.

> ⚠️ This project is for personal use and experimentation. Provider limits and terms can change.

## Features

- OpenAI-compatible endpoints:
  - `GET /v1/models`
  - `POST /v1/chat/completions`
- Multi-provider adapter architecture
- Free-only policy gate (`FREE_ONLY_MODE=true`)
- Smart routing + failover + retries
- Cost guardrails (`MAX_REQUEST_USD`)
- Local encrypted secrets (optional)
- Minimal admin/eval API for manual, human-approved improvements
- No self-modifying/autonomous code changes

## Quick start

```bash
npm install
cp .env.example .env
npm run build
npm run start
```

Server: `http://localhost:8080`

Health:

```bash
curl http://localhost:8080/health
```

Models:

```bash
curl http://localhost:8080/v1/models \
  -H "Authorization: Bearer local-dev-key"
```

Chat completion:

```bash
curl http://localhost:8080/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer local-dev-key" \
  -d '{
    "model": "router:auto",
    "messages": [{"role":"user","content":"Write a hello world in TypeScript"}],
    "temperature": 0.2
  }'
```

## Configuration

See `.env.example`.

- `FREE_ONLY_MODE=true` ensures only free-tagged models/providers are routed.
- `MAX_REQUEST_USD=0` hard-blocks estimated paid requests.
- `PROXY_API_KEY` secures your local proxy access.

## Providers

Edit `config/providers.json`.

Each model can be marked with:

- `isFree`: true/false
- `priority`: lower = preferred
- `maxTokens`

## Safe "self-improving" mode

This project includes **evaluation-driven tuning** (manual approval only):

- Run evals through `/admin/evals/run` (with admin key)
- View top route candidates from `/admin/evals/recommendations`
- Apply config changes yourself after review

No autonomous code rewrite or unattended self-modification is implemented.

## Scripts

- `npm run dev` – development server
- `npm run build` – compile TypeScript
- `npm run start` – run compiled server
- `npm run lint` – typecheck

## Security notes

- Keep provider keys in environment variables
- Never commit `.env`
- Use private networking or localhost where possible

