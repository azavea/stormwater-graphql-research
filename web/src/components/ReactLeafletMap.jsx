import React, { Suspense, lazy } from 'react';
import { arrayOf, func, number } from 'prop-types';

import {
    Map as RLMap,
    CircleMarker,
    Pane,
} from 'react-leaflet';

import {
    cityHallCoordinates,
    initialMapZoom,
    queryModeEnum,
    REACT_LEAFLET_MAP_ID,
    pointsPaneZIndex,
    parcelPaneZIndex,
    rwdPaneZIndex,
    clickedPointStyle,
    controlPositionsEnum,
    basemapMaxZoom,
} from '../constants';

import ReactLeafletEsriTiledMapLayer from './ReactLeafletEsriTiledMapLayer';

const Control = lazy(() => import('react-leaflet-control'));
const RWDPolygon = lazy(() => import('./RWDPolygon'));
const ParcelPolygon = lazy(() => import('./ParcelPolygon'));
const ImperviousData = lazy(() => import('./ImperviousData'));

export default function ReactLeafletMap({
    mode,
    lat,
    lng,
    handleSelectPoint,
}) {
    const clickedPoint = (lat && lng) && (
        <CircleMarker
            center={[lat, lng]}
            radius={5}
            color={clickedPointStyle.color}
            fillColor={clickedPointStyle.color}
            fillOpacity={1}
        />);

    const rwdPolygon = mode.includes(queryModeEnum.RWD) && (
        <Suspense fallback={null}>
            <RWDPolygon
                lat={lat}
                lng={lng}
            />
        </Suspense>);

    const parcelPolygon = mode.includes(queryModeEnum.Parcel) && (
        <Suspense fallback={null}>
            <ParcelPolygon
                lat={lat}
                lng={lng}
            />
        </Suspense>);

    const imperviousData = mode.includes(queryModeEnum.Impervious) && (
        <Suspense fallback={null}>
            <Control position={controlPositionsEnum.bottomleft}>
                <ImperviousData
                    lat={lat}
                    lng={lng}
                />
            </Control>
        </Suspense>);

    return (
        <RLMap
            center={cityHallCoordinates}
            zoom={initialMapZoom}
            maxZoom={basemapMaxZoom}
            id={REACT_LEAFLET_MAP_ID}
            onClick={handleSelectPoint}
        >
            <ReactLeafletEsriTiledMapLayer />
            {imperviousData}
            <Pane style={{ zIndex: rwdPaneZIndex }}>
                {rwdPolygon}
            </Pane>
            <Pane style={{ zIndex: parcelPaneZIndex }}>
                {parcelPolygon}
            </Pane>
            <Pane style={{ zIndex: pointsPaneZIndex }}>
                {clickedPoint}
            </Pane>
        </RLMap>
    );
}

ReactLeafletMap.propTypes = {
    mode: arrayOf(Object.values(queryModeEnum)).isRequired,
    handleSelectPoint: func.isRequired,
    lat: number.isRequired,
    lng: number.isRequired,
};
