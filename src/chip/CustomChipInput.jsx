import React, { useEffect, useState } from 'react';
import './customchipinput.css';

function CustomChipInput({ value = [], onChange, placeholder = 'Add a chip...' }) {
    const [inputValue, setInputValue] = useState('');

    const handleAddChip = (e) => {
        if (e.key === 'Enter' && !value.includes(inputValue)) {
            e.preventDefault();
            onChange([...value, inputValue.trim()]);
            setInputValue('');
        }
    };

    const handleRemoveChip = (chipToRemove) => {
        onChange(value.filter((chip) => chip !== chipToRemove));
    };


    return (
        <div className="chip-input-container bg-gray-900 border border-gray-300">
            <div className="chip-wrapper">
                {value.map((chip, index) => (
                    <span className="chip" key={index}>
                        {chip}
                        <button className="remove-chip" onClick={() => handleRemoveChip(chip)}>
                            ×
                        </button>
                    </span>
                ))}
                <input
                    type="text"
                    className="chip-input"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleAddChip}
                    placeholder={placeholder}
                />
            </div>
        </div>
    );
}

export default CustomChipInput;
