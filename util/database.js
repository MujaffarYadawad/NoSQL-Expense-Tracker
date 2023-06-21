 const mongodb = require('mongodb');

 const mongoConnect = (callback) => {
const MongoClient = mongodb.MongoClient;

MongoClient.connect(
  "mongodb+srv://Mujaffar:PLFfqARbtgZa4YNG@cluster0.mocnynh.mongodb.net/?retryWrites=true&w=majority"
)
  .then((client) => {
    console.log("connected!");
    callback(client);
  })
  .catch((err) => {
    console.log(err);
  });
 }

 module.exports = mongoConnect
 