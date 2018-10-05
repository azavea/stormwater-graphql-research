const graphql = require('graphql');

const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLFloat,
    GraphQLList,
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

const GeoJSONFeatureType = {
    type: GraphQLString,
    description: 'GeoJSON feature type name',
};

const PointGeometryType = new GraphQLObjectType({
    name: 'PointGeometryType',
    fields: {
        type: GeoJSONFeatureType,
        coordinates: {
            type: new GraphQLList(GraphQLFloat),
            description: 'GeoJSON point geometry coordinates',
        },
    },
});

const PolygonGeometryType = new GraphQLObjectType({
    name: 'PolygonGeometryType',
    fields: {
        type: GeoJSONFeatureType,
        coordinates: {
            type: new GraphQLList(new GraphQLList(new GraphQLList(GraphQLFloat))),
            description: 'GeoJSON polygon geometry coordinates',
        },
    },
});

const RWDPointType = new GraphQLObjectType({
    name: 'RWDPointType',
    fields: {
        geometry: {
            type: PointGeometryType,
            description: 'RWD point geometry',
        },
    },
});

const RWDPolygonType = new GraphQLObjectType({
    name: 'RWDPolygonType',
    fields: {
        geometry: {
            type: PolygonGeometryType,
            description: 'RWD-generated watershed GeoJSON polygon',
        },
    },
});

module.exports = {
    PointLocationType,
    RWDPointType,
    RWDPolygonType,
};
