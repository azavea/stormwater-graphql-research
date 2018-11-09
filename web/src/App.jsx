import React, { Component, Suspense, lazy } from 'react';
import { Route } from 'react-router-dom';

import {
    queryModeEnum,
    REACT_LEAFLET_MAP_ID,
} from './constants';

const NavigationBar = lazy(() => import('./components/NavigationBar'));
const ReactLeafletMap = lazy(() => import('./components/ReactLeafletMap'));

export default class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            mode: [queryModeEnum.RWD],
            selectPointMode: false,
            lat: null,
            lng: null,
            error: null,
        };

        this.handleModeChange = this.handleModeChange.bind(this);
        this.startSelectPointMode = this.startSelectPointMode.bind(this);
        this.stopSelectPointMode = this.stopSelectPointMode.bind(this);
        this.handleSelectPoint = this.handleSelectPoint.bind(this);
    }

    static getDerivedStateFromError(error) {
        return { error };
    }

    handleModeChange(mode) {
        return this.setState(state => ({
            ...state,
            mode: state.mode.includes(mode)
                ? state.mode.filter(m => m !== mode)
                : [mode, ...state.mode],
        }));
    }

    startSelectPointMode() {
        return this.setState(
            state => ({
                ...state,
                selectPointMode: true,
            }),
            () => {
                document
                    .getElementById(REACT_LEAFLET_MAP_ID)
                    .style
                    .cursor = 'pointer';
            },
        );
    }

    stopSelectPointMode() {
        return this.setState(
            state => ({
                ...state,
                selectPointMode: false,
            }),
            () => {
                document
                    .getElementById(REACT_LEAFLET_MAP_ID)
                    .style
                    .cursor = null;
            },
        );
    }

    handleSelectPoint({ latlng }) {
        return this.state.selectPointMode
            ? this.setState(state => ({
                ...state,
                ...latlng,
            }), this.stopSelectPointMode)
            : null;
    }

    render() {
        const {
            handleModeChange,
            handleSelectPoint,
            startSelectPointMode,
            stopSelectPointMode,
            state: {
                mode,
                selectPointMode,
                lat,
                lng,
                error,
            },
        } = this;

        if (error) {
            return (
                <div>
                    {error.toString()}
                </div>
            );
        }

        return (
            <div>
                <Suspense fallback={null}>
                    <Route
                        render={
                            () => (
                                <NavigationBar
                                    mode={mode}
                                    handleModeChange={handleModeChange}
                                    selectPointMode={selectPointMode}
                                    startSelectPointMode={startSelectPointMode}
                                    stopSelectPointMode={stopSelectPointMode}
                                />
                            )
                        }
                    />
                    <Route
                        render={
                            () => (
                                <Suspense fallback={null}>
                                    <ReactLeafletMap
                                        mode={mode}
                                        selectPointMode={selectPointMode}
                                        stopSelectPointMode={stopSelectPointMode}
                                        handleSelectPoint={handleSelectPoint}
                                        lat={lat}
                                        lng={lng}
                                    />
                                </Suspense>
                            )
                        }
                    />
                </Suspense>
            </div>
        );
    }
}
