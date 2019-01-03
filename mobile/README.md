# mobile-graphql-client

## Requirements

* Node 11.x+
* Expo
* Leiningen

## Setup

```sh
npm install
lein install
```

## Development

```
lein figwheel
expo start
```

Turn off Expo live reload & hot module reload since they're handled by Figwheel.

## Adding new JS dependencies

``` clj
(def cljs-logo (js/require "./assets/images/cljs.png"))
(def FontAwesome (js/require "@expo/vector-icons/FontAwesome"))
```

## Release

```sh
lein prod-build
```
