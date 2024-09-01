const { MongoClient } = require('mongodb');

exports.handler = async function (event, context) {
    console.log('Received event:', event); // Log the received event

    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    const { showDate, showTime, djName } = JSON.parse(event.body);

    if (!showDate || !showTime || !djName) {
        console.log('Missing required fields'); // Log if any field is missing
        return {
            statusCode: 400,
            body: JSON.stringify({ success: false, message: 'All fields are required.' }),
        };
    }

    const uri = process.env.MONGODB_URI;
    console.log('Connecting to MongoDB at URI:', uri); // Log MongoDB URI connection attempt
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

    try {
        await client.connect();
        console.log('Connected to MongoDB'); // Log successful connection

        const database = client.db('melodyfuse');
        const schedules = database.collection('schedules');

        const result = await schedules.updateOne(
            { date: showDate, hour: showTime },
            { $set: { djName: djName } },
            { upsert: true }
        );

        console.log('Update result:', result); // Log the update result

        return {
            statusCode: 200,
            body: JSON.stringify({ success: true, result }),
        };
    } catch (error) {
        console.log('Error:', error); // Log any errors encountered
        return {
            statusCode: 500,
            body: JSON.stringify({ success: false, error: error.message }),
        };
    } finally {
        await client.close();
        console.log('MongoDB connection closed'); // Log the closure of the connection
    }
};
