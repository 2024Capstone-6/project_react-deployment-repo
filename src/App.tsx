import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';

import Login from './pages/Login';
import Signup from './pages/Signup';
import Member from './pages/Member';
import Japan from './pages/Japan';
import Board from './pages/Board';
import Special from './pages/Special';

function App() {
// user의 타입을 'string | null'로 지정
const [user, setUser] = useState<string | null>(null);

  return (
    <div className="App">
      <Router>
        <div className="flex">
          <Navbar />
          <div className="ml-72 mt-4 p-4 flex-1">
            {' '}
            <Routes>
              <Route path="/" element={<Navigate to="/member" />} />
              <Route path="/Login" element={<Login setUser={setUser}/>} />
              <Route path="/Signup" element={<Signup />} />
              <Route path="/member" element={<Member />} />
              <Route path="/japan" element={<Japan />} />
              <Route path="/board" element={<Board />} />
              <Route path="/special" element={<Special />} />
            </Routes>
          </div>
        </div>
      </Router>
    </div>
  );
}

export default App;
