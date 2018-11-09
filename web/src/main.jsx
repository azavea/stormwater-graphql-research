import React from 'react';
import { render } from 'react-dom';
import ApolloClient from 'apollo-boost';
import { ApolloProvider } from 'react-apollo';

import {
    BrowserRouter,
} from 'react-router-dom';

import '../static/main.scss';
import registerServiceWorker from './registerServiceWorker';

import App from './App';

const client = new ApolloClient({
    uri: 'graphql/',
});

render(
    <ApolloProvider client={client}>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </ApolloProvider>,
    document.getElementById('mount'),
);

if (process.env.NODE_ENV === 'production') {
    registerServiceWorker();
}
