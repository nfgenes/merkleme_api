const ipfsURIWhitelist = 'https://ipfs.io/ipfs/QmUAcEiVCnPDSbq1SVAQYfq3QBJ2nZ4z2SbVo4LK4HRfsg';
const ipfsURIRootHash = 'https://ipfs.io/ipfs/QmasGGvrPnc3AM194xeFYohJj4oqxT7Yvb1fW88kLK3TS5';

const parseCIDs = (ipfsURIWhitelist, ipfsURIRootHash) => {
  const whitelist = ipfsURIWhitelist.split('/');
  const whitelistCID = whitelist[whitelist.length-1];
  // console.log(whitelistCID);
  const rootHash = ipfsURIRootHash.split('/');
  const rootHashCID = rootHash[rootHash.length-1];
  // console.log(rootHashCID);

}

parseCIDs(ipfsURIWhitelist, ipfsURIRootHash);