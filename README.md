# Merkle Me Backend API
## Generate A Merkle Proof

After submitting your entire whitelist via the MerkleMe homepage, your frontend client will need to provide your Solidity Contract with a way of verifying that the connected user's wallet address is a part of this whitelist. The MerkleMe API provides your frontend with the "proof" (i.e. "key") that your contract needs. 

In order to generate the correct proof, you need to pass the correct JSON data to the endpoint:
<ul>
  <li>"whitelist": IPFS link to list of data, e.g. the original "whitelist" of users' wallet addresses. This was provided to you by the MerkleMe client when you submitted your data.
  <li>"leafToVerify": Leaf, e.g. the wallet address of the user to be verified. This is the currently connected user's wallet address 
</ul>

ENDPOINT: https://merklemeapi.vincanger.repl.co/verify/proof 

AXIOS EXAMPLE:
```javascript
const requestBody = {
  "whitelist":"https://gateway.pinata.cloud/ipfs/<YourUniqueCID>",
  "leafToVerify":"0xXXXXXXXXXX..."
}

const response = await axios.post('https://merklemeapi.vincanger.repl.co/verify/proof', requestBody);

console.log(response) /* expected output:
{
  "leafValue": "0x1D42025CDE94B60e99542E537f8E1eeCE9BB109c",
  "leafHex": "1d42025cde94b60e99542e537f8e1eece9bb109c",
  "leafHash": "0x177607c522d091d47ece198401be2eacfaa6ad10f838d3bff8e6de6972a36725",
  "proof":[
"0x1611320f23d814d8102ce1d2a2c1244b6906750b213a2929145378ff827215d5",
"0x230c849359d463cdf268de095c2dec065ae5f39c088184e13944aef34939d242",
"0x573f6cd8397cd609028b77a9864a284e363514e7b9ae1a991c1b52862329c39a",
"0x2885b3b387fa83132c889dff1497c24214d0db3a81015f7a50408809f16c399c"
  ]
}
*/
```
With your Proof returned, you must send this to your solidity contract, for example:
```javascript
const nftTxn = await connectedContract.mintNFT(response.proof);
```
To learn what needs to be sent to your Solidity Contract for proper verification, please visit our [Sample Demo Contract](https://github.com/nfgenes/merkleme/tree/main/example)
