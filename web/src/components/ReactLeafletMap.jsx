import React from 'react';
import { object } from 'prop-types';
import { Map, TileLayer } from 'react-leaflet';
import { graphql } from 'react-apollo';

import fetchRWDAndRiverGauge from '../queries';

import {
    basemapTilesUrl,
    basemapAttribution,
    basemapMaxZoom,
    cityHallCoordinates,
    initialMapZoom,
} from '../constants';

function ReactLeafletMap({
    data: {
        loading,
        rwd,
        gauge,
    },
}) {
    window.console.log('loading ->', loading);
    window.console.log('rwd -> ', rwd);
    window.console.log('gauge ->', gauge);

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

ReactLeafletMap.defaultProps = {
    data: {},
};

ReactLeafletMap.propTypes = {
    data: object, // eslint-disable-line react/forbid-prop-types
};

export default graphql(fetchRWDAndRiverGauge, {
    options: () => ({
        variables: {
            lat: 39.67185,
            lng: -75.7674262,
        },
    }),
})(ReactLeafletMap);
