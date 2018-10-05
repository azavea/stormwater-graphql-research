import React from 'react';
import { Map, TileLayer } from 'react-leaflet';

import {
    basemapTilesUrl,
    basemapAttribution,
    basemapMaxZoom,
    cityHallCoordinates,
    initialMapZoom,
} from '../constants';

export default function ReactLeafletMap() {
    const currentBaseMap = (
        <TileLayer
            url={basemapTilesUrl}
            attribution={basemapAttribution}
            maxZoom={basemapMaxZoom}
        />);

    return (
        <Map
            center={cityHallCoordinates}
            zoom={initialMapZoom}
            id="react-leaflet-map"
        >
            {currentBaseMap}
        </Map>
    );
}
