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

// Get all tables
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

// Get single table by id
router.get('/:id', async function(req, res, next) {
  let pool;
  try {
    pool = getPool();
    const { id } = req.params;
    const result = await pool.query('SELECT id, table_number, capacity, table_shape, status FROM restaurant_tables WHERE id = $1', [id]);
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

// Get table by table_number
router.get('/number/:number', async function(req, res, next) {
  let pool;
  try {
    pool = getPool();
    const { number } = req.params;
    const result = await pool.query('SELECT id, table_number, capacity, table_shape, status FROM restaurant_tables WHERE table_number = $1', [number]);
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