exports.findUser = async (collection, object) => {
  const user = await collection.findOne(object);
  return user;
};

exports.insertUser = async (collection, object) => {
  const result = await collection.insertOne(object);
  if (result.insertedId) return true;
  return false;
};
