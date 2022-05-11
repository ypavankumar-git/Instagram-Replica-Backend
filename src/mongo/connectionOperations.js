const { MongoClient } = require('mongodb');
         operations   = require("./crudOperations");
         constants = require('../constants/constants');

exports.getClient = async () => {

    const uri = "mongodb://pavan:pavan@cluster0-shard-00-00.xoonf.mongodb.net:27017,cluster0-shard-00-01.xoonf.mongodb.net:27017,cluster0-shard-00-02.xoonf.mongodb.net:27017/UserDetails?ssl=true&replicaSet=atlas-54c60b-shard-0&authSource=admin&retryWrites=true&w=majority";
    
    console.log(uri);
   try{
    const client = MongoClient.connect(uri)
    return client;

}catch(e) {
    console.log(e);
}
}

exports.closeClient = async (client) => {
    const result = await client.close();
    return result;
}