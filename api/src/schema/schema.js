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
    },
});

module.exports = new GraphQLSchema({
    query: RootQuery,
});
