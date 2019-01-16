(ns mobile-graphql-client.actions
  (:require [mobile-graphql-client.store :as store]
            [mobile-graphql-client.constants :as constants]))

(defn set-map-screen-active
  []
  (reset! store/active-screen-cursor constants/map-screen))

(defn set-settings-screen-active
  []
  (reset! store/active-screen-cursor constants/settings-screen))
