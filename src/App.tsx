import { BrowserRouter as Router, Routes, Route, Navigate,useParams } from 'react-router-dom';

import './App.css';

import Navbar from './components/Navbar';

import Login from './pages/Login';
import Member from './pages/Member';
import Japan from './pages/Japan';
import Board from './pages/Board/Board';
import Special from './pages/Special';
import CreateBoard from "./pages/Board/CrateBoard";
import UpdateBoard from './pages/Board/UpdateBoard';
import BoardIN from './pages/Board/BoardIN';

function App() {
  const {idx} = useParams()
  return (
    <div className="App">
      <Router>
        <div className="flex">
          <Navbar />
          <div className="ml-72 mt-4 p-4 flex-1">
            {' '}
            <Routes>
              <Route path="/" element={<Navigate to="/member" />} />
              <Route path="/login" element={<Login />} />
              <Route path="/member" element={<Member />} />
              <Route path="/japan" element={<Japan />} />
              <Route path="/board" element={<Board />} />
              <Route path="/special" element={<Special />} />
              <Route path="/createBoard" element={<CreateBoard />} />
              <Route path="/updateBoard" element={<UpdateBoard />} />
              <Route path="/board/:idx" element={<BoardIN />} />
            </Routes>
          </div>
        </div>
      </Router>
    </div>
  );
}

export default App;
