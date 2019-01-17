(ns mobile-graphql-client.react-native-map-view
  (:require [reagent.core :as r]
            [mobile-graphql-client.actions :as actions]
            [mobile-graphql-client.store :as store]
            [mobile-graphql-client.constants :as constants]))

(def ReactNative (js/require "react-native"))
(def expo (js/require "expo"))
(def map-view (r/adapt-react-class (.-MapView expo)))

(defn handle-region-change
  [region]
  (actions/store-map-region region))

(defn react-native-map-view
  []
  [map-view {:style {:flex 1}
             :initial-region (clj->js @store/map-region-cursor)
             :on-region-change handle-region-change}])
