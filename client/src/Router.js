import React from 'react';
import { createBottomTabNavigator } from 'react-navigation';
import { Icon } from 'react-native-elements';

import { enumCreator } from './utils';

import Screen from './components/Screen';

const screensEnum = (() => {
    const { First } = enumCreator;
    return { First };
})();

const screens = Object
    .values(screensEnum)
    .reduce((acc, name) => ({
        ...acc,
        [name]: {
            screen: () => <Screen title={`${name} screen!`} />,
        },
    }), {});

const iconNames = {
    [screensEnum.First]: 'md-create',
};

export default createBottomTabNavigator(
    screens,
    {
        initialRouteName: screensEnum.First,
        navigationOptions: ({ navigation: { state: { routeName } } }) => ({
            tabBarIcon: ({ tintColor }) => ( // eslint-disable-line react/prop-types
                <Icon
                    type="ionicon"
                    name={iconNames[routeName]}
                    color={tintColor}
                />
            ),
        }),
        tabBarOptions: {
            activeTintColor: 'tomato',
            inactiveTintColor: 'gray',
        },
    },
);
