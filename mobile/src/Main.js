import React, { Fragment, Component } from 'react';
import { View, Text, StatusBar } from 'react-native';
import { createStackNavigator, createAppContainer } from 'react-navigation';
import { Button, Icon } from 'react-native-elements';

import RNMap from './components/RNMap';
import EmptyComponent from './components/EmptyComponent';

import * as COLORS from './colors';

class Main extends Component {
    render() {
        return (
            <Fragment>
                <StatusBar
                    barStyle="light-content"
                    backgroundColor={COLORS.AZRAQ_BLUE}
                />
                <RNMap />
            </Fragment>
        );
    }
}

const AppNavigator = createStackNavigator(
    Object.freeze({
        homeScreen: Object.freeze({
            screen: Main,
            navigationOptions: ({ navigation }) => Object.freeze({
                title: 'home',
                headerLeft: (
                    <Button
                        icon={
                            <Icon
                                name="menu"
                                color={COLORS.WHITE}
                            />
                        }
                        onPress={() => navigation.navigate('emptyScreen')}
                        buttonStyle={{
                            backgroundColor: COLORS.AZRAQ_BLUE,
                        }}
                    />
                )
            }),
        }),
        emptyScreen: Object.freeze({
            screen: EmptyComponent,
        }),
    }),
    Object.freeze({
        initialRouteName: 'homeScreen',
        headerMode: 'float',
        defaultNavigationOptions: Object.freeze({
            headerStyle: Object.freeze({
                backgroundColor: COLORS.AZRAQ_BLUE,
            }),
            headerTintColor: 'white',
            headerTintStyle: Object.freeze({
                fontWeight: 'bold',
            }),
        }),
    }),
);


export default createAppContainer(AppNavigator);
