const { promisify } = require('util');
const axios = require('axios');
const graphql = require('graphql');
const redis = require('redis');

const { roundCoordinate } = require('../../utils');

const redisClient = redis.createClient({
    host: 'redis-server',
});

const redisClientGet = promisify(redisClient.get)
    .bind(redisClient);

const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLInt,
    GraphQLFloat,
} = graphql;

const ParcelType = new GraphQLObjectType({
    name: 'ParcelType',
    fields: {
        address: {
            type: GraphQLString,
            description: 'Parcel address',
        },
        parcelID: {
            type: GraphQLInt,
            description: 'Parcel ID',
        },
        grossArea: {
            type: GraphQLFloat,
            description: 'Parcel gross area',
        },
        impervArea: {
            type: GraphQLFloat,
            description: 'Parcel impervious area',
        },
        bldgType: {
            type: GraphQLString,
            description: 'Parcel building type classification',
        },
        area: {
            type: GraphQLFloat,
            description: 'Parcel area',
        },
        lat: {
            type: GraphQLFloat,
            description: 'Parcel centroid latitude',
        },
        lng: {
            type: GraphQLFloat,
            description: 'Parcel centroid longitude',
        },
        shape: {
            type: GraphQLString,
            description: 'Parcel shape well known text',
        },
    },
});

async function getParcelURL() {
    return axios
        .post(
            process.env.PARCEL_AUTH_URL,
            {
                token: process.env.PARCEL_AUTH_TOKEN,
            },
        );
}

async function createParcelBaseURL() {
    const parcelURLCacheKey = 'PARCEL_DATA_URL';
    const cachedParcelBaseURL = await redisClientGet(parcelURLCacheKey);

    if (cachedParcelBaseURL) {
        return cachedParcelBaseURL;
    }

    const {
        data: {
            url,
        },
    } = await getParcelURL();

    redisClient.set(parcelURLCacheKey, url);

    return url;
}

async function makeGetParcelDataFromLatLngURL(lat, lng) {
    const baseURL = await createParcelBaseURL();

    return `${baseURL}?x=${lng}&y=${lat}`;
}

function reformatParcelResult([result]) {
    if (!result) {
        return null;
    }

    const {
        Area: area,
        X: lng,
        Y: lat,
        Parcel: {
            ParcelID: parcelID,
            Address: address,
            GrossArea: grossArea,
            ImpervArea: impervArea,
            BldgType: bldgType,
            Shape: shape,
        },
    } = result;

    return {
        parcelID,
        address,
        grossArea,
        impervArea,
        bldgType,
        shape,
        area,
        lat,
        lng,
    };
}

async function retrieveParcelDataFromLatLng(lat, lng) {
    const requestURL = await makeGetParcelDataFromLatLngURL(lat, lng);

    const {
        data,
    } = await axios.get(requestURL);

    return reformatParcelResult(data);
}

async function resolveParcelFromLatLng(inputLat, inputLng) {
    const lat = roundCoordinate(inputLat);
    const lng = roundCoordinate(inputLng);

    const cacheKey = `parcel-lat-lng-${lat}-${lng}`;
    const cacheResponse = await redisClientGet(cacheKey);

    if (cacheResponse) {
        return JSON.parse(cacheResponse);
    }

    const parcelResult = await retrieveParcelDataFromLatLng(lat, lng);

    redisClient.set(cacheKey, JSON.stringify(parcelResult));

    return parcelResult;
}

module.exports = {
    ParcelType,
    resolveParcelFromLatLng,
};
