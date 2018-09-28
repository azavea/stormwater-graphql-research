import React from 'react';

import ApolloClient from 'apollo-boost';
import { ApolloProvider } from 'react-apollo';

import Router from './src/Router';

import query from './src/queries';

const client = new ApolloClient({
    uri: 'https://w5xlvm3vzz.lp.gql.zone/graphql',
});

client
    .query({ query })
    .then(data => console.log(data)) // eslint-disable-line no-console
    .catch(err => console.warn(err)); // eslint-disable-line no-console

export default function App() {
    return (
        <ApolloProvider client={client}>
            <Router />
        </ApolloProvider>
    );
}
