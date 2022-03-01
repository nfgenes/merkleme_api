const fs = require("fs");
const express = require("express");
const app = express();
const cors = require('cors');
const axios = require('axios').default;
const limiter = require('./middleware/limiter.js');
// const path = require("path");

const generateMerkleTree = require('./middleware/generateMerkleTree');
const generateMerkleProof = require('./middleware/generateMerkleProof');
const testData = require('./utils/example.json');

const PORT = process.env.PORT || 4001;
const SERVER_ADDRESS = 'https://merklemeapi.vincanger.repl.co';

app.use(express.json());
app.use(cors());
app.use(limiter);

app.use('/merkletree', generateMerkleTree);
app.use('/verify', generateMerkleProof);

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