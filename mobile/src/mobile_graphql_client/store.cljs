(ns mobile-graphql-client.store
  (:require [reagent.core :as r]))

(def app-state (r/atom {:counter 0}))

(def counter-cursor (r/cursor app-state [:counter]))
