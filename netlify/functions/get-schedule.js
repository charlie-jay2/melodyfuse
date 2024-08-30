const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

exports.handler = async (event, context) => {
    if (event.httpMethod !== 'GET') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    try {
        await client.connect();
        const database = client.db('melodyfuse');
        const collection = database.collection('schedule');

        const schedule = await collection.find({}).toArray();

        const scheduleData = schedule.reduce((acc, entry) => {
            if (!acc[entry.date]) acc[entry.date] = {};
            acc[entry.date][entry.time] = entry.djName;
            return acc;
        }, {});

        return {
            statusCode: 200,
            body: JSON.stringify(scheduleData),
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Internal Server Error', error: error.message }),
        };
    } finally {
        await client.close();
    }
};
