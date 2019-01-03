(ns mobile-graphql-client.views
  (:require [reagent.core :as r]
            [mobile-graphql-client.actions :as actions]
            [mobile-graphql-client.store :as store]))

(def ReactNative (js/require "react-native"))
(def expo (js/require "expo"))
(def AtExpo (js/require "@expo/vector-icons"))
(def ionicons (.-Ionicons AtExpo))
(def ic (r/adapt-react-class ionicons))
(def ReactNativeElements (js/require "react-native-elements"))

(def text (r/adapt-react-class (.-Text ReactNative)))
(def view (r/adapt-react-class (.-View ReactNative)))
(def image (r/adapt-react-class (.-Image ReactNative)))
(def button (r/adapt-react-class (.-Button ReactNativeElements)))

(def main-view-style {:flex 1
                      :flex-direction "column"
                      :align-items "center"
                      :justify-content "center"})

(def text-style {:font-size 30
                 :font-weight "100"
                 :margin-bottom 20
                 :text-align "center"})

(defn main
  []
  [view {:style main-view-style}
   [image {:source (js/require "./assets/images/cljs.png")
           :style {:width 200
                   :height 200}}]
   [text {:style text-style} (str "Counter -> " @store/counter-cursor)]
   [ic {:name "ios-arrow-down" :size 60 :color "green"}]
   [button {:title "Increment" :on-press actions/increment-counter}]])
