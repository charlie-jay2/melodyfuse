const { MongoClient } = require('mongodb');

exports.handler = async function (event, context) {
    const MONGODB_URI = process.env.MONGODB_URI;
    if (!MONGODB_URI) {
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'MONGODB_URI environment variable is not set.' }),
        };
    }

    const client = new MongoClient(MONGODB_URI);

    try {
        await client.connect();
        const db = client.db('scheduleDB'); // Replace with your DB name
        const collection = db.collection('schedules'); // Replace with your collection name

        // Assuming the request body contains { date, time, djName }
        const { date, time, djName } = JSON.parse(event.body);

        // Check if slot is already taken
        const existingEntry = await collection.findOne({ date, time });
        if (existingEntry && existingEntry.djName !== 'AutoDJ') {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: 'Slot is already taken.' }),
            };
        }

        // Update or insert the schedule
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
        console.error('Function error:', err);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Internal server error.', error: err.message }),
        };
    } finally {
        await client.close();
    }
};
