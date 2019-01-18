(ns mobile-graphql-client.actions
  (:require [cljs.spec.alpha :as spec]
            [mobile-graphql-client.store :as store]
            [mobile-graphql-client.constants :as constants]))

(defn set-map-screen-active
  []
  (reset! store/active-screen-cursor constants/map-screen))

(defn set-settings-screen-active
  []
  (reset! store/active-screen-cursor constants/settings-screen))

(spec/def ::latitude float?)
(spec/def ::longitude float?)
(spec/def ::latitudeDelta float?)
(spec/def ::longitudeDelta float?)
(spec/def ::region (spec/keys :req-un [::latitude
                                       ::longitude
                                       ::latitudeDelta
                                       ::longitudeDelta]))

(defn store-map-region
  "Stores the updated map react-native-maps map region in a Reagent atom"
  [region]
  (let [new-region (js->clj region :keywordize-keys true)]
    (do
      (spec/assert ::region new-region)
      (reset! store/map-region-cursor new-region))))

(defonce check-asserts
  (when js/goog.DEBUG
    (spec/check-asserts true)))
