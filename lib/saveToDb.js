const { MongoClient } = require('mongodb');

const url = 'mongodb://localhost:27020';
const client = new MongoClient(url);
const dbName = 'brainvita';

let conn = null
async function getClient() {
    console.log('db-conn',!!client && !!client.topology,!!client && !!client.topology && client.topology.isConnected());
    isConnected = !!client && !!client.topology && client.topology.isConnected()
    if (!(isConnected)) {
        conn = await client.connect();
    }
    return client;
}

module.exports.saveToDb = async function (data) {
    let cl = await getClient();
    let coll = cl.db(dbName).collection('saved');
    await coll.insertMany([
        data
    ]);
};

module.exports.getSaved = async function (query) {
    let cl = await getClient();
    let coll = cl.db(dbName).collection('saved');
    return coll.findOne(query);
};

module.exports.closeDb = async function () {
    let cl = await getClient();
    cl.close();
};