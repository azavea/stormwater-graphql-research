import { number, shape } from 'prop-types';

export const mapRegionPropType = shape({
    latitude: number.isRequired,
    longitude: number.isRequired,
    latitudeDelta: number.isRequired,
    longitudeDelta: number.isRequired,
});
