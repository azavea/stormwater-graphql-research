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

const axiosOptions = {
    headers: {
        Authorization: `Token ${process.env.RWD_API_KEY}`,
    },
};

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

function makeRWDRequestURL() {
    return `${process.env.RWD_API_URL}/watershed/`;
}

function makeRWDJobResultURL(jobID) {
    return `${process.env.RWD_API_URL}/jobs/${jobID}/`;
}

async function pollRWDResultURL(jobID) {
    const { data } = await axios
        .get(
            makeRWDJobResultURL(jobID),
            {
                ...axiosOptions,
            },
        );

    return data.status === 'started'
        ? pollRWDResultURL(jobID)
        : data;
}

async function retrieveRWDResult(lat, lng) {
    const {
        data: {
            job,
        },
    } = await axios
        .post(
            makeRWDRequestURL(),
            createRWDLocationObject(lat, lng),
            {
                ...axiosOptions,
            },
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

async function resolveRWDWatershed(lat, lng) {
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
