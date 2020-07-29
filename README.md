# Sextant: RADIUS User Management

Web-based UI for managing RADIUS users and passwords, including self-service updates for initial password changes.

![Client CI](https://github.com/alitheg/sextant/workflows/Client%20CI/badge.svg)
![API CI](https://github.com/alitheg/sextant/workflows/API%20CI/badge.svg?branch=master)

## SECURITY WARNING

This tool assumes you're using `Cleartext-Password` and one of the SQL backends (Postgres/MySQL) on a database server accessible to the API. This means passwords for your RADIUS users are sent from the portal to the API in POST bodys. **DO NOT** expose this service to the public internet unless it's running over TLS and you're happy with the security.

## Deployment

Build and run the docker image:

```bash
$ docker build . -t sextant
$ docker run -p 3000:3000 sextant
```

## Development

Run the API with:

```bash
$ yarn start
```

Run the portal with:

```bash
$ cd client
$ yarn start
```

React will open the home page, and proxy non-existent URLs to the API for processing.

Icons made by <a href="https://smashicons.com/" title="Smashicons">Smashicons</a> from <a href="https://www.flaticon.com/" title="Flaticon"> www.flaticon.com</a>
