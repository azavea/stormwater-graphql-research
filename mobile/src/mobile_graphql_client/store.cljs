(ns mobile-graphql-client.store
  (:require [reagent.core :as r]
            [mobile-graphql-client.constants :as constants]))

(defonce app-state (r/atom {:active-screen constants/map-screen}))

(defonce active-screen-cursor (r/cursor app-state [:active-screen]))

(defn log-state
  [logger atom prev next]
  (do
    (.log js/console logger)
    (.log js/console atom)))

(defonce logger
  (when js/goog.DEBUG
    (add-watch app-state :app-state-logger log-state)))
