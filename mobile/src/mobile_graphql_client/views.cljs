(ns mobile-graphql-client.views
  (:require [reagent.core :as r]
            [mobile-graphql-client.actions :as actions]
            [mobile-graphql-client.store :as store]
            [mobile-graphql-client.constants :as constants]
            [mobile-graphql-client.react-native-map-view :as map-view]))

(def ReactNative (js/require "react-native"))
(def expo (js/require "expo"))
(def AtExpo (js/require "@expo/vector-icons"))
(def NativeBase (js/require "native-base"))

(def view (r/adapt-react-class (.-View NativeBase)))
(def text (r/adapt-react-class (.-Text NativeBase)))
(def container (r/adapt-react-class (.-Container NativeBase)))
(def header (r/adapt-react-class (.-Header NativeBase)))
(def content (r/adapt-react-class (.-Content NativeBase)))
(def footer (r/adapt-react-class (.-Footer NativeBase)))
(def footer-tab (r/adapt-react-class (.-FooterTab NativeBase)))
(def button (r/adapt-react-class (.-Button NativeBase)))
(def icon (r/adapt-react-class (.-Icon NativeBase)))

(def main-view-style {:flex 1
                      :align-items "center"
                      :justify-content "center"})

(def text-style {:font-size 30
                 :font-weight "100"
                 :margin-bottom 20
                 :text-align "center"})

(defn footer-tab-map-button
  []
  [button {:vertical true
           :on-press actions/set-map-screen-active}
   [icon {:name "map"}]
   [text "Map"]])

(defn footer-tab-settings-button
  []
  [button {:vertical true
           :on-press actions/set-settings-screen-active}
   [icon {:name "settings"}]
   [text "Settings"]])

(defn footer-with-tabs
  []
  [footer
   [footer-tab
    [footer-tab-map-button]
    [footer-tab-settings-button]]])

(defn settings-screen-content
  []
  [view
   [text {:style text-style} @store/active-screen-cursor]])

(defn main-screen-content
  []
  (cond
    (= constants/map-screen @store/active-screen-cursor) [map-view/react-native-map-view]
    :else [content {:content-container-style main-view-style}]))

(defn main
  []
  [container
   [main-screen-content]
   [footer-with-tabs]])
