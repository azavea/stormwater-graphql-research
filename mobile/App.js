import React from 'react';

import ApolloClient from 'apollo-boost';
import { ApolloProvider } from 'react-apollo';

import Router from './src/Router';

const client = new ApolloClient({
    uri: 'http://localhost:9991',
});

export default function App() {
    return (
        <ApolloProvider client={client}>
            <Router />
        </ApolloProvider>
    );
}
