import React from 'react';
import { object } from 'prop-types';
import { Text, View, ActivityIndicator } from 'react-native';
import { graphql } from 'react-apollo';

import query from '../queries';

function Screen({
    data: {
        loading,
        error,
        hello,
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

        if (error) {
            return (
                <Text>
                    Error!
                </Text>
            );
        }

        return (
            <Text>
                {hello}
            </Text>
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
