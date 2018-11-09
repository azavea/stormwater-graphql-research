import gql from 'graphql-tag';

export const fetchRWD = gql`
query FetchRWD($lat: Float!, $lng: Float!) {
    rwd(lat: $lat, lng: $lng) {
        inputPoint {
            geometry {
                type
                coordinates
            }
        }
        watershed {
            geometry {
                type
                coordinates
            }
        }
    }
}
`;

export const fetchParcel = gql`
query FetchParcel($lat: Float!, $lng: Float!) {
    parcel(lat: $lat, lng: $lng) {
        geometry {
            type
            coordinates
        }
    }
}
`;

export const fetchImpervious = gql`
query FetchImpervious($lat: Float!, $lng: Float!) {
    impervious(lat: $lat, lng: $lng) {
        impervious
        curb
        street
    }
}
`;
