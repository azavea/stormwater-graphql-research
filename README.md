# stormwater-graphql-research

A research project to implement a GraphQL service and a React Native application
for viewing stormwater information.

## Requirements

* Rake
* Docker
* Node 8.x+
* expo-cli

## Setup

```
rake build
```

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

| Task | Description |
| ---- | ----------- |
| build | Create GraphQL service & install client dependencies |
| server | Start GraphQL server |
| mobile | Start React Native app using Expo |
| web | Start React web app using Webpack Dev Server |
| start | Start both GraphQL server and React web app |

## License

Apache-2.0
