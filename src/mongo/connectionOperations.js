const { MongoClient } = require('mongodb');
const dbConstants = require('../constants/dbConstants');

exports.getClient = async () => {
  const uri = dbConstants.dbUrl
    .replace('username', dbConstants.dbUserName)
    .replace('password', dbConstants.dbPassword)
    .replace('dbname', dbConstants.dbUserDetailsTableName);

  try {
    const client = MongoClient.connect(uri);
    return client;
  } catch (e) {
    return 'DB Connection Error';
  }
};

exports.closeClient = async (client) => {
  const result = await client.close();
  return result;
};
