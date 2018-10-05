import React, { Fragment } from 'react';
import { oneOf } from 'prop-types';
import { renderToString } from 'react-dom/server';
import L from 'leaflet';
import { MapControl } from 'react-leaflet';

import {
    controlPositionsEnum,
} from '../constants';

const layerLegendElementID = 'bike-network-layer-legend';

class LayerLegend extends L.Control {
    onAdd() {
        this.container = L.DomUtil.create('div');
        this.container.innerHTML = renderToString((
            <Fragment>
                <div className="legend-swatch" />
                <div className="legend-label">
                    Bike lanes
                </div>
            </Fragment>
        ));

        return Object.assign(this.container, {
            id: layerLegendElementID,
            className: 'layer-legend',
        });
    }
}

export default class ReactLeafletLegend extends MapControl {
    createLeafletElement(props) { // eslint-disable-line class-methods-use-this
        return new LayerLegend({
            position: props.legendPosition,
        });
    }
}

ReactLeafletLegend.defaultProps = {
    legendPosition: controlPositionsEnum.bottomleft,
};

ReactLeafletLegend.propTypes = {
    legendPosition: oneOf(Object.values(controlPositionsEnum)),
};
