// src/components/Dashboard/SearchInput.jsx
import React from 'react';

function SearchInput({ value, onChange }) {
  return (
    <input
      className="px-3 py-2 border rounded-md w-64 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      placeholder="Search..."
      value={value}
      onChange={onChange}
    />
  );
}

export default SearchInput;