(ns mobile-graphql-client.actions
  (:require [mobile-graphql-client.store :as store]))

(defn increment-counter
  []
  (swap! store/counter-cursor inc))
