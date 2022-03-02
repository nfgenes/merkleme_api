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
const getLeafHashFromTreeSummary = (leafToVerify) => {
  try {
    const leafHash = `0x${keccak256(leafToVerify).toString('hex')}`;
    console.log(tree.getLeafIndex(leafHash), 'leafIndex');
    leafIndex = tree.getLeafIndex(leafHash);
  } catch (e) {
    console.log(e);
  }
}

// const checkValue = () => {
//   return checkStatus === 0 ? console.log("Error: value does not exist within the list") : getProof(leafIndex);
// }

const getProof = () => {
  try {
    console.log('here', checkStatus)
    if (leafIndex == -1) {
      console.log('Error: value does not exist within the list');
      return {
        leaf: leaf,
        errorMsg: 'Error: value does not exist within the list'
      }
    } 
    
    const leaves = tree.getHexLeaves();
    const proof = tree.getHexProof(leaves[leafIndex]);
    const leafValueHex = toHex(leaf);

    const proofObj = {
        leafValue: leaf,
        leafHex: leafValueHex,
        leafHash: leaves[leafIndex],
        proof: proof
    };

    console.log('proof obj before check', proofObj);

  
    console.log(`Proof generated for ${leaf}`);

    return proofObj;
  } catch (e) {
    console.log(e);
  }
}

const runProof = async (whitelist, leafToVerify) => {
  await generateMerkleTree(whitelist, leafToVerify);
  // pass in a leaf value to generate a proof
  getLeafHashFromTreeSummary(leaf);
  return getProof();
}

router.post('/proof', async (req, res) => {
  console.log(req.body); 
  const result = await runProof(req.body.whitelist, req.body.leafToVerify);
  if (result.errorMsg) {
    res.status(500).json(result);
  } else {
    res.json(result);
  }
})

module.exports = router;