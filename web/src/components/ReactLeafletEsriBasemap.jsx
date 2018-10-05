import { string } from 'prop-types';
import { MapLayer } from 'react-leaflet';
import esri from 'esri-leaflet';

export default class ReactLeafletEsriBasemap extends MapLayer {
    createLeafletElement(props) { // eslint-disable-line class-methods-use-this
        return esri.basemapLayer(props.basemapType);
    }
}

ReactLeafletEsriBasemap.defaultProps = {
    basemapType: 'Imagery',
};

ReactLeafletEsriBasemap.propTypes = {
    basemapType: string,
};
