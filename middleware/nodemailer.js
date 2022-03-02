const nodemailer = require('nodemailer');

const sendEmail = async ({userEmail, ipfsURIWhitelist, ipfsURIRootHash, ipfsTreeSummary}) => {
  try {
    let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // use SSL
    auth: {
       user: 'merkle.me.info',
       pass: process.env['MERKLE_ME_PASS'],
     }
  })
  
    const mailOptions = {
      from: 'MerkleMe',
      to: userEmail,
      subject: 'Your MerkleMe IPFS data',
      text: `Your Whitelist: ${ipfsURIWhitelist} \n
      Your Root Hash: ${ipfsURIRootHash} \n
      Your Merkle Tree Summary: ${ipfsTreeSummary} \n\n
      You Have Been Succesfully Merkled ;)`
    };
  
    return await transporter.sendMail(mailOptions);
  } catch (e) {
    console.log(e);
  }
}

module.exports = sendEmail;