const querystring = require('querystring');
const axios = require('axios');
const graphql = require('graphql');

const {
    redisClient,
    redisClientGet,
    roundCoordinate,
} = require('../../utils');

const {
    GraphQLObjectType,
    GraphQLBoolean,
} = graphql;

const ImperviousType = new GraphQLObjectType({
    name: 'ImperviousType',
    fields: {
        curb: {
            type: GraphQLBoolean,
            description: 'Input point is on a curb',
        },
        impervious: {
            type: GraphQLBoolean,
            description: 'Input point is on an impervious surface',
        },
        street: {
            type: GraphQLBoolean,
            description: 'Input point is on a street',
        },
    },
});

async function getLayerURLs() {
    // const imperviousCacheKey = 'IMPERVIOUS_LAYER_URL';
    // const streetsCacheKey = 'STREETS_LAYER_URL';
    // const curbsCacheKey = 'CURBS_LAYER_URL';

    // const cachedImperviousURL = await redisClientGet(imperviousCacheKey);
    // const cachedStreetsURL = await redisClientGet(streetsCacheKey);
    // const cachedCurbsURL = await redisClientGet(curbsCacheKey);

    // if (cachedImperviousURL && cachedStreetsURL && cachedCurbsURL) {
    //     return {
    //         imperviousURL: cachedImperviousURL,
    //         streetsURL: cachedStreetsURL,
    //         curlsURL: cachedCurbsURL,
    //     };
    // }

    const {
        data: {
            imperviousURL,
            streetsURL,
            curbsURL,
        },
    } = await axios
        .post(
            process.env.IMPERVIOUS_AUTH_URL,
            {
                token: process.env.IMPERVIOUS_AUTH_TOKEN,
            },
        );

    // redisClient.set(imperviousCacheKey, imperviousURL);
    // redisClient.set(streetsCacheKey, streetsURL);
    // redisClient.set(curbsCacheKey, curbsURL);

    return {
        imperviousURL,
        streetsURL,
        curbsURL,
    };
}

function createFormData(lat, lng) {
    return {
        f: 'json',
        inSr: '4326',
        geometryType: 'esriGeometryPoint',
        geometry: `{"x": ${lng}, "y": ${lat}}`,
        returnCountOnly: true,
    };
}

async function checkPoint(lat, lng, url) {
    const postData = createFormData(lat, lng);
    const cacheKey = `${url}-${JSON.stringify(postData)}`;

    const cachedPointData = await redisClientGet(cacheKey);

    if (cachedPointData) {
        return cachedPointData;
    }

    const {
        data: {
            count,
        },
    } = await axios.post(url, querystring.stringify(postData));

    const pointData = count > 0;

    redisClient.set(cacheKey, pointData);

    return pointData;
}

async function resolveImperviousFromLatLng(inputLat, inputLng) {
    const lat = roundCoordinate(inputLat);
    const lng = roundCoordinate(inputLng);
    const cacheKey = `impervious-data-${lat}-${lng}`;

    const cachedData = await redisClientGet(cacheKey);

    if (cachedData) {
        return JSON.parse(cachedData);
    }

    const {
        imperviousURL,
        curbsURL,
        streetsURL,
    } = await getLayerURLs();

    const data = {
        impervious: await checkPoint(lat, lng, imperviousURL),
        curb: await checkPoint(lat, lng, curbsURL),
        street: await checkPoint(lat, lng, streetsURL),
    };

    redisClient.set(cacheKey, JSON.stringify(data));

    return data;
}

module.exports = {
    ImperviousType,
    resolveImperviousFromLatLng,
};
