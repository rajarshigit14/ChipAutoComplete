import React, { useState, useRef, useEffect } from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

const suggestionsList = [
  'React', 'Hands On', 'Live Coding', 'Angular', 'Vue JS', 'JS Fundamentals',
  'Typescript', 'Browser/DOM', 'API', 'Router', 'Forms', 'Jest', 'Vue',
  'Templates', 'Directives', 'Routing', 'State management',
  'Asynchronous programming', 'React Js', 'Hooks', 'JSX', 'CSS', 'flex', 'DOM'
];

const REF_CHIPS = 20; 

const ChipAutoComplete = () => {
  const [chips, setChips] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const wrapperRef = useRef(null);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);

    //Show suggestions in the popover list based on user input
    const filtered = suggestionsList.filter(suggestion =>
      suggestion.toLowerCase().includes(value.toLowerCase()) && !chips.includes(suggestion)
    );

    setFilteredSuggestions(filtered);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && inputValue.trim() !== '') {
      const matchedSuggestion = suggestionsList.find(
        suggestion => suggestion.toLowerCase() === inputValue.trim().toLowerCase()
      );

      if (matchedSuggestion) {
        addChip(matchedSuggestion);
      } else {
        addChip(inputValue.trim());
      }

      setInputValue('');
      setFilteredSuggestions([]);
    }
  };
  
  const addChip = (chip) => {
    if (!chips.includes(chip)) {
      setChips([...chips, chip]);
    }
  };
  
  const removeChip = (chip) => {
    setChips(chips.filter(c => c !== chip));
  };
 
  //for the dynamic circular progressbar
  const percentage = ((chips.length % REF_CHIPS) / REF_CHIPS) * 100;
  const overflow = Math.floor(chips.length / REF_CHIPS);

  //For highlighting the typed potion in the suggestion list
  const highlightMatch = (text, query) => {
    const parts = text.split(new RegExp(`(${query})`, 'gi'));
    return (
      <>
        {parts.map((part, index) =>
          part.toLowerCase() === query.toLowerCase() ? (
            <span key={index} style={{ color: 'blue' }}>{part}</span>
          ) : (
            part
          )
        )}
      </>
    );
  };

  //To handle the case when the user doesn't want to select any suggestion from the list and so when he clicks outside the list on the screen the list closes.
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setFilteredSuggestions([]);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [wrapperRef]);

  return (
    <>
      <div className='flex flex-col items-center px-4 sm:px-0'>
        <p className='mb-1 text-lg font-semibold w-full sm:w-3/4 text-left text-gray-500'>Input Tags</p>
        <div className='w-full sm:w-3/4 relative' ref={wrapperRef}>
          <div className="flex flex-wrap items-center border-2 bg-gray-200 border-gray-300 rounded-2xl py-2 px-4">
            {chips.map(chip => (
              <div key={chip} className="flex items-center bg-white text-black-500 font-semibold rounded-full px-3 py-1 m-1 shadow-lg">
                {chip}
                <button className="ml-2" onClick={() => removeChip(chip)}>×</button>
              </div>
            ))}
            <div className="flex-grow flex items-center">
              <input
                type="text"
                placeholder="Search..."
                className="flex-grow outline-none bg-transparent"
                value={inputValue}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
              />
              <div className="ml-2" style={{ width: 30, height: 30 }}>
                <CircularProgressbar
                  value={percentage}
                  styles={buildStyles({
                    pathColor: overflow === 0 ? '#000000' : '#e74c3c', 
                    trailColor: '#e0e0e0'
                  })}
                />
              </div>
            </div>
          </div>
          {filteredSuggestions.length > 0 && (
            <div className="absolute bg-white border border-gray-300 rounded-md mt-1 w-full sm:w-2/5 left-1/2 transform -translate-x-1/2 z-10">
              {filteredSuggestions.map(suggestion => (
                <div
                  key={suggestion}
                  className="cursor-pointer p-2 hover:bg-gray-200 font-semibold"
                  onClick={() => {
                    addChip(suggestion);
                    setInputValue('');
                    setFilteredSuggestions([]);
                  }}
                >
                  {highlightMatch(suggestion, inputValue)}
                </div>
              ))}
            </div>
          )}
        </div>
        <p className='mt-1 text-sm text-gray-500 w-full sm:w-3/4 text-left'>Enter a comma-separated chips and enjoy</p>
      </div>
    </>
  );
};

export default ChipAutoComplete;
