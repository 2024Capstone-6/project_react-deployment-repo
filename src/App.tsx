import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import "./App.css";
import { useState } from "react";
import Navbar from "./components/Navbar";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Member from "./pages/Member";
import Japan from "./pages/Japan";
import Board from "./pages/Board/Board";
import Special from "./pages/Special";

import CreateBoard from "./pages/Board/CrateBoard";
import UpdateBoard from './pages/Board/UpdateBoard';
import BoardIN from './pages/Board/BoardIN'; 

// PrivateRoute 컴포넌트 추가
function PrivateRoute({
  children,
  user,
}: {
  children: JSX.Element;
  user: string | null;
}) {
  return user ? children : <Navigate to="/login" />;
}

function App() {
  const [user, setUser] = useState<string | null>(null);

  return (
    <div className="App">
      <Router>
        <div className="flex">
          {user && <Navbar />} {/* 로그인 시에만 Navbar 표시 */}
          <div className={`mt-4 p-4 flex-1 ${user ? "ml-72" : ""}`}>
            <Routes>
              <Route path="/" element={<Navigate to="/login" />} />
              <Route path="/login" element={<Login setUser={setUser} />} />
              <Route path="/signup" element={<Signup />} />
              <Route
                path="/member"
                element={
                  <PrivateRoute user={user}>
                    <Member />
                  </PrivateRoute>
                }
              />
              <Route
                path="/japan"
                element={
                  <PrivateRoute user={user}>
                    <Japan />
                  </PrivateRoute>
                }
              />
              <Route
                path="/board"
                element={
                  <PrivateRoute user={user}>
                    <Board />
                  </PrivateRoute>
                }
              />
              <Route
                path="/board/create"
                element={
                  <PrivateRoute user={user}>
                    <CreateBoard />
                  </PrivateRoute>
                }
              />
              <Route
                path="/board/update/:idx"
                element={
                  <PrivateRoute user={user}>
                    <UpdateBoard />
                  </PrivateRoute>
                }
              />
              <Route
                path="/board/in/:idx"
                element={
                  <PrivateRoute user={user}>
                    <BoardIN />
                  </PrivateRoute>
                }
              />
              <Route
                path="/special"
                element={
                  <PrivateRoute user={user}>
                    <Special />
                  </PrivateRoute>
                }
              />
            </Routes>
          </div>
        </div>
      </Router>
    </div>
  );
}

export default App;
