const axios = require('axios');
const R = require('ramda');
const graphql = require('graphql');

const { PointLocationType } = require('./geometryTypes');

const {
    sites: phlSensorSites,
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

const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLID,
    GraphQLFloat,
} = graphql;

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
        location: {
            type: PointLocationType,
            description: 'River gauge point geometry',
        },
        temperature: {
            type: RiverGaugeReadingType,
            description: TEMPERATURE_DESCRIPTION,
        },
        precipitation: {
            type: RiverGaugeReadingType,
            description: PRECIPITATION_DESCRIPTION,
        },
        discharge: {
            type: RiverGaugeReadingType,
            description: DISCHARGE_DESCRIPTION,
        },
        conductance: {
            type: RiverGaugeReadingType,
            description: CONDUCTANCE_DESCRIPTION,
        },
        oxygenValue: {
            type: RiverGaugeReadingType,
            description: OXYGEN_VALUE_DESCRIPTION,
        },
        oxygenPercentage: {
            type: RiverGaugeReadingType,
            description: OXYGEN_PERCENTAGE_DESCRIPTION,
        },
        ph: {
            type: RiverGaugeReadingType,
            description: PH_DESCRIPTION,
        },
        turbidity: {
            type: RiverGaugeReadingType,
            description: TURBIDITY_DESCRIPTION,
        },
        pressure: {
            type: RiverGaugeReadingType,
            description: PRESSURE_DESCRIPTION,
        },
        radiation: {
            type: RiverGaugeReadingType,
            description: RADIATION_DESCRIPTION,
        },
        flourescence: {
            type: RiverGaugeReadingType,
            description: FLUORESCENCE_DESCRIPTION,
        },
        gageHeight: {
            type: RiverGaugeReadingType,
            description: GAGE_HEIGHT_DESCRIPTION,
        },
        depth: {
            type: RiverGaugeReadingType,
            description: DEPTH_DESCRIPTION,
        },
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

const getTemperature = getOrNullValue(R.partialRight(
    getSiteReadingFromTimeSeriesData,
    [TEMPERATURE_DESCRIPTION],
));

const getPrecipitation = getOrNullValue(R.partialRight(
    getSiteReadingFromTimeSeriesData,
    [PRECIPITATION_DESCRIPTION],
));

const getDischarge = getOrNullValue(R.partialRight(
    getSiteReadingFromTimeSeriesData,
    [DISCHARGE_DESCRIPTION],
));

const getConductance = getOrNullValue(R.partialRight(
    getSiteReadingFromTimeSeriesData,
    [CONDUCTANCE_DESCRIPTION],
));

const getOxygenValue = getOrNullValue(R.partialRight(
    getSiteReadingFromTimeSeriesData,
    [OXYGEN_VALUE_DESCRIPTION],
));

const getOxygenPercentage = getOrNullValue(R.partialRight(
    getSiteReadingFromTimeSeriesData,
    [OXYGEN_PERCENTAGE_DESCRIPTION],
));

const getPH = getOrNullValue(R.partialRight(
    getSiteReadingFromTimeSeriesData,
    [PH_DESCRIPTION],
));

const getTurbidity = getOrNullValue(R.partialRight(
    getSiteReadingFromTimeSeriesData,
    [TURBIDITY_DESCRIPTION],
));

const getPressure = getOrNullValue(R.partialRight(
    getSiteReadingFromTimeSeriesData,
    [PRESSURE_DESCRIPTION],
));

const getRadiation = getOrNullValue(R.partialRight(
    getSiteReadingFromTimeSeriesData,
    [RADIATION_DESCRIPTION],
));

const getGageHeight = getOrNullValue(R.partialRight(
    getSiteReadingFromTimeSeriesData,
    [GAGE_HEIGHT_DESCRIPTION],
));

const getDepth = getOrNullValue(R.partialRight(
    getSiteReadingFromTimeSeriesData,
    [DEPTH_DESCRIPTION],
));

const getFluorescence = getOrNullValue(R.partialRight(
    getSiteReadingFromTimeSeriesData,
    [FLUORESCENCE_DESCRIPTION],
));

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

module.exports = {
    RiverGaugeType,
    resolveRiverGaugeData,
};
