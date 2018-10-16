const graphql = require('graphql');

const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLSchema,
    GraphQLFloat,
} = graphql;

const {
    RiverGaugeType,
    resolveRiverGaugeData,
    resolveNearestRiverGaugeData,
} = require('./types/riverGaugeType');

const {
    RWDWatershedType,
    resolveRWDWatershed,
} = require('./types/rwdWatershedType');

const {
    ParcelType,
    resolveParcelFromLatLng,
} = require('./types/parcelType');

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        gauge: {
            type: RiverGaugeType,
            description: 'USGS River Gauge sensor data',
            args: {
                id: {
                    type: GraphQLString,
                    description: 'ID of a river gauge sensor in Philadelphia',
                },
                lat: {
                    type: GraphQLFloat,
                    description: 'Latitude for a point',
                },
                lng: {
                    type: GraphQLFloat,
                    description: 'Longitude for a point',
                },
            },
            resolve(_, { id, lat, lng }) {
                if (id) {
                    return resolveRiverGaugeData(id);
                }

                if (lat && lng) {
                    return resolveNearestRiverGaugeData(lat, lng);
                }

                return null;
            },
        },
        rwd: {
            type: RWDWatershedType,
            description: 'Rapid Watershed Delineation produced watershed data',
            args: {
                lat: {
                    type: GraphQLFloat,
                    description: 'Latitude for a point',
                },
                lng: {
                    type: GraphQLFloat,
                    description: 'Longitude for a point',
                },
            },
            resolve(_, { lat, lng }) {
                if (!lat || !lng) {
                    return null;
                }

                return resolveRWDWatershed(lat, lng);
            },
        },
        parcel: {
            type: ParcelType,
            description: 'Parcel data',
            args: {
                address: {
                    type: GraphQLString,
                    description: 'Parcel address',
                },
                lat: {
                    type: GraphQLFloat,
                    description: 'Latitude for a point',
                },
                lng: {
                    type: GraphQLFloat,
                    description: 'Longitude for a point',
                },
            },
            resolve(_, { lat, lng }) {
                if (!lat || !lng) {
                    return null;
                }

                return resolveParcelFromLatLng(lat, lng);
            },
        },
    },
});

module.exports = new GraphQLSchema({
    query: RootQuery,
});
