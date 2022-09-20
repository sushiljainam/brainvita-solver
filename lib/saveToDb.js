// @ts-check
const { MongoClient } = require('mongodb');

const url = 'mongodb://localhost:27020';
const client = new MongoClient(url);
const dbName = 'brainvita';

let conn = null
async function getClient() {
    // console.log('db-conn',!!client && !!client.topology,!!client && !!client.topology && client.topology.isConnected());
    // @ts-ignore
    const isConnected = !!client && !!client.topology && client.topology.isConnected()
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

module.exports.getProgress = async function (query) {
    let cl = await getClient();
    let coll = cl.db(dbName).collection('progress');
    return coll.find(query).sort({ _id: 1 }).toArray();
};

module.exports.addToProgress = async function (query, update) {
    let cl = await getClient();
    let coll = cl.db(dbName).collection('progress');
    return coll.updateOne(query, { $set: update }, { upsert: true });
};

module.exports.addToStepBoards = async function (docs) {
    let cl = await getClient();
    let coll = cl.db(dbName).collection('steps');
    return coll.insertMany(docs)
};

module.exports.getStepBoards = async function (query) {
    let cl = await getClient();
    let coll = cl.db(dbName).collection('steps');
    return coll.find(query).toArray();
};

module.exports.addToAllStepBoards = async function (docs) {
    let cl = await getClient();
    let coll = cl.db(dbName).collection('allsteps');
    return coll.insertMany(docs);
};

module.exports.getStepBoardsForAllSteps = async function (query, opts) {
    let cl = await getClient();
    let coll = cl.db(dbName).collection('allsteps');
    return coll.find(query, opts).toArray();
};

module.exports.getStepBoardsForAllSteps_CURSOR = async function (query, opts) {
    let cl = await getClient();
    let coll = cl.db(dbName).collection('allsteps');
    return coll.find(query, opts).batchSize(2000);
};

module.exports.updateStepBoard = async function (query, update) {
    let cl = await getClient();
    let coll = cl.db(dbName).collection('allsteps');
    return coll.updateOne(query, { $set: update }, { upsert: false });
};

module.exports.findOneAndUpdateStep = async function (query, update) {
    let cl = await getClient();
    let coll = cl.db(dbName).collection('allsteps');
    const doc = await coll.findOneAndUpdate(query, { $set: update }, { returnDocument: 'after', upsert: false });
    return [doc.value];
};

module.exports.countStepBoardsForAllSteps = async function (query) {
    let cl = await getClient();
    let coll = cl.db(dbName).collection('allsteps');
    return coll.countDocuments(query);
}
