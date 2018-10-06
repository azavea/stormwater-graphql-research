const { promisify } = require('util');
const graphql = require('graphql');
const axios = require('axios');
const redis = require('redis');

const redisClient = redis.createClient({
    host: 'redis-server',
});

const redisClientGet = promisify(redisClient.get)
    .bind(redisClient);

const {
    RWDPointType,
    RWDPolygonType,
} = require('./geometryTypes');

const {
    GraphQLObjectType,
} = graphql;

const RWDWatershedType = new GraphQLObjectType({
    name: 'RWDWatershedType',
    fields: {
        inputPoint: {
            type: RWDPointType,
            description: 'Original clicked point GeoJSON',
        },
        watershed: {
            type: RWDPolygonType,
            description: 'RWD-generated watershed GeoJSON polygon',
        },
    },
});

function createRWDLocationObject(lat, lng) {
    return {
        location: [
            Number(lat),
            Number(lng),
        ],
        snappingOn: true,
        dataSource: 'drb',
    };
}

async function getRWDURLAndToken() {
    return axios
        .post(
            process.env.RWD_AUTH_URL,
            {
                token: process.env.RWD_AUTH_TOKEN,
            },
        );
}

function createAxiosOptions(key) {
    return {
        headers: {
            Authorization: `Token ${key}`,
        },
    };
}

const rwdURLCacheKey = 'RWD_AUTH_URL';
const rwdAuthCacheKey = 'RWD_AUTH_KEY';

async function createRWDAuthHeader() {
    const cachedRWDAuthKey = await redisClientGet(rwdAuthCacheKey);

    if (cachedRWDAuthKey) {
        return createAxiosOptions(cachedRWDAuthKey);
    }

    const {
        data: {
            key,
            url,
        },
    } = await getRWDURLAndToken();

    redisClient.set(rwdAuthCacheKey, key);
    redisClient.set(rwdURLCacheKey, url);

    return createAxiosOptions(key);
}

async function createRWDBaseURL() {
    const cachedRWDBaseURL = await redisClientGet('RWD_AUTH_URL');

    if (cachedRWDBaseURL) {
        return cachedRWDBaseURL;
    }

    const {
        data: {
            key,
            url,
        },
    } = await getRWDURLAndToken();

    redisClient.set(rwdAuthCacheKey, key);
    redisClient.set(rwdURLCacheKey, url);

    return url;
}

async function makeRWDRequestURL() {
    return `${await createRWDBaseURL()}/watershed/`;
}

async function makeRWDJobResultURL(jobID) {
    return `${await createRWDBaseURL()}/jobs/${jobID}/`;
}

async function pollRWDResultURL(jobID) {
    const resultURL = await makeRWDJobResultURL(jobID);
    const rwdAuthHeader = await createRWDAuthHeader();

    const { data } = await axios.get(resultURL, rwdAuthHeader);

    return data.status === 'started'
        ? pollRWDResultURL(jobID)
        : data;
}

async function retrieveRWDResult(lat, lng) {
    const requestURL = await makeRWDRequestURL();
    const rwdAuthHeader = await createRWDAuthHeader();

    const {
        data: {
            job,
        },
    } = await axios
        .post(
            requestURL,
            createRWDLocationObject(lat, lng),
            rwdAuthHeader,
        );

    const {
        result: {
            watershed,
            input_pt: inputPoint,
        },
    } = await pollRWDResultURL(job);

    return {
        inputPoint,
        watershed,
    };
}

function roundCoordinate(coord) {
    return Number
        .parseFloat(coord)
        .toPrecision(8);
}

async function resolveRWDWatershed(inputLat, inputLng) {
    const lat = roundCoordinate(inputLat);
    const lng = roundCoordinate(inputLng);

    const cacheKey = `${lat}${lng}`;
    const cacheReponse = await redisClientGet(cacheKey);

    if (cacheReponse) {
        return JSON.parse(cacheReponse);
    }

    const rwdResult = await retrieveRWDResult(lat, lng);

    redisClient.set(cacheKey, JSON.stringify(rwdResult));

    return rwdResult;
}

module.exports = {
    RWDWatershedType,
    resolveRWDWatershed,
};
