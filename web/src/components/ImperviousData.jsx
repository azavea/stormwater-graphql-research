import React from 'react';
import { Query } from 'react-apollo';
import { number, func } from 'prop-types';
import { Card } from '@blueprintjs/core';

import { fetchImpervious } from '../queries';

export default function ImperviousData({
    lat,
    lng,
    stopFetching,
}) {
    return (
        <Query
            query={fetchImpervious}
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
                        impervious: {
                            impervious,
                            curb,
                            street,
                        },
                    } = data;

                    return (
                        <div className="impervious-data-card">
                            <Card>
                                <ul>
                                    <li>
                                        Impervious: {impervious.toString()}
                                    </li>
                                    <li>
                                        Steet: {street.toString()}
                                    </li>
                                    <li>
                                        Curb: {curb.toString()}
                                    </li>
                                </ul>
                            </Card>
                        </div>
                    );
                }
            }
        </Query>
    );
}

ImperviousData.defaultProps = {
    lat: null,
    lng: null,
    stopFetching: () => null,
};

ImperviousData.propTypes = {
    lat: number,
    lng: number,
    stopFetching: func,
};
