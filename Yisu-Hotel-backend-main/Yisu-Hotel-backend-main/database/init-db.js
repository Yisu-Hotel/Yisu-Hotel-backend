const fs = require('fs');
const path = require('path');
require('dotenv').config();

const { Client } = require('pg');

async function initDatabase() {
    const client = new Client({
        connectionString: process.env.DATABASE_URL
    });

    try {
        console.log(' Connecting to database...');
        await client.connect();
        console.log(' Connected successfully!');

        const sqlFilePath = path.join(__dirname, '..', 'database', 'init.sql');
        const sql = fs.readFileSync(sqlFilePath, 'utf8');

        console.log(' Executing SQL script...');
        await client.query(sql);
        console.log(' Database initialized successfully!');

    } catch (error) {
        console.error(' Error initializing database:', error);
        process.exit(1);
    } finally {
        await client.end();
        console.log('🔌 Connection closed.');
    }
}

initDatabase();
