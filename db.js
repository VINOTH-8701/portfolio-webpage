const { MongoClient } = require("mongodb");

const url = "mongodb://127.0.0.1:27017";
const client = new MongoClient(url);

let database;

async function connectDB() {
    try {
        if (!database) {
            await client.connect();
            console.log("✅ MongoDB Connected Successfully");
            database = client.db("portfolio");
        }
        return database;
    } catch (error) {
        console.error("❌ MongoDB Connection Failed:", error);
        process.exit(1);
    }
}

module.exports = connectDB;