// netlify/functions/add-schedule.js
const { MongoClient } = require('mongodb');

exports.handler = async function (event, context) {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    const { showDate, showTime, djName } = JSON.parse(event.body);

    if (!showDate || !showTime || !djName) {
        return {
            statusCode: 400,
            body: JSON.stringify({ success: false, message: 'All fields are required.' }),
        };
    }

    const uri = process.env.MONGODB_URI;
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

    try {
        await client.connect();
        const database = client.db('melodyfuse'); // Use your database name
        const schedules = database.collection('schedules'); // Use your collection name

        const result = await schedules.updateOne(
            { date: showDate, hour: showTime },
            { $set: { djName: djName } },
            { upsert: true }
        );

        return {
            statusCode: 200,
            body: JSON.stringify({ success: true, result }),
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ success: false, error: error.message }),
        };
    } finally {
        await client.close();
    }
};
