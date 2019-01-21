import React from 'react';
import ApolloClient from 'apollo-boost';
import { ApolloProvider } from 'react-apollo';

import Main from './components/Main';


const client = new ApolloClient({
    uri: 'http://localhost:9991/',
});


export default function App() {
    return (
        <ApolloProvider client={client}>
            <Main />
        </ApolloProvider>
    );
}
