const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: 'postgres',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '',
});

const createUserDb = async () => {
  try {
    // Create database if not exists
    await pool.query('CREATE DATABASE myapp;');
    console.log('Database myapp created');
  } catch (e) {
    if (e.code === '42P04') {
      console.log('Database myapp already exists');
    } else {
      console.log('Database may already exist or error:', e.message);
    }
  } finally {
    await pool.end();
  }
};

const createTables = async () => {
  const pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    database: 'myapp',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || '',
  });

  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS restaurant_tables (
        id SERIAL PRIMARY KEY,
        table_number VARCHAR(10) UNIQUE NOT NULL,
        capacity INTEGER NOT NULL DEFAULT 0,
        table_shape VARCHAR(20) NOT NULL DEFAULT 'Square',
        status VARCHAR(20) NOT NULL DEFAULT 'Available' CHECK (status IN ('Available', 'Occupied', 'Reserved', 'Cleaning'))
      );
    `);
    console.log('Table restaurant_tables created');

    // Insert sample data if empty
    const checkResult = await pool.query('SELECT COUNT(*) FROM restaurant_tables');
    if (parseInt(checkResult.rows[0].count) === 0) {
      await pool.query(`
        INSERT INTO restaurant_tables (table_number, capacity, table_shape, status) VALUES
        ('01', 4, 'Round', 'Available'),
        ('02', 6, 'Square', 'Available'),
        ('03', 8, 'Rectangular', 'Occupied'),
        ('04', 4, 'Round', 'Reserved'),
        ('05', 10, 'Square', 'Available'),
        ('06', 4, 'Round', 'Available'),
        ('07', 6, 'Square', 'Cleaning'),
        ('08', 10, 'Square', 'Available');
      `);
      console.log('Sample data inserted');
    }
  } catch (e) {
    console.error('Error creating tables:', e.message);
  } finally {
    await pool.end();
  }
};

module.exports = { createUserDb, createTables };