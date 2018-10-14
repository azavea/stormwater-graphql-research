import React from 'react';
import { GeoJSON, Map } from 'react-leaflet';
import { Query } from 'react-apollo';

import fetchRWDAndRiverGauge from '../queries';

import {
    cityHallCoordinates,
    initialMapZoom,
} from '../constants';

import ReactLeafletEsriTiledMapLayer from './ReactLeafletEsriTiledMapLayer';

export default function ReactLeafletMap() {
    return (
        <Query
            query={fetchRWDAndRiverGauge}
            variables={{
                lat: 39.965,
                lng: -75.1806771,
            }}
        >
            {
                ({ loading, error, data }) => {
                    const watershed = (() => {
                        if (loading || error) {
                            return null;
                        }

                        const {
                            rwd: {
                                watershed: {
                                    geometry,
                                },
                            },
                        } = data;

                        return (
                            <GeoJSON
                                data={geometry}
                                style={() => ({
                                    color: 'orange',
                                    weight: 3,
                                    fillColor: 'orange',
                                    fillOpacity: 1,
                                })}
                            />
                        );
                    })();

                    return (
                        <Map
                            center={cityHallCoordinates}
                            zoom={initialMapZoom}
                            id="react-leaflet-map"
                        >
                            <ReactLeafletEsriTiledMapLayer />
                            {watershed}
                        </Map>
                    );
                }
            }
        </Query>
    );
}
