import React from 'react';
import VoiceRecorder from "./Components/VoiceRecorder.jsx";
import './App.css';
import Sidebar from './Components/SideBar.jsx';

function App() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <Sidebar />
      <VoiceRecorder />
    </div>
  );
}

export default App;