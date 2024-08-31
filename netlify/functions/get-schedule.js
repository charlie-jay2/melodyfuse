const { MongoClient } = require('mongodb');

// Handler function
exports.handler = async (event, context) => {
    const uri = process.env.MONGODB_URI; // Use your environment variable
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

    try {
        await client.connect();
        const collection = client.db('database-name').collection('collection-name');

        // Example: Fetch some data
        const data = await collection.find({}).toArray();

        return {
            statusCode: 200,
            body: JSON.stringify(data)
        };
    } catch (err) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'An error occurred' })
        };
    } finally {
        await client.close();
    }
};
