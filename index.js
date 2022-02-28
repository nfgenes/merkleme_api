const fs = require("fs");
const express = require("express");
const app = express();
const cors = require('cors');
const ethers = require('ethers');
const EventEmitter = require('events');
const axios = require('axios').default;
// const path = require("path");
// const { abi } = require('./utils/abi.json');

// const Database = require("@replit/database");
// const db = new Database();

const PORT = process.env.PORT || 4001;
// const WS_KEY = process.env['WS_KEY'];
// const provider = new ethers.providers.WebSocketProvider(`wss://eth-rinkeby.alchemyapi.io/v2/${WS_KEY}`, 'rinkeby');
// const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, provider);

const CONTRACT_ADDRESS = '';
const SERVER_ADDRESS = 'https://merklemeapi.vincanger.repl.co';

app.use(express.json());
app.use(cors());

// contract.removeAllListeners();
// contract.on('', () => {
//   const newNumber = Number(x); 
//   console.log("x: ", newNumber);
//   console.log("successMsg: ", successMsg);
//   axios.post(`${SERVER_ADDRESS}`, {num: newNumber})
// });

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