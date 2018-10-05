const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const expressGraphQL = require('express-graphql');

const schema = require('./schema/schema');

const app = express();
const PORT = 9991;

app.use(helmet());
app.use(cors());
app.use(compression());
app.use(bodyParser.json());
app.use(morgan('combined'));

app.use('*', expressGraphQL({
    schema,
    graphiql: true,
}));

app.listen(PORT, () => {
    console.log(`listening on ${PORT}`);
});
