# Sketched 🎨

A web game about drawing things from memory!

## Getting Started

Run locally using [Docker Compose](https://docs.docker.com/compose/):

```shell
npm i
docker compose up # http://localhost:5173
```

> [!CAUTION]
>
> **Do not run in production with the default configuration**! The app uses
> unsafe default values for secrets such as `DB_PASSWORD="change-me"`
> so that it can be run locally with one command for demo purposes.
>
> See [`.env.example`](./.env.example) to update the configuration via
> environment variables.

## [Documentation](./docs)
