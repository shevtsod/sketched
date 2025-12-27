# CLI

Sketched includes a CLI that can be accessed by the administrator on the
`server` component to run various commands and manage the application.

```shell
# enter the server container
docker compose exec -it server /bin/sh
# list available CLI commands
npm run -- cli --help
# run a CLI command
# npm run -- cli [options] [command] [command-options]
```

# Commands

The available CLI commands are described below:

## `db`

`db` commands are used to manage the relational database used by Sketched.

### `db drop`

`db drop` removes all existing data **and** tables related to Sketched from the
database.

It is necessary to run [`db migrate`](#db-migrate) after this command to
re-create the database schema for the application to run properly after running
this command.

> [!CAUTION]
>
> **⚠️ This command will delete all your data! ⚠️**
>
> **Do not run this command in production**! This command is intended to be used
> for local development only.

### `db migrate`

`db migrate` applies database migrations to ensure database schema is
up-to-date.

> [!NOTE]
>
> This command runs automatically each time the `server` is started.

### `db reset`

`db reset` removes all existing data in all tables related to Sketched from the
database.

> [!CAUTION]
>
> **⚠️ This command will delete all your data! ⚠️**
>
> **Do not run this command in production**! This command is intended to be used
> for local development only.

### `db seed`

`db seed` seeds the database with initial data.

In all environments, it creates or updates the default administrator account
with the credentials stored in the following environment variables:

- `ADMIN_USERNAME`
- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`

In the `development` and `test` environment, it also creates some dummy records
with random data in each database table for testing purposes.

> [!NOTE]
>
> This command runs automatically each time the `server` is started.
