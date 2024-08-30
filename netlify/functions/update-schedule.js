const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

exports.handler = async (event, context) => {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    } else if (event.httpMethod !== 'POST') {
        return { statusCode: 200, body: 'Variable accessed succesfully.' }
    }

    const data = JSON.parse(event.body);
    const { date, time, djName } = data;

    try {
        await client.connect();
        const database = client.db('melodyfuse');
        const collection = database.collection('schedule');

        // Check for conflict
        const existing = await collection.findOne({ date, time });
        if (existing) {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: 'Time slot already taken' }),
            };
        }

        // Insert new schedule entry
        await collection.insertOne({ date, time, djName });

        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Schedule updated successfully' }),
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
