# stormwater-graphql-research

[![Build Status](https://travis-ci.org/azavea/stormwater-graphql-research.svg?branch=develop)](https://travis-ci.org/azavea/stormwater-graphql-research)

A research project to implement a GraphQL service + React Native & web
applications for viewing stormwater information.

## Requirements

* Rake
* Docker
* Node 8.x+
* expo-cli

## Setup

To build the containers, run

```
rake build
```

To run the GraphQL server you'll also need to configure a `server.env` file with
key/value pairs for the following environment variables:

| Variable                | Description                                   |
| ---                     | ---                                           |
| `RWD_AUTH_URL`          | URL for RWD authorization key server          |
| `RWD_AUTH_TOKEN`        | Token for RWD authorization key server        |
| `PARCEL_AUTH_URL`       | URL for parcel authorization key server       |
| `PARCEL_AUTH_TOKEN`     | Token for parcel authorization key server     |
| `IMPERVIOUS_AUTH_URL`   | URL for impervious authorization key server   |
| `IMPERVIOUS_AUTH_TOKEN` | Token for impervious authorization key server |

## Server

```
rake server
```

## Web Client

```
rake web
```

## Mobile Client

```
rake mobile
```

## Rake Tasks

| Task   | Description                                          |
| ----   | -----------                                          |
| build  | Create GraphQL service & install client dependencies |
| server | Start GraphQL server                                 |
| mobile | Start React Native app using Expo                    |
| web    | Start React web app using Webpack Dev Server         |
| start  | Start both GraphQL server and React web app          |
| flush  | Flush Redis cache                                    |

## License

Apache-2.0
