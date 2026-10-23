var express = require('express');
var router = express.Router();
const { Pool } = require('pg');

const getPool = () => {
  return new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || 'myapp',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || '',
  });
};

// GET /api/v1/restaurant/tables - Get all restaurant tables
router.get('/', async function(req, res, next) {
  let pool;
  try {
    pool = getPool();
    const result = await pool.query('SELECT id, table_number, capacity, table_shape, status FROM restaurant_tables ORDER BY table_number');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching tables:', error);
    res.status(500).json({ error: 'Database error' });
  } finally {
    if (pool) await pool.end();
  }
});

// GET /api/v1/restaurant/tables/available - Search available tables
router.get('/available', async function(req, res, next) {
  let pool;
  try {
    pool = getPool();
    const { date, time, guestCount } = req.query;
    
    // Base query to find available tables
    let query = 'SELECT id, table_number, capacity, table_shape, status FROM restaurant_tables WHERE status = $1 AND capacity >= $2';
    const params = ['Available', parseInt(guestCount) || 1];
    
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching available tables:', error);
    res.status(500).json({ error: 'Database error' });
  } finally {
    if (pool) await pool.end();
  }
});

// GET /api/v1/restaurant/tables/:tableId - Get the details of one table
router.get('/:tableId', async function(req, res, next) {
  let pool;
  try {
    pool = getPool();
    const { tableId } = req.params;
    const result = await pool.query('SELECT id, table_number, capacity, table_shape, status FROM restaurant_tables WHERE id = $1', [tableId]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Table not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching table:', error);
    res.status(500).json({ error: 'Database error' });
  } finally {
    if (pool) await pool.end();
  }
});

module.exports = router;