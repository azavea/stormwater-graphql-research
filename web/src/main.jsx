import React from 'react';
import { render } from 'react-dom';
import ApolloClient from 'apollo-boost';
import { ApolloProvider } from 'react-apollo';

import {
    BrowserRouter,
    Route,
} from 'react-router-dom';

import '../static/main.scss';
import registerServiceWorker from './registerServiceWorker';

import Home from './components/Home';

const client = new ApolloClient({
    uri: 'http://localhost:9991/',
});

export default function App() {
    return (
        <ApolloProvider client={client}>
            <BrowserRouter>
                <div>
                    <Route component={Home} />
                </div>
            </BrowserRouter>
        </ApolloProvider>
    );
}

render(
    <App />,
    document.getElementById('mount'),
);

if (process.env.NODE_ENV === 'production') {
    registerServiceWorker();
}
