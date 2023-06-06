# NestJS basic template

Installing needed packages, initializing configurations, set up global
validations, database connection, ...; they are a lot of stuff which slows the
real application developement; so this template sets up the minimal standard
configuration needed for starting the development process.

## Requirements

- `>= node v18.14.0`
- `docker`

## Setting up

1. Use this template from Github
2. Install the required packages via `pnpm install`
3. Create `.env` file with the structure given by `.env.example` file
4. Use `docker compose up -d` for running `Postgres` database
