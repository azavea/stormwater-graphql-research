import React, { Component } from 'react';
import { Map } from 'react-leaflet';

import {
    cityHallCoordinates,
    initialMapZoom,
} from '../constants';

import ReactLeafletEsriTiledMapLayer from './ReactLeafletEsriTiledMapLayer';
import SelectPointControl from './SelectPointControl';
import RWDPolygon from './RWDPolygon';

export default class ReactLeafletMap extends Component {
    constructor(props) {
        super(props);
        this.state = {
            lat: null,
            lng: null,
            selectPointMode: false,
            fetching: false,
        };

        this.handleMapClick = this.handleMapClick.bind(this);
        this.toggleSelectPointMode = this.toggleSelectPointMode.bind(this);
        this.stopFetching = this.stopFetching.bind(this);
    }

    handleMapClick({ latlng }) {
        return this.state.selectPointMode
            ? this.setState(state => ({
                ...state,
                ...latlng,
                selectPointMode: false,
                fetching: true,
            }))
            : null;
    }

    toggleSelectPointMode() {
        return this.setState(state => ({
            ...state,
            selectPointMode: !state.selectPointMode,
        }));
    }

    stopFetching() {
        return this.setState(state => ({
            ...state,
            fetching: false,
        }));
    }

    render() {
        const {
            lat,
            lng,
            selectPointMode,
            fetching,
        } = this.state;

        return (
            <Map
                center={cityHallCoordinates}
                zoom={initialMapZoom}
                id="react-leaflet-map"
                onClick={this.handleMapClick}
            >
                <ReactLeafletEsriTiledMapLayer />
                <SelectPointControl
                    loading={fetching}
                    position="topleft"
                    selectPointMode={selectPointMode}
                    toggleSelectPointMode={this.toggleSelectPointMode}
                />
                <RWDPolygon
                    lat={lat}
                    lng={lng}
                    stopFetching={this.stopFetching}
                />
            </Map>
        );
    }
}
