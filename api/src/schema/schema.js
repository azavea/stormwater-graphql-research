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

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        hello: {
            type: GraphQLString,
            resolve() {
                return 'Hello world';
            },
        },
        gauge: {
            type: RiverGaugeType,
            description: 'USGS River Gauge sensor data',
            args: {
                id: {
                    type: GraphQLString,
                },
                lat: {
                    type: GraphQLFloat,
                },
                lng: {
                    type: GraphQLFloat,
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
    },
});

module.exports = new GraphQLSchema({
    query: RootQuery,
});
