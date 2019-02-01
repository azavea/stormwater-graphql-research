import React from 'react';
import { bool, func } from 'prop-types';
import { View } from 'react-native';
import { Text, ListItem } from 'react-native-elements';

const drawerContainerMenuStyle = Object.freeze({
    flex: 1,
    alignItems: 'center',
});

export default function DrawerMenu({
    rwdActive,
    parcelActive,
    onRWDActiveChange,
    onParcelActiveChange,
}) {
    const list = Object.freeze([
        Object.freeze({
            title: 'RWD Query',
            subtitle: 'Retrieve RWD data from GraphQL',
            isActive: rwdActive,
            onValueChange: onRWDActiveChange,
        }),
        Object.freeze({
            title: 'Parcel Query',
            subtitle: 'Retrieve Parcel data from GraphQL',
            isActive: parcelActive,
            onValueChange: onParcelActiveChange,
        }),
    ]);

    return (
        <View style={drawerContainerMenuStyle}>
            <Text h3>
                Settings
            </Text>
            <View style={{ flex: 1 }}>
                {
                    list.map(item => (
                        <ListItem
                            style={{ color: 'black' }}
                            key={item.title}
                            title={item.title}
                            subtitle={item.subtitle}
                            switch={{
                                value: item.isActive,
                                onValueChange: item.onValueChange,
                            }}
                        />))
                }
            </View>
        </View>
    );
}

DrawerMenu.propTypes = {
    rwdActive: bool.isRequired,
    parcelActive: bool.isRequired,
    onRWDActiveChange: func.isRequired,
    onParcelActiveChange: func.isRequired,
};
