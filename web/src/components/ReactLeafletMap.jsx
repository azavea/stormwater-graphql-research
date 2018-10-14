import React, { Component } from 'react';
import { GeoJSON, Map } from 'react-leaflet';
import { Query } from 'react-apollo';

import {
    fetchRWD,
    emptyQuery,
} from '../queries';

import {
    cityHallCoordinates,
    initialMapZoom,
} from '../constants';

import ReactLeafletEsriTiledMapLayer from './ReactLeafletEsriTiledMapLayer';
import SelectPointControl from './SelectPointControl';

export default class ReactLeafletMap extends Component {
    constructor(props) {
        super(props);
        this.state = {
            lat: null,
            lng: null,
            selectPointMode: false,
        };

        this.handleMapClick = this.handleMapClick.bind(this);
        this.toggleSelectPointMode = this.toggleSelectPointMode.bind(this);
    }

    handleMapClick({ latlng }) {
        return this.state.selectPointMode
            ? this.setState(state => ({
                ...state,
                ...latlng,
                selectPointMode: false,
            }))
            : null;
    }

    toggleSelectPointMode() {
        return this.setState(state => ({
            ...state,
            selectPointMode: !state.selectPointMode,
        }));
    }

    render() {
        const {
            lat,
            lng,
            selectPointMode,
        } = this.state;

        return (
            <Query
                query={(lat && lng) ? fetchRWD : emptyQuery}
                variables={{
                    lat,
                    lng,
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
                                    } = {},
                                } = {},
                            } = data;

                            return geometry && (
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
                                onClick={!loading ? this.handleMapClick : null}
                            >
                                <ReactLeafletEsriTiledMapLayer />
                                <SelectPointControl
                                    position="topleft"
                                    loading={loading}
                                    selectPointMode={selectPointMode}
                                    toggleSelectPointMode={this.toggleSelectPointMode}
                                />
                                {watershed}
                            </Map>
                        );
                    }
                }
            </Query>
        );
    }
}
