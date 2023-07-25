# PNK Stack Service

Backend service template using PostgreSQL, Node, and Koa

See my [`outreach` page][outreach]

## Development Quickstart

### Prerequisites

1. Development environment setup through my [guide][setup]
2. Node.js `v18.15.0` (recommended to use [`nvm`][nvm])
3. [Docker][docker]

### Setup

1. Ensure the Node.js version listed in the `.nvmrc` file is active:
```sh
nvm install && nvm use
```
2. Install dependencies:
```sh
npm i
```
3. Run locally at [`localhost:3000`][local]:
```sh
npm run dev
```

[outreach]: https://github.com/irmerk/outreach
[setup]: https://github.com/irmerk/outreach
[nvm]: https://github.com/nvm-sh/nvm
[docker]: https://www.docker.com/get-started/
[local]: http://localhost:3000
