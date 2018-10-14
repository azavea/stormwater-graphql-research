import React from 'react';
import { bool, func, string } from 'prop-types';
import Control from 'react-leaflet-control';

export default function SelectPointControl({
    position,
    loading,
    selectPointMode,
    toggleSelectPointMode,
}) {
    const buttonText = selectPointMode
        ? 'Cancel'
        : 'Select point';

    return (
        <Control position={position}>
            <div id="select-point-mode-control">
                <button
                    id="select-point-mode-button"
                    onClick={toggleSelectPointMode}
                    disabled={loading}
                >
                    {buttonText}
                </button>
            </div>
        </Control>
    );
}

SelectPointControl.defaultProps = {
    position: 'topleft',
    loading: false,
    selectPointMode: false,
    toggleSelectPointMode: () => null,
};

SelectPointControl.propTypes = {
    position: string,
    loading: bool,
    selectPointMode: bool,
    toggleSelectPointMode: func,
};
