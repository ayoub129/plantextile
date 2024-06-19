import React from 'react';

const Button = ({ children, container = '', classes, handlePress }) => {
    return (
        <div className={container}>
            <button
                className={`w-full p-[10px] font-bold rounded text-white ${classes}`}
                onClick={handlePress}
            >
                {children}
            </button>
        </div>
    );
};

export default Button;