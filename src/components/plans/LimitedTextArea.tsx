import React, { useState } from 'react'

interface LimitedTextAreaProperties {
    _placeholder: string | 'Text Placeholder';
    _value: string | number | readonly string[] | undefined;
    _maxCharactersLength: number | 100;
    _onTextChanged: (value: string) => void | undefined;
    _isTextLengthVisible: boolean | true;
}

function LimitedTextArea({ _placeholder, _value, _maxCharactersLength, _onTextChanged, _isTextLengthVisible } : LimitedTextAreaProperties) {

    // const [currentText, setCurrentText] = useState('');

    const handleTextChange = (value: string) => {
        _onTextChanged(value);
        // setCurrentText(value);
    };

  return (
    <>
        <div className="flex flex-col gap-2 text-justify">
            <textarea
            className="text-justify w-full p-2 resize-none border rounded dark:bg-gray-800"
            placeholder={_placeholder}
            value={_value}
            onChange={(e) => {
                const input = e.target.value;
                if (input.length <= _maxCharactersLength) {
                    handleTextChange(input); // Update value if within limit
                } else {
                    handleTextChange(input.slice(0, _maxCharactersLength)); // Trim value to 200 characters
                }
                e.target.style.height = "auto"; // Reset height to auto
                e.target.style.height = `${Math.min(e.target.scrollHeight, 100)}px`; // Set height to content but cap at 150px
            }}
            style={{ overflow: "hidden", maxHeight: "100px" }} // Limit max height and hide overflow
            />

            {_isTextLengthVisible &&
                <div className="text-sm text-gray-500">
                    {_value?.toString().length} / {_maxCharactersLength}
                </div>
            }
    </div>    
    </>
  )
}

export default LimitedTextArea