const { MongoClient } = require('mongodb');

exports.handler = async (event) => {
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: JSON.stringify({ message: 'Method not allowed' }),
        };
    }

    const { MONGODB_URI } = process.env;
    const client = new MongoClient(MONGODB_URI);

    try {
        await client.connect();
        const db = client.db('melodyfuse');
        const collection = db.collection('schedule');

        const { date, timeSlot, djName } = JSON.parse(event.body);

        // Check if the slot is already booked
        const existingSlot = await collection.findOne({ date, timeSlot });

        if (existingSlot && existingSlot.djName !== 'AutoDJ') {
            return {
                statusCode: 403,
                body: JSON.stringify({ message: 'Slot is already booked' }),
            };
        }

        await collection.updateOne(
            { date, timeSlot },
            { $set: { djName } },
            { upsert: true }
        );

        return {
            statusCode: 200,
            body: JSON.stringify({ success: true }),
        };
    } catch (error) {
        console.error('Database error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ success: false, message: 'Internal server error' }),
        };
    } finally {
        await client.close();
    }
};
