import React from 'react';

const Input = ({ container, label, id, name, handleChange, order, text = '', placeholder = '', type = 'text', bigInput = false , disabled = false }) => {
  return (
    <div className={`block ${container}`}>
      <label className={`block font-semibold ${order}`} htmlFor={id}>{label}</label>
      {bigInput ? (
        <textarea
          rows={6}
          className='block w-full outline-0 p-[.5rem] border border-[#b3b3b3] focus:border-2 focus:border-[#2684ff] rounded mt-4'
          id={id}
          name={name}
          placeholder={placeholder}
          onChange={(e) => handleChange(name, e.target.value)}
          value={text}
        />
      ) : (
        <input
          className={`block ${type === "checkbox" ? "" : "w-full mt-4"} outline-0 p-[.5rem] border border-[#b3b3b3] focus:border-2 focus:border-[#2684ff] rounded`}
          type={type}
          id={id}
          disabled={disabled}
          name={name}
          placeholder={placeholder}
          value={text}
          onChange={(e) => handleChange(name, e.target.value)}
        />
      )}
    </div>
  );
};

export default Input;
