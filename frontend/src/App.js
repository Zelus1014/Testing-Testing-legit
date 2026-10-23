import React, { useState, useEffect } from 'react';

function App() {
  const [tables, setTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTables();
  }, []);

  const fetchTables = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/tables');
      const data = await response.json();
      setTables(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching tables:', error);
      setLoading(false);
    }
  };

  const handleTableClick = (table) => {
    setSelectedTable(table);
  };

  const closeModal = () => {
    setSelectedTable(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
        <p>Loading tables...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Restaurant Tables</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl mx-auto">
        {tables.map((table) => (
          <div
            key={table.id}
            onClick={() => handleTableClick(table)}
            className="bg-gray-800 rounded-lg p-4 cursor-pointer hover:bg-gray-700 transition-colors border border-gray-700"
          >
            <div className="flex justify-between items-start">
              <h2 className="text-xl font-semibold">Table {table.table_number}</h2>
              <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(table.status)}`}>
                {table.status}
              </span>
            </div>
            <div className="mt-2 space-y-1 text-gray-300">
              <p className="cursor-pointer hover:text-white hover:underline">
                <span className="font-medium">Capacity:</span> {table.capacity} seats
              </p>
              <p className="cursor-pointer hover:text-white hover:underline">
                <span className="font-medium">Shape:</span> {table.table_shape}
              </p>
              <p className="cursor-pointer hover:text-white hover:underline">
                <span className="font-medium">Status:</span> {table.status}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {selectedTable && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full relative border border-gray-700">
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-white text-2xl font-bold"
            >
              ×
            </button>
            
            <h2 className="text-2xl font-bold mb-4">Table Details</h2>
            
            <div className="space-y-4">
              <div>
                <label className="text-gray-400 text-sm">Table Number</label>
                <p className="text-xl font-semibold cursor-pointer hover:text-blue-400 hover:underline">
                  {selectedTable.table_number}
                </p>
              </div>
              
              <div>
                <label className="text-gray-400 text-sm">Capacity</label>
                <p className="text-xl font-semibold cursor-pointer hover:text-blue-400 hover:underline">
                  {selectedTable.capacity} seats
                </p>
              </div>
              
              <div>
                <label className="text-gray-400 text-sm">Table Shape</label>
                <p className="text-xl font-semibold cursor-pointer hover:text-blue-400 hover:underline">
                  {selectedTable.table_shape}
                </p>
              </div>
              
              <div>
                <label className="text-gray-400 text-sm">Status</label>
                <p className="text-xl font-semibold cursor-pointer hover:text-blue-400 hover:underline">
                  {selectedTable.status}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function getStatusColor(status) {
  const colors = {
    'Available': 'bg-green-900 text-green-200',
    'Occupied': 'bg-red-900 text-red-200',
    'Reserved': 'bg-yellow-900 text-yellow-200',
    'Cleaning': 'bg-blue-900 text-blue-200'
  };
  return colors[status] || 'bg-gray-900 text-gray-200';
}

export default App;