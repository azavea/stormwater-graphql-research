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

const {
    ImperviousType,
    resolveImperviousFromLatLng,
} = require('./types/imperviousType');

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
                return (lat && lng)
                    ? resolveRWDWatershed(lat, lng)
                    : null;
            },
        },
        parcel: {
            type: ParcelType,
            description: 'Parcel data',
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
                return (lat && lng)
                    ? resolveParcelFromLatLng(lat, lng)
                    : null;
            },
        },
        impervious: {
            type: ImperviousType,
            description: 'Impervious and streets layer data',
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
                return (lat && lng)
                    ? resolveImperviousFromLatLng(lat, lng)
                    : null;
            },
        },
    },
});

module.exports = new GraphQLSchema({
    query: RootQuery,
});
