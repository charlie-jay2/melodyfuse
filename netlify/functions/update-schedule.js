const { MongoClient } = require('mongodb');

exports.handler = async function (event, context) {
    const client = new MongoClient(process.env.MONGODB_URI);
    const { date, time, djName } = JSON.parse(event.body);

    try {
        await client.connect();
        const database = client.db('melodyFuse');
        const collection = database.collection('schedule');

        // Check if slot is taken
        const existingSlot = await collection.findOne({ date, time });
        if (existingSlot && existingSlot.djName !== 'AutoDJ') {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: 'This slot is taken, try a different slot' }),
            };
        }

        // Update or insert schedule entry
        const result = await collection.updateOne(
            { date, time },
            { $set: { djName } },
            { upsert: true }
        );

        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Schedule updated successfully' }),
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Error updating schedule' }),
        };
    } finally {
        await client.close();
    }
};
