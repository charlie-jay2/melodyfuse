const { MongoClient } = require('mongodb');

exports.handler = async function (event, context) {
    const MONGODB_URI = process.env.MONGODB_URI;

    if (!MONGODB_URI) {
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'MONGODB_URI is not set.' }),
        };
    }

    const client = new MongoClient(MONGODB_URI);

    try {
        await client.connect();
        const db = client.db('scheduleDB');
        const collection = db.collection('schedules');

        const { date, time, djName } = JSON.parse(event.body);

        const existingEntry = await collection.findOne({ date, time });
        if (existingEntry && existingEntry.djName !== 'AutoDJ') {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: 'Slot is already taken.' }),
            };
        }

        await collection.updateOne(
            { date, time },
            { $set: { djName } },
            { upsert: true }
        );

        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Schedule updated successfully.' }),
        };
    } catch (err) {
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Internal server error.', error: err.message }),
        };
    } finally {
        await client.close();
    }
};
