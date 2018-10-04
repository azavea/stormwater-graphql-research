// eslint-disable-next-line import/prefer-default-export
export const enumCreator = new Proxy({}, {
    get: (_, key) => key,
});
