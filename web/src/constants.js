export const cityHallCoordinates = [
    39.9524,
    -75.1636,
];

export const initialMapZoom = 13;

export const basemapTilesUrl = 'https://{s}.tile.openstreetmap.se/hydda/base/{z}/{x}/{y}.png';
export const basemapAttribution = `Tiles courtesy of <a href="http://openstreetmap.se/"
    target="_blank">OpenStreetMap Sweden</a> &mdash; Map data &copy; <a
    href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>`;
export const basemapMaxZoom = 23;

export const mapComponentEnum = {
    reactLeaflet: 'reactLeaflet',
    artisanalLeaflet: 'artisanalLeaflet',
};

export const mapLayersEnum = {
    osmLayer: 'osmLayer',
    esriLayer: 'esriLayer',
};

export const bikeNetworkFeatureServer = 'https://services.arcgis.com/fLeGjb7u4uXqeF9q/ArcGIS/rest/services/Bike_Network/FeatureServer/0';

export const controlPositionsEnum = {
    topright: 'topright',
    topleft: 'topleft',
    bottomright: 'bottomright',
    bottomleft: 'bottomleft',
};

export const queryModeEnum = {
    RWD: 'RWD',
    Parcel: 'Parcel',
    Impervious: 'Impervious',
};

export const REACT_LEAFLET_MAP_ID = 'react-leaflet-map';

export const rwdPolygonStyle = () => ({
    color: '#137cbd',
    weight: 3,
    fillColor: '#137cbd',
    fillOpacity: 0.5,
    opacity: 0.5,
});

export const parcelPolygonStyle = () => ({
    color: '#d13913',
    weight: 3,
    fillOpacity: 0,
});

export const clickedPointStyle = Object.freeze({
    color: '#D9822B',
});

export const pointsPaneZIndex = 1000;
export const parcelPaneZIndex = 750;
export const rwdPaneZIndex = 500;
