import React from 'react';
import { arrayOf, bool, func } from 'prop-types';
import {
    Navbar,
    NavbarGroup,
    NavbarHeading,
    Popover,
    Menu,
    MenuItem,
    Position,
    Alignment,
    Button,
} from '@blueprintjs/core';

import { queryModeEnum } from '../constants';

export default function NavigationBar({
    mode,
    handleModeChange,
    selectPointMode,
    startSelectPointMode,
    stopSelectPointMode,
}) {
    const handleChange = ({ target: { textContent } }) => handleModeChange(textContent);

    const modeMenuItems = Object
        .values(queryModeEnum)
        .map(queryMode => (
            <MenuItem
                active={mode.includes(queryMode)}
                key={queryMode}
                text={queryMode}
                onClick={handleChange}
            />));

    return (
        <Navbar
            className="bp3-dark"
            fixedToTop
        >
            <NavbarGroup>
                <NavbarHeading>
                    stormwater-graphql-research
                </NavbarHeading>
            </NavbarGroup>
            <NavbarGroup align={Alignment.RIGHT}>
                <Button
                    minimal
                    icon="selection"
                    text={selectPointMode ? 'Cancel select point...' : 'Select point...'}
                    onClick={selectPointMode ? stopSelectPointMode : startSelectPointMode}
                />
                <Popover
                    minimal
                    position={Position.BOTTOM}
                    content={
                        (
                            <Menu>
                                {modeMenuItems}
                            </Menu>
                        )
                    }
                >
                    <Button
                        minimal
                        icon="polygon-filter"
                        text="Select queries..."
                    />
                </Popover>
            </NavbarGroup>
        </Navbar>
    );
}

NavigationBar.propTypes = {
    mode: arrayOf(Object.values(queryModeEnum)).isRequired,
    handleModeChange: func.isRequired,
    selectPointMode: bool.isRequired,
    startSelectPointMode: func.isRequired,
    stopSelectPointMode: func.isRequired,
};
