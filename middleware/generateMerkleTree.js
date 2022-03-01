const keccak256 = require('keccak256');
const fs = require('fs');
const { MerkleTree } = require('merkletreejs');
const pinataSDK = require('@pinata/sdk');

const express = require('express')
const router = express.Router()

pinata = pinataSDK(process.env['PINATA_API_KEY'], process.env['PINATA_API_SECRET']);

const leafValues = [];
let tree;
let root;

/**
 *  TO DO: Add a check for a generated tree that is unbalanced. At a minimum
 *  give a notice of unbalaned tree and perhaps add functionality to auto-balance.
 */

const generateMerkleTree = (data) => {
  /**
   *  Generate a Merkle Tree based on the geneSymbols array
   */
  try {
    console.log(`\nGenerating a Merkle Tree...`);
    tree = new MerkleTree(data, keccak256, {sortPairs: true, sortLeaves: true, sort: true, hashLeaves: true});
    root = tree.getHexRoot();
  
    // For a short list, you can log it out, but not recommended for large lists
    console.log('Tree:\n', tree.toString());
    
    fs.writeFileSync('./middleware/example/MerkleTree.txt', tree.toString());
    console.log(`Merkle tree generated.
    \nRoot hash is ${root}
    \nTree Summary:
    \n     Leaf Count: ${tree.getLeafCount()}
    \n     Layer Count: ${tree.getLayerCount()}
    \n     Tree Depth: ${tree.getDepth()}
    \nSaving to MerkleTree.txt
    `);
  } catch (e) {
    console.log(e);
  }
}

/*
 * Save the root hash to a file 'MerkleRoot.json'
*/
const saveMerkleRoot = () => {
  try {
    const rootObj = {rootHash: root}
    const jsonRoot = JSON.stringify(rootObj);

    fs.writeFileSync('./middleware/example/MerkleRoot.json', jsonRoot);
    console.log(`Saving the Merkle Root '${root}' to 'MerkleRoot.json'`);
    
    return rootObj;
 
  } catch (e) {
    console.log(e);
  }
}

const generate = async (data) => {
  try {
    for (let i = 0; i < data.length; i++) {
      let currentHash;
      let currentValue;
  
      currentValue = data[i];
      currentHash = `0x${keccak256(data[i].toString('hex'))}`;
      /*
       * Create an object for each address containing the
       * address value and address hash
      */
      leafValues.push({Leaf: currentValue, Hash: currentHash});
    }
  
    /*
     * Generate a file containing a summary of the leaves - i.e.
     * show a mapping of each leaf value to its corresponding hash
    */
    fs.writeFileSync('./middleware/example/MerkleTreeSummary.json', JSON.stringify(leafValues));
    generateMerkleTree(data);
    const rootObj = saveMerkleRoot();
    /*
     * Publish data to IPFS via Pinata API and send JSON to client
    */
    const pinResponse = await pinata.pinJSONToIPFS(rootObj);
    console.log(pinResponse); // this might be better to return 
    const ipfsURI = 'https://ipfs.io/ipfs/' + pinResponse.IpfsHash;
    return JSON.stringify(ipfsURI);
    
  } catch (e) {
    console.log(e);
  }
}

router.use((req, res, next) => {
  console.log('Test Router Hit at: ', Date.now());
  next();
})

router.post('/generate', async (req, res) => {
  const sentData = req.body.data;
  console.log(req.body);
  console.log(sentData);
  const jsonValues = await generate(sentData);
  res.send(jsonValues);
})

module.exports = router;