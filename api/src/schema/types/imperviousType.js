const axios = require('axios');
const graphql = require('graphql');

const {
    redisClient,
    redisClientGet,
} = require('../../utils');

const {
    GraphQLObjectType,
    GraphQLString,
} = graphql;

const ImperviousType = new GraphQLObjectType({
    name: 'ImperviousType',
    fields: {
        imperviousURL: {
            type: GraphQLString,
            description: 'Impervious layer URL',
        },
        streetsURL: {
            type: GraphQLString,
            description: 'Streets layer URL',
        },
    },
});

async function getLayerURLs() {
    const imperviousCacheKey = 'IMPERVIOUS_LAYER_URL';
    const streetsCacheKey = 'STREETS_LAYER_URL';

    const cachedImperviousURL = await redisClientGet(imperviousCacheKey);
    const cachedStreetsURL = await redisClientGet(streetsCacheKey);

    if (cachedImperviousURL && cachedStreetsURL) {
        return {
            imperviousURL: cachedImperviousURL,
            streetsURL: cachedStreetsURL,
        };
    }

    const {
        data: {
            imperviousURL,
            streetsURL,
        },
    } = await axios
        .post(
            process.env.IMPERVIOUS_AUTH_URL,
            {
                token: process.env.IMPERVIOUS_AUTH_TOKEN,
            },
        );

    redisClient.set(imperviousCacheKey, imperviousURL);
    redisClient.set(streetsCacheKey, streetsURL);

    return {
        imperviousURL,
        streetsURL,
    };
}

async function resolveImperviousFromLatLng() {
    const urls = await getLayerURLs();

    return urls;
}

module.exports = {
    ImperviousType,
    resolveImperviousFromLatLng,
};
