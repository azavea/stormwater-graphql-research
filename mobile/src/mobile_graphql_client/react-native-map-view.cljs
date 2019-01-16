(ns mobile-graphql-client.react-native-map-view
  (:require [reagent.core :as r]))

(def ReactNative (js/require "react-native"))
(def expo (js/require "expo"))
(def map-view (r/adapt-react-class (.-MapView expo)))

(defn react-native-map-view
  []
  [map-view {:style {:flex 1}
             :initial-region (clj->js {"latitude" 37.78825
                                       "longitude" -122.4324
                                       "latitudeDelta" 0.0922
                                       "longitudeDelta" 0.0421})}])
