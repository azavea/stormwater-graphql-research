import React from 'react';
import { object } from 'prop-types';
import { Text, View, ActivityIndicator } from 'react-native';
import { graphql } from 'react-apollo';

import query from '../queries';

function Screen({
    data: {
        loading,
        error,
        gauge,
    },
}) {
    const insetComponent = (() => {
        if (loading) {
            return (
                <ActivityIndicator
                    size="large"
                    color="#0000ff"
                />
            );
        }

        if (error || !gauge) {
            return (
                <Text>
                    Error!
                </Text>
            );
        }

        const {
            id,
            siteName,
            temperature: {
                reading,
                timestamp,
            },
        } = gauge;

        return (
            <View>
                <Text>
                    Site: {siteName}
                </Text>
                <Text>
                    ID: {id}
                </Text>
                <Text>
                    Temperature: {reading}
                </Text>
                <Text>
                    Timestamp: {timestamp}
                </Text>
            </View>
        );
    })();

    return (
        <View
            style={{
                flex: 1,
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            {insetComponent}
        </View>
    );
}

Screen.propTypes = {
    data: object.isRequired, // eslint-disable-line react/forbid-prop-types
};

export default graphql(query)(Screen);
