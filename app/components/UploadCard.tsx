// components/UploadCard.tsx
"use client";

import React, { useState } from "react";
import { useDropzone } from "react-dropzone";

export default function UploadCard() {
  const [inputType, setInputType] = useState<'file' | 'text'>('file');
  const [text, setText] = useState('');
  const [difficulty, setDifficulty] = useState('easy');
  const [numQuestions, setNumQuestions] = useState(5);
  const [loading, setLoading] = useState(false);

  const { getRootProps, getInputProps } = useDropzone({ accept: ".pdf,.docx,.txt" });

  const handleGenerate = () => {
    if (inputType === 'file' && !getInputProps().value) {
      alert('Please upload a file');
      return;
    }
    if (inputType === 'text' && text.trim() === '') {
      alert('Please enter text');
      return;
    }
    setLoading(true);
    // Call backend API here to generate lesson + quiz
    setTimeout(() => {
      setLoading(false);
      alert('Lesson and Quiz generated successfully!');
    }, 2000);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 max-w-lg">
      <h3 className="text-xl font-semibold mb-4 text-gray-700">Generate Lesson & Quiz</h3>

      {/* Toggle between File Upload and Text Input */}
      <div className="mb-4 flex bg-gray-200 rounded-full overflow-hidden w-max">
        <button
          className={`px-4 py-2 rounded-full transition-all duration-300 ${inputType === 'file' ? 'bg-blue-950 text-white' : 'text-gray-700'}`}
          onClick={() => setInputType('file')}
        >
          Upload File
        </button>
        <button
          className={`px-4 py-2 rounded-full transition-all duration-300 ${inputType === 'text' ? 'bg-blue-950 text-white' : 'text-gray-700'}`}
          onClick={() => setInputType('text')}
        >
          Add Text
        </button>
      </div>

      {/* File Upload with Drag & Drop */}
      {inputType === 'file' && (
        <div {...getRootProps()} className="border-2 border-dashed border-gray-300 p-6 rounded-lg cursor-pointer hover:border-blue-900 hover:bg-gray-50 transition mb-4">
          <input {...getInputProps()} />
          <p className="text-gray-500 text-center">Drag & drop your file here, or click to select</p>
        </div>
      )}

      {/* Text Area */}
      {inputType === 'text' && (
        <textarea
          placeholder="Paste your text here..."
          className="text-gray-900 mb-4 w-full h-32 p-2 border border-gray-300 rounded-md resize-none"
          value={text}
          onChange={(e) => setText(e.target.value)}
        ></textarea>
      )}

      {/* Difficulty Dropdown */}
      <select
        className="mb-4 w-full border border-gray-300 rounded-md p-2 text-gray-700"
        value={difficulty}
        onChange={(e) => setDifficulty(e.target.value)}
      >
        <option value="easy">Easy</option>
        <option value="medium">Medium</option>
        <option value="hard">Hard</option>
      </select>

      {/* Number of Questions */}
      <input
        type="number"
        placeholder="Number of questions"
        className="mb-4 w-full border border-gray-300 rounded-md p-2 text-gray-700"
        value={numQuestions}
        onChange={(e) => setNumQuestions(parseInt(e.target.value))}
        min={1}
      />

      {/* Generate Button */}
      <button
        onClick={handleGenerate}
        disabled={loading}
        className={`w-full bg-blue-950 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        {loading ? 'Generating...' : 'Generate Quiz'}
      </button>
    </div>
  );
}
