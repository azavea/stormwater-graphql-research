const graphql = require('graphql');

const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLSchema,
} = graphql;

const {
    RiverGaugeType,
    resolveRiverGaugeData,
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
            },
            resolve(_, { id }) {
                return resolveRiverGaugeData(id);
            },
        },
    },
});

module.exports = new GraphQLSchema({
    query: RootQuery,
});
