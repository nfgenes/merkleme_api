const fs = require("fs");
const express = require("express");
const app = express();
const cors = require('cors');
const keccak = require('keccak256');
const mkjs = require('merkletreejs');
const pinata = require('@pinata/sdk');
const axios = require('axios').default;
const limiter = require('./middleware/limiter.js');
// const path = require("path");

const testRouter = require('./middleware/generateMerkleTree');
const testData = require('./utils/example.json');

const PORT = process.env.PORT || 4001;
const SERVER_ADDRESS = 'https://merklemeapi.vincanger.repl.co';

app.use(express.json());
app.use(cors());
app.use(limiter);

app.use('/test', testRouter);

app.get('/', async (req, res) => {
  res.send('merkleMe API --');  
});

app.post('/', (req, res) => {
  res.end();
});

app.get('/newEndpoint', async (req, res) => {
  res.send('newEndpoint');
});

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}...`)
    console.log('\nWaiting for contract to emit new event...');
});