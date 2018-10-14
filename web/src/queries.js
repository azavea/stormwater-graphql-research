import gql from 'graphql-tag';

export const emptyQuery = gql`
query {
    gauge(id: "0") {
        siteName
    }
}
`;

export const fetchRWD = gql`
query FetchRWDAndGauge($lat: Float!, $lng: Float!) {
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
    gauge(lat: $lat, lng: $lng) {
        location {
            lat
            lng
        }
        siteName
        url
        variables
    }
}
`;
