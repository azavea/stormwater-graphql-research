import React, { Fragment, Component } from 'react';
import { View, Text, StatusBar } from 'react-native';
import { Header, Button, Icon, withBadge } from 'react-native-elements';
import SideMenu from 'react-native-side-menu';

import RNMap from './components/RNMap';
import DrawerMenu from './components/DrawerMenu';

import * as COLORS from './colors';

const LIGHT_CONTENT = 'light-content';

export default class Main extends Component {
    state = Object.freeze({
        sideMenuIsOpen: true,
        rwdActive: false,
        parcelActive: false,
    });

    openSideMenu = () => this.setState(state => ({
        ...state,
        sideMenuIsOpen: true,
    }));

    closeSideMenu = () => this.setState(state => ({
        ...state,
        sideMenuIsOpen: false,
    }));

    handleRWDActiveChange = rwdActive => this.setState(state => ({
        ...state,
        rwdActive,
    }));

    handleParcelActiveChange = parcelActive => this.setState(state => ({
        ...state,
        parcelActive,
    }));

    render() {
        const {
            rwdActive,
            parcelActive,
        } = this.state;

        const drawerMenuComponent = (
            <DrawerMenu
                rwdActive={rwdActive}
                parcelActive={parcelActive}
                onRWDActiveChange={this.handleRWDActiveChange}
                onParcelActiveChange={this.handleParcelActiveChange}
            />
        );

        const selectedLayersCount = [
            rwdActive,
            parcelActive,
        ].reduce((acc, next) => acc + next);

        const LayersBadgeIcon = selectedLayersCount
            ? withBadge(
                selectedLayersCount,
                Object.freeze({
                    status: 'error',
                    badgeStyle: Object.freeze({
                        right: 30,
                        bottom: 5,
                    }),
                }))(Icon)
            : Icon;

        return (
            <SideMenu
                isOpen={this.state.sideMenuIsOpen}
                menu={drawerMenuComponent}
            >
                <Header
                    statusBarProps={{ barStyle: LIGHT_CONTENT }}
                    barStyle={LIGHT_CONTENT}
                    backgroundColor={COLORS.AZRAQ_BLUE}
                    leftComponent={
                        (
                            <Button
                                icon={
                                    <Icon
                                        name="settings"
                                        color={COLORS.WHITE}
                                    />
                                }
                                onPress={this.openSideMenu}
                                buttonStyle={{ backgroundColor: COLORS.AZRAQ_BLUE }}
                            />
                        )
                    }
                    centerComponent={{
                        text: 'stormwater-graphql',
                        style: {
                            color: COLORS.WHITE,
                        },
                    }}
                    rightComponent={
                        (
                            <LayersBadgeIcon
                                name="layers"
                                color={COLORS.WHITE}
                            />
                        )
                    }
                />
                <RNMap />
            </SideMenu>
        );
    }
}
