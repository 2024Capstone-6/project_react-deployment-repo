import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

import Login from './pages/Login';
import Member from './pages/Member';
import Japan from './pages/Japan';
import Board from './pages/Board';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/member" element={<Member />} />
          <Route path="/japan" element={<Japan />} />
          <Route path="/board" element={<Board />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
