import React from 'react';
import { Query } from 'react-apollo';
import { GeoJSON } from 'react-leaflet';
import { number, func } from 'prop-types';

import { fetchRWD } from '../queries';
import { rwdPolygonStyle } from '../constants';

export default function RWDPolygon({
    lat,
    lng,
    stopFetching,
}) {
    return (
        <Query
            query={fetchRWD}
            variables={{
                lat,
                lng,
            }}
            skip={!lat || !lng}
            onCompleted={stopFetching}
        >
            {
                ({ loading, error, data }) => {
                    if (loading || error) {
                        return null;
                    }

                    const {
                        rwd: {
                            watershed: {
                                geometry,
                            } = {},
                        } = {},
                    } = data;

                    return geometry && (
                        <GeoJSON
                            data={geometry}
                            style={rwdPolygonStyle}
                        />
                    );
                }
            }
        </Query>
    );
}

RWDPolygon.defaultProps = {
    lat: null,
    lng: null,
    stopFetching: () => null,
};

RWDPolygon.propTypes = {
    lat: number,
    lng: number,
    stopFetching: func,
};
