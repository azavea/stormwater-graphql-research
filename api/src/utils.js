function roundCoordinate(coord) {
    return Number
        .parseFloat(coord)
        .toPrecision(8);
}

module.exports = {
    roundCoordinate,
};
