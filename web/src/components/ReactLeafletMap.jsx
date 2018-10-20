import React, { Component } from 'react';
import { Map } from 'react-leaflet';

import {
    cityHallCoordinates,
    initialMapZoom,
    queryModeEnum,
    controlPositionsEnum,
} from '../constants';

import ReactLeafletEsriTiledMapLayer from './ReactLeafletEsriTiledMapLayer';
import SelectPointControl from './SelectPointControl';
import ToggleRWDParcelModeControl from './ToggleRWDParcelModeControl';
import RWDPolygon from './RWDPolygon';
import ParcelPolygon from './ParcelPolygon';

const REACT_LEAFLET_MAP_ID = 'react-leaflet-map';

export default class ReactLeafletMap extends Component {
    constructor(props) {
        super(props);
        this.state = {
            lat: null,
            lng: null,
            selectPointMode: false,
            fetching: false,
            queryMode: queryModeEnum.RWD,
        };

        this.handleMapClick = this.handleMapClick.bind(this);
        this.toggleSelectPointMode = this.toggleSelectPointMode.bind(this);
        this.stopFetching = this.stopFetching.bind(this);
        this.toggleRWDParcelMode = this.toggleRWDParcelMode.bind(this);
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
        return this.setState(
            state => ({
                ...state,
                selectPointMode: !state.selectPointMode,
            }),
            () => {
                document
                    .getElementById(REACT_LEAFLET_MAP_ID)
                    .style
                    .cursor = this.state.selectPointMode
                        ? 'pointer'
                        : null;
            },
        );
    }

    toggleRWDParcelMode() {
        return this.setState(state => ({
            ...state,
            queryMode: state.queryMode === queryModeEnum.RWD
                ? queryModeEnum.Parcel
                : queryModeEnum.RWD,
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
            queryMode,
        } = this.state;

        const polygon = queryMode === queryModeEnum.RWD
            ? (
                <RWDPolygon
                    lat={lat}
                    lng={lng}
                    stopFetching={this.stopFetching}
                />)
            : (
                <ParcelPolygon
                    lat={lat}
                    lng={lng}
                    stopFetching={this.stopFetching}
                />
            );

        return (
            <Map
                center={cityHallCoordinates}
                zoom={initialMapZoom}
                id={REACT_LEAFLET_MAP_ID}
                onClick={this.handleMapClick}
            >
                <ReactLeafletEsriTiledMapLayer />
                <ToggleRWDParcelModeControl
                    loading={fetching}
                    position={controlPositionsEnum.topleft}
                    mode={queryMode}
                    toggleRWDParcelMode={this.toggleRWDParcelMode}
                />
                <SelectPointControl
                    loading={fetching}
                    position={controlPositionsEnum.topleft}
                    selectPointMode={selectPointMode}
                    toggleSelectPointMode={this.toggleSelectPointMode}
                />
                {polygon}
            </Map>
        );
    }
}
