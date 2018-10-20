import React from 'react';
import { Query } from 'react-apollo';
import { GeoJSON } from 'react-leaflet';
import { number, func } from 'prop-types';

import { fetchParcel } from '../queries';

export default function ParcelPolygon({
    lat,
    lng,
    stopFetching,
}) {
    return (
        <Query
            query={fetchParcel}
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
                        parcel: {
                            geometry,
                        } = {},
                    } = data;

                    return geometry && (
                        <GeoJSON
                            data={geometry}
                            style={() => ({
                                color: 'blue',
                                weight: 5,
                                fillOpacity: 0,
                            })}
                        />
                    );
                }
            }
        </Query>
    );
}

ParcelPolygon.defaultProps = {
    lat: null,
    lng: null,
    stopFetching: () => null,
};

ParcelPolygon.propTypes = {
    lat: number,
    lng: number,
    stopFetching: func,
};
