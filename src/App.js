import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [jsonInput, setJsonInput] = useState('');
  const [response, setResponse] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    setJsonInput(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const parsedJson = JSON.parse(jsonInput);
      if (!parsedJson.data || !Array.isArray(parsedJson.data)) {
        throw new Error('Invalid JSON format');
      }
      const res = await axios.post('https://<your-backend-url>/bfhl', parsedJson);
      setResponse(res.data);
      setSelectedOptions([]);
      setError('');
    } catch (err) {
      setError('Invalid JSON format or API error');
    }
  };

  const handleOptionChange = (e) => {
    const value = Array.from(
      e.target.selectedOptions,
      (option) => option.value
    );
    setSelectedOptions(value);
  };

  const renderResponse = () => {
    if (!response) return null;

    const result = [];
    if (selectedOptions.includes('Alphabets')) {
      result.push(<div key="alphabets">Alphabets: {response.alphabets.join(', ')}</div>);
    }
    if (selectedOptions.includes('Numbers')) {
      result.push(<div key="numbers">Numbers: {response.numbers.join(', ')}</div>);
    }
    if (selectedOptions.includes('Highest Lowercase Alphabet')) {
      result.push(
        <div key="highest_lowercase_alphabet">
          Highest Lowercase Alphabet: {response.highest_lowercase_alphabet.join(', ')}
        </div>
      );
    }

    return result;
  };

  return (
    <div className="App">
      <h1>Roll Number: ABCD123</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Enter JSON:
          <textarea
            value={jsonInput}
            onChange={handleInputChange}
            placeholder='{"data": ["A", "C", "z"]}'
          />
        </label>
        <button type="submit">Submit</button>
      </form>
      {error && <div className="error">{error}</div>}
      {response && (
        <div className="response">
          <label>
            Select data to display:
            <select multiple onChange={handleOptionChange}>
              <option value="Alphabets">Alphabets</option>
              <option value="Numbers">Numbers</option>
              <option value="Highest Lowercase Alphabet">Highest Lowercase Alphabet</option>
            </select>
          </label>
          <div className="result">{renderResponse()}</div>
        </div>
      )}
    </div>
  );
}

export default App;
