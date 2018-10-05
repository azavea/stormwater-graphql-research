import { string } from 'prop-types';
import { MapLayer } from 'react-leaflet';
import esri from 'esri-leaflet';

export default class ReactLeafletEsriFeatureLayer extends MapLayer {
    createLeafletElement(props) { // eslint-disable-line class-methods-use-this
        return esri.featureLayer({
            url: props.url,
            style: {
                color: 'yellow',
            },
        });
    }
}

ReactLeafletEsriFeatureLayer.defaultProps = {
    url: '',
};

ReactLeafletEsriFeatureLayer.propTypes = {
    url: string,
};
