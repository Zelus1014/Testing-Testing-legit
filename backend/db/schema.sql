-- Create restaurant_tables table
CREATE TABLE IF NOT EXISTS restaurant_tables (
    id SERIAL PRIMARY KEY,
    table_number VARCHAR(10) UNIQUE NOT NULL,
    capacity INTEGER NOT NULL DEFAULT 0,
    table_shape VARCHAR(20) NOT NULL DEFAULT 'Square',
    status VARCHAR(20) NOT NULL DEFAULT 'Available' CHECK (status IN ('Available', 'Occupied', 'Reserved', 'Cleaning'))
);

-- Insert sample data
INSERT INTO restaurant_tables (table_number, capacity, table_shape, status) VALUES
('01', 4, 'Round', 'Available'),
('02', 6, 'Square', 'Available'),
('03', 8, 'Rectangular', 'Occupied'),
('04', 4, 'Round', 'Reserved'),
('05', 10, 'Square', 'Available'),
('06', 4, 'Round', 'Available'),
('07', 6, 'Square', 'Cleaning'),
('08', 10, 'Square', 'Available');