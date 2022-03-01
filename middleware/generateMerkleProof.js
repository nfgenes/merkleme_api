const keccak256 = require('keccak256');
const toHex = require('to-hex');
const fs = require('fs');
const { MerkleTree } = require('merkletreejs');
const axios = require('axios');

const express = require('express')
const router = express.Router()

/**
 *  TO DO: Add a check for a generated tree that is unbalanced. At a minimum
 *  give a notice of unbalaned tree and perhaps add functionality to auto-balance.
 */

 let tree;
 let root;
 let leaf
 let leafIndex;
 let checkStatus;

// Takes any full IPFS URI and returns the CID only
const parseCID = (ipfsURI) => {
  const uriSplit = ipfsURI.split('/');
  const ipfsCID = uriSplit[uriSplit.length-1];
  return ipfsCID;
}

const generateMerkleTree = async (ipfsURIWhitelist, leafToVerify) => {
  try {

    const whitelistCID = parseCID(ipfsURIWhitelist);

    const url = 'https://gateway.pinata.cloud/ipfs/' + whitelistCID;
    const whitelistData = await axios.get(url, {
      headers: {
          pinata_api_key: process.env['PINATA_API_KEY'],
          pinata_secret_api_key: process.env['PINATA_API_SECRET']
      }
    })

    console.log(whitelistData.data, 'WHITE LIST DATA RETRIEVAL!?!?!?!');
    
    tree = new MerkleTree(whitelistData.data, keccak256, {sortPairs: true, sortLeaves: true, sort: true, hashLeaves: true});
    root = tree.getHexRoot();
    leaf = leafToVerify;
  } catch (e) {
    console.log(e);
  }
}
/**
 * Using the selected leaf value, lookup the corresponding hash
 * and index from the Merkle Tree Summary json file
*/
const getLeafHashFromTreeSummary = (symbol) => {
  try {
    const treeSummary = JSON.parse(fs.readFileSync('./example/MerkleTreeSummary.json'));
    const leafHash = treeSummary.filter(x => x.Leaf === symbol);
    leafHash != 0 ? leafIndex = tree.getLeafIndex(leafHash[0].Hash) : checkStatus = 0;
  } catch (e) {
    console.log(e);
  }
}

const checkValue = () => {
  checkStatus === 0 ? console.log("Error: value does not exist within the list") : getProof(leafIndex);
}

const getProof = (value) => {
  try {
    const leaves = tree.getHexLeaves();
    const proof = tree.getHexProof(leaves[value]);
    const leafValueHex = toHex(leaf);
    const leafFilePath = `./example/MerkleProof_${leaf}.json`;
  
    console.log(`Proof generated for ${leaf}`);
    console.log(`Saving proof to ${leafFilePath}`);
    fs.writeFileSync(leafFilePath, JSON.stringify({
        "Leaf Value": leaf,
        "Leaf Hex": leafValueHex,
        "LeafHash": leaves[value],
        "Proof": proof
    }));
  } catch (e) {
    console.log(e);
  }
}

const runProof = (leafToProve) => {
  generateMerkleTree(leafToProve);
  // pass in a leaf value to generate a proof
  getLeafHashFromTreeSummary(leaf)
  checkValue()
}

router.post('/proof', async (req, res) => {
  console.log(req.body); 
  await generateMerkleTree(req.body.whitelist, req.body.leafToVerify);

  res.end();
})

module.exports = router;