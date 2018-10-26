import React, { useState } from 'react';
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

export default function ReactLeafletMap() {
    const [selectPointMode, setSelectPointMode] = useState(false);
    const [fetching, setFetching] = useState(false);
    const [queryMode, setQueryMode] = useState(queryModeEnum.RWD);
    const [lat, setLat] = useState(null);
    const [lng, setLng] = useState(null);

    const stopFetching = () => setFetching(false);
    const toggleSelectPointMode = () => setSelectPointMode(!selectPointMode);

    const toggleRWDParcelMode = queryMode === queryModeEnum.RWD
        ? () => setQueryMode(queryModeEnum.Parcel)
        : () => setQueryMode(queryModeEnum.RWD);

    const handleMapClick = ({ latlng }) => {
        if (!selectPointMode) {
            return null;
        }

        setFetching(true);
        setSelectPointMode(false);
        setLat(latlng.lat);
        setLng(latlng.lng);

        return null;
    };

    const polygon = queryMode === queryModeEnum.RWD
        ? (
            <RWDPolygon
                lat={lat}
                lng={lng}
                stopFetching={stopFetching}
            />)
        : (
            <ParcelPolygon
                lat={lat}
                lng={lng}
                stopFetching={stopFetching}
            />
        );

    return (
        <Map
            center={cityHallCoordinates}
            zoom={initialMapZoom}
            id={REACT_LEAFLET_MAP_ID}
            onClick={handleMapClick}
        >
            <ReactLeafletEsriTiledMapLayer />
            <ToggleRWDParcelModeControl
                loading={fetching}
                position={controlPositionsEnum.topleft}
                mode={queryMode}
                toggleRWDParcelMode={toggleRWDParcelMode}
            />
            <SelectPointControl
                loading={fetching}
                position={controlPositionsEnum.topleft}
                selectPointMode={selectPointMode}
                toggleSelectPointMode={toggleSelectPointMode}
            />
            {polygon}
        </Map>
    );
}
