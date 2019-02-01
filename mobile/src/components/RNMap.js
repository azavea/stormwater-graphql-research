import React from 'react';
import { MapView } from 'expo';

import {
    cityHallMapRegion,
    SATELLITE_BASEMAP,
} from '../constants';

export default function RNMap() {
    return (
        <MapView
            style={{ flex: 1}}
            initialRegion={cityHallMapRegion}
            mapType={SATELLITE_BASEMAP}
        />
    );
}
