import React from 'react';
import logo from './logo.svg';

function App() {
  return (
    <div className="App bg-pink-500 ">
      <header className="App-header">
        
      
        <div className={(true) ? "flex justify-center items-center" : "hidden"}>
<span className="text-5xl">HELLO</span>
<span className="font-black border-b-4 border-blue-500 ">WORLD</span>
        </div>
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link "
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
