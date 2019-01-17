(ns mobile-graphql-client.store
  (:require [reagent.core :as r]
            [mobile-graphql-client.constants :as constants]))

(defonce app-state (r/atom {:active-screen constants/map-screen
                            :map-region constants/initial-map-region}))

(defonce active-screen-cursor (r/cursor app-state [:active-screen]))
(defonce map-region-cursor (r/cursor app-state [:map-region]))

(defn log-state
  [logger atom prev next]
  (do
    (.log js/console logger)
    (.log js/console atom)))

(defonce logger
  (when js/goog.DEBUG
    (add-watch app-state :app-state-logger log-state)))
