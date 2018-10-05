const axios = require('axios');
const R = require('ramda');
const graphql = require('graphql');
const turf = require('@turf/turf');

const { PointLocationType } = require('./geometryTypes');

const {
    sites,
    variables: {
        TEMPERATURE_DESCRIPTION,
        DISCHARGE_DESCRIPTION,
        GAGE_HEIGHT_DESCRIPTION,
        CONDUCTANCE_DESCRIPTION,
        OXYGEN_VALUE_DESCRIPTION,
        OXYGEN_PERCENTAGE_DESCRIPTION,
        PH_DESCRIPTION,
        TURBIDITY_DESCRIPTION,
        PRESSURE_DESCRIPTION,
        RADIATION_DESCRIPTION,
        FLUORESCENCE_DESCRIPTION,
        PRECIPITATION_DESCRIPTION,
        DEPTH_DESCRIPTION,
    },
} = require('./phlSensors');

const sensorsFeatureCollection = turf.featureCollection(
    sites.map(({ geom, id }) => turf.point([geom.longitude, geom.latitude], { id })),
);

const phlSensorSites = sites.map(({ id }) => id);

const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLID,
    GraphQLFloat,
    GraphQLList,
} = graphql;

const variableMappings = {
    [TEMPERATURE_DESCRIPTION]: 'temperature',
    [DISCHARGE_DESCRIPTION]: 'discharge',
    [GAGE_HEIGHT_DESCRIPTION]: 'gageHeight',
    [CONDUCTANCE_DESCRIPTION]: 'conductance',
    [OXYGEN_VALUE_DESCRIPTION]: 'oxygenValue',
    [OXYGEN_PERCENTAGE_DESCRIPTION]: 'oxygenPercentage',
    [PH_DESCRIPTION]: 'ph',
    [TURBIDITY_DESCRIPTION]: 'turbidity',
    [PRESSURE_DESCRIPTION]: 'pressure',
    [RADIATION_DESCRIPTION]: 'radiation',
    [FLUORESCENCE_DESCRIPTION]: 'fluorescence',
    [PRECIPITATION_DESCRIPTION]: 'precipitation',
    [DEPTH_DESCRIPTION]: 'depth',
};

const RiverGaugeReadingType = new GraphQLObjectType({
    name: 'RiverGaugeReadingType',
    fields: {
        timestamp: {
            type: GraphQLString,
            description: 'Reading timestamp',
        },
        reading: {
            type: GraphQLFloat,
            desciption: 'Reading',
        },
    },
});

const riverGageReadingVariables = Object
    .entries(variableMappings)
    .reduce((acc, [description, queryParam]) => ({
        ...acc,
        [queryParam]: {
            type: RiverGaugeReadingType,
            description,
        },
    }), {});

const RiverGaugeType = new GraphQLObjectType({
    name: 'RiverGaugeType',
    fields: {
        id: {
            type: GraphQLID,
            description: 'River gauge ID',
        },
        siteName: {
            type: GraphQLString,
            description: 'River gauge site name',
        },
        url: {
            type: GraphQLString,
            description: 'URL for river gauge website',
        },
        location: {
            type: PointLocationType,
            description: 'River gauge point geometry',
        },
        variables: {
            type: new GraphQLList(GraphQLString),
            description: 'Available variables for river gauge sensor readings',
        },
        ...riverGageReadingVariables,
    },
});

function makeRiverGaugeURL(id) {
    return `https://waterservices.usgs.gov/nwis/iv/?format=json&sites=${id}`;
}

function getSiteNameFromTimeSeriesData([
    {
        sourceInfo: {
            siteName,
        },
    },
]) {
    return siteName;
}

function getSiteLocationFromTimeSeriesData([
    {
        sourceInfo: {
            geoLocation: {
                geogLocation: {
                    srs,
                    latitude,
                    longitude,
                },
            },
        },
    },
]) {
    return {
        srs,
        lat: latitude,
        lng: longitude,
    };
}

function getAvailableVariablesFromTimeSeriesData(data) {
    return data
        .map(({
            variable: {
                variableDescription,
            },
        }) => variableMappings[variableDescription] || variableDescription);
}

const nullReading = {
    reading: null,
    timestamp: null,
};

function getSiteReadingFromTimeSeriesData(data, reading) {
    const readingFromData = data
        .find(({
            variable: {
                variableDescription,
            },
        }) => variableDescription === reading);

    if (!readingFromData) {
        return nullReading;
    }

    const {
        values: [
            {
                value: [
                    {
                        value,
                        dateTime,
                    },
                ],
            },
        ],
    } = readingFromData;

    return {
        reading: value,
        timestamp: dateTime,
    };
}

const getOrNullValue = f => R.tryCatch(f, () => nullReading);
const tryGetSiteReading = variable => getOrNullValue(R.partialRight(
    getSiteReadingFromTimeSeriesData,
    [variable],
));

const getTemperature = tryGetSiteReading(TEMPERATURE_DESCRIPTION);
const getPrecipitation = tryGetSiteReading(PRECIPITATION_DESCRIPTION);
const getDischarge = tryGetSiteReading(DISCHARGE_DESCRIPTION);
const getConductance = tryGetSiteReading(CONDUCTANCE_DESCRIPTION);
const getOxygenValue = tryGetSiteReading(OXYGEN_VALUE_DESCRIPTION);
const getOxygenPercentage = tryGetSiteReading(OXYGEN_PERCENTAGE_DESCRIPTION);
const getPH = tryGetSiteReading(PH_DESCRIPTION);
const getTurbidity = tryGetSiteReading(TURBIDITY_DESCRIPTION);
const getPressure = tryGetSiteReading(PRESSURE_DESCRIPTION);
const getRadiation = tryGetSiteReading(RADIATION_DESCRIPTION);
const getGageHeight = tryGetSiteReading(GAGE_HEIGHT_DESCRIPTION);
const getFluorescence = tryGetSiteReading(FLUORESCENCE_DESCRIPTION);
const getDepth = tryGetSiteReading(DEPTH_DESCRIPTION);

async function resolveRiverGaugeData(id) {
    if (!id || id.length < 8 || !phlSensorSites.includes(id)) {
        return null;
    }

    const url = makeRiverGaugeURL(id);

    const {
        data: {
            value: {
                timeSeries: data,
            },
        },
    } = await axios.get(url);

    return {
        id,
        siteName: getSiteNameFromTimeSeriesData(data),
        url: `https://waterdata.usgs.gov/usa/nwis/uv?${id}`,
        variables: getAvailableVariablesFromTimeSeriesData(data),
        location: getSiteLocationFromTimeSeriesData(data),
        temperature: getTemperature(data),
        precipitation: getPrecipitation(data),
        discharge: getDischarge(data),
        conductance: getConductance(data),
        oxygenValue: getOxygenValue(data),
        oxygenPercentage: getOxygenPercentage(data),
        ph: getPH(data),
        turbidity: getTurbidity(data),
        pressure: getPressure(data),
        radiation: getRadiation(data),
        depth: getDepth(data),
        gageHeight: getGageHeight(data),
        fluorescence: getFluorescence(data),
    };
}

async function resolveNearestRiverGaugeData(lat, lng) {
    const {
        properties: {
            id,
        },
    } = turf.nearestPoint(
        turf.point([lng, lat]),
        sensorsFeatureCollection,
    );

    return resolveRiverGaugeData(id);
}

module.exports = {
    RiverGaugeType,
    resolveRiverGaugeData,
    resolveNearestRiverGaugeData,
};
