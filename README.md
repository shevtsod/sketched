# Sketched

A web game about drawing things from memory!

> [!WARNING]
>
> Sketched is very early in development and still missing basic functionality!

## Getting Started

Run locally using [Docker Compose](https://docs.docker.com/compose/):

```shell
docker compose up
```

Access it from a web browser after all containers start:

- URL: <http://localhost:5173>
- Username: `admin`
- Password: `change-me`

See [`.env.example`](./.env.example) to update the configuration via environment
variables.

> [!CAUTION]
>
> **Do not run in production with the default configuration**! The app uses
> unsafe default values for secrets such as `DB_PASSWORD="change-me"` so that it
> can be run locally with just one command for demo purposes.
>
> To run in production, set secure values for secret environment variables.

## [Documentation](./docs)
