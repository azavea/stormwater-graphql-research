import { string } from 'prop-types';
import { MapLayer } from 'react-leaflet';
import esri from 'esri-leaflet';

export default class ReactLeafletEsriTiledMapLayer extends MapLayer {
    createLeafletElement(props) { // eslint-disable-line class-methods-use-this
        return esri.tiledMapLayer({
            url: props.url,
            attribution: props.attribution,
        });
    }
}

ReactLeafletEsriTiledMapLayer.defaultProps = {
    url: 'https://tiles.arcgis.com/tiles/fLeGjb7u4uXqeF9q/arcgis/rest/services/CityImagery_2017_3in/MapServer',
    attribution: 'City of Philadelphia',
};

ReactLeafletEsriTiledMapLayer.propTypes = {
    url: string,
    attribution: string,
};
