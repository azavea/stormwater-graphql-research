import React from 'react';
import { bool, func, oneOf } from 'prop-types';
import Control from 'react-leaflet-control';

import {
    controlPositionsEnum,
    queryModeEnum,
} from '../constants';

export default function ToggleRWDParcelModeControl({
    position,
    loading,
    mode,
    toggleRWDParcelMode,
}) {
    return (
        <Control position={position}>
            <div id="toggle-mode-control">
                <button
                    id="toggle-mode-button"
                    onClick={toggleRWDParcelMode}
                    disabled={loading}
                >
                    {mode}
                </button>
            </div>
        </Control>
    );
}

ToggleRWDParcelModeControl.defaultProps = {
    position: controlPositionsEnum.topleft,
    loading: false,
    mode: queryModeEnum.RWD,
    toggleRWDParcelMode: () => null,
};

ToggleRWDParcelModeControl.propTypes = {
    position: oneOf(Object.values(controlPositionsEnum)),
    loading: bool,
    mode: oneOf(Object.values(queryModeEnum)),
    toggleRWDParcelMode: func,
};
