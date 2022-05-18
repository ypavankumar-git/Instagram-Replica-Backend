const { MongoClient } = require("mongodb");

exports.getClient = async () => {
  const dbUri = process.env.DB_URI;
  const dbUserName = process.env.DB_USERNAME;
  const dbPassword = process.env.DB_PASSWORD;
  const dbTableName = process.env.DB_USERDETAILS_TABLE_NAME;

  const uri = dbUri
    .replace("username", dbUserName)
    .replace("password", dbPassword)
    .replace("dbTablename", dbTableName);

  const client = MongoClient.connect(uri);
  return client;
};

exports.closeClient = async (client) => {
  const result = await client.close();
  return result;
};
