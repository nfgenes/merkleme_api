const keccak256 = require('keccak256');
const fs = require('fs');
const { MerkleTree } = require('merkletreejs')

const express = require('express')
const router = express.Router()

const geneSymbols = [];
const leafValues = [];
let tree;

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
        // For a short list, you can log it out, but not recommended for large lists
        console.log('Tree:\n', tree.toString());
        
        fs.writeFileSync('./middleware/example/MerkleTree.txt', tree.toString());
        console.log(`Merkle tree generated.
        \nRoot hash is ${tree.getHexRoot()}
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

const generateMerkleRoot = () => {
    /**
     *  Create text file called 'MerkleTreeRoot' that contains
     *  the Merkle tree root hash.
     */
    try {
        fs.writeFileSync('./middleware/example/MerkleTreeRoot.json', JSON.stringify(tree.getHexRoot()));
    } catch (e) {
        console.log(e);
    }
}

const generateTreeSummary = (data) => {
  try {
    for (let i = 0; i < data.length; i ++) {
        let currentHash;
        let currentValue;
        currentValue = data[i];
        currentHash = `0x${keccak256(data[i]).toString('hex')}`;
        /*
        *  Create an object for each gene containing:
        *  gene symbol, keccak256 hash, leaf index
        */
        leafValues.push({ "Leaf": currentValue, "Hash": currentHash})
    }
    const jsonLeafValues = JSON.stringify(leafValues);
    fs.writeFileSync('./middleware/example/MerkleTreeSummary.json', jsonLeafValues);
    return jsonLeafValues;
  } catch (e) {
    console.error(e);
  }
    
}

const generate = (data) => {
  generateMerkleTree(data);
  generateMerkleRoot();
  return generateTreeSummary(data);
}

router.use((req, res, next) => {
  console.log('Test Router Hit at: ', Date.now())
  next();
})

router.post('/generate', (req, res) => {
  const sentData = req.body.data;
  console.log(req.body)
  console.log(sentData)
  const jsonLeafValues = generate(sentData);
  res.json(jsonLeafValues);
})

module.exports = router;