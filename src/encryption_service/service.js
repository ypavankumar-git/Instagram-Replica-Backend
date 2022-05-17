const CryptoJS = require('crypto-js');

const encrypt = (value, key) => {
  const ciphertext = CryptoJS.AES.encrypt(JSON.stringify(value), key).toString();
  return ciphertext;
};

const decrypt = (value, key) => {
  const bytes = CryptoJS.AES.decrypt(value, key);
  const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
  return decryptedData;
};

module.exports = {
  encrypt,
  decrypt,
};
