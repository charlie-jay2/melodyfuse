const { MongoClient } = require('mongodb');

exports.handler = async function (event, context) {
    const client = new MongoClient(process.env.MONGODB_URI);
    try {
        await client.connect();
        const database = client.db('melodyFuse');
        const collection = database.collection('schedule');
        const scheduleData = await collection.find({}).toArray();
        const formattedData = scheduleData.reduce((acc, item) => {
            const { date, time, djName } = item;
            if (!acc[date]) acc[date] = {};
            acc[date][time] = djName;
            return acc;
        }, {});
        return {
            statusCode: 200,
            body: JSON.stringify(formattedData),
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Error fetching schedule' }),
        };
    } finally {
        await client.close();
    }
};
