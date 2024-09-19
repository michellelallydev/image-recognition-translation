import logo from './logo.svg';
import './App.css';

// App.js
import React from "react";
import Header from "./components/Header";
import ImageRecognition from "./components/ImageRecognition";
import TranslateImageRecognition from "./components/TranslateImageRecognition";

const App = () => {
  return (
    <div className="App">
      <Header />
      <div className="container mx-auto p-4">
        <div className="bg-gray-200 p-6 rounded-md">
          <h1 className="text-2xl font-bold mb-4">
            Choose your language
          </h1>
          <TranslateImageRecognition />
        </div>
      </div>
    </div>
  );
};

export default App;