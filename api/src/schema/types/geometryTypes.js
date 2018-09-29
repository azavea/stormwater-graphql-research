const graphql = require('graphql');

const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLFloat,
} = graphql;

const PointLocationType = new GraphQLObjectType({
    name: 'PointLocationType',
    fields: {
        srs: {
            type: GraphQLString,
            description: 'Spatial reference system',
        },
        lat: {
            type: GraphQLFloat,
            description: 'Latitutde',
        },
        lng: {
            type: GraphQLFloat,
            description: 'Longitude',
        },
    },
});

module.exports = {
    PointLocationType,
};
