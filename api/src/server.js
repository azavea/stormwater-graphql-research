const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');

const app = express();
const PORT = 9991;

app.use(helmet());
app.use(cors());
app.use(compression());
app.use(bodyParser.json());
app.use(morgan('combined'));

app.get('*', (req, res) => {
    res.end('hello world');
});

app.listen(PORT, () => {
    console.log(`listening on ${PORT}`);
});
