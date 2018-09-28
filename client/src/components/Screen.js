import React from 'react';
import { string } from 'prop-types';
import { Text, View } from 'react-native';

export default function Screen({
    title,
}) {
    return (
        <View
            style={{
                flex: 1,
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            <Text>
                {title}
            </Text>
        </View>
    );
}

Screen.defaultProps = {
    title: 'Screen',
};

Screen.propTypes = {
    title: string,
};
