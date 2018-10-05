const graphql = require('graphql');
const axios = require('axios');

const {
    PointLocationType,
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
            type: PointLocationType,
            description: 'Original clicked point',
        },
        outputPoint: {
            type: PointLocationType,
            description: 'Watershed drainage outlet point',
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

async function resolveRWDWatershed(lat, lng) {
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
            input_pt, // eslint-disable-line camelcase
        },
    } = await pollRWDResultURL(job);

    console.log(watershed);
    console.log(input_pt);

    return {
        inputPoint: {
            srs: null,
            lat,
            lng,
        },
        outputPoint: {
            srs: null,
            lat,
            lng,
        },
    };
}

module.exports = {
    RWDWatershedType,
    resolveRWDWatershed,
};
