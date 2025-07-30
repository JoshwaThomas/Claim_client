import React from 'react';

const InputBox = ({ label, type = "text", name, value, onChange, placeholder }) => {
  return (
    <div className="w-full mb-4">
      {label && <label htmlFor={name} className="block mb-1 text-sm font-semibold text-gray-700">{label}</label>}
      <input
        type={type}
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
};

export default InputBox;
