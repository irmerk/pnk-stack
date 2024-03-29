# PNK Stack Service

⚠️ Still working out issues with my testing, but this is otherwise in a pretty good state ⚠️

Backend service template using PostgreSQL, Node, and Koa

See my [`outreach` page's Node Template post][outreach]

#### TL;DR
This is a template for a relatively production ready backend Node micro-service. It already has error handling, logging, observability, rate limiting, graceful shutdown, a test file, and Docker optimizations.

## Development Quickstart

### Prerequisites

1. Development environment setup through my [guide][setup]
2. Node.js `v20.10.0` (recommended to use [`nvm`][nvm])
3. [Docker][docker]

### Setup

1. Ensure the Node.js version listed in the `.nvmrc` file is active:
```sh
nvm install && nvm use
```
2. Install dependencies:
```sh
make install-dev
```
3. Run locally at [`localhost:3000`][local]:
```sh
make dev
```

### Test

1. Compose the Docker image:
```sh
docker compose up -d
```
2. Run the database migration:
```sh
docker compose exec app npx prisma migrate deploy
```
3. Test the code:
```sh
make test
```

[outreach]: https://github.com/irmerk/outreach/blob/main/blog/node-template.md
[setup]: https://github.com/irmerk/outreach/blob/main/blog/node-template.md#setup
[nvm]: https://github.com/nvm-sh/nvm
[docker]: https://www.docker.com/get-started/
[local]: http://localhost:3000
