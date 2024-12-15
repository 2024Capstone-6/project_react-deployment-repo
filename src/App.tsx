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
import Board from "./pages/Board";
import Special from "./pages/Special";

// App.tsx: React 애플리케이션의 메인 컴포넌트
// 라우터와 인증을 관리하는 핵심 역할
// PrivateRoute 컴포넌트 추가
// PrivateRoute: 특정 조건에 따라 접근을 제한하는 역할
function PrivateRoute({
  // Props
  children, // 조건이 충족되면 children으로 전달된 컴포넌트를 렌더링
  user, // 로그인된 사용자 정보
}: {
  // children: JSX.Element: React 컴포넌트 안에 포함된 자식 요소
  // JSX.Element: React에서 렌더링 가능한 JSX 요소
  children: JSX.Element;
  // 유저 인증 상태를 나타내는 값
  // string: 사용자가 인증되어 있을 때 유저 정보를 담는 문자열, null: 사용자가 인증되지 않았음
  user: string | null;
}) {
  // user가 null이 아닌 경우 = children을 반환
  // user가 null인 경우 = 로그인 페이지로 리다이렉트
  // React 컴포넌트는 항상 JSX를 반환하거나 null을 반환해야 함
  return user ? children : <Navigate to="/login" />;
}

// App 컴포넌트: React 애플리케이션의 최상위 컴포넌트
// 페이지 라우팅과 인증 로직을 담당
function App() {
  // 현재 로그인된 사용자의 정보 저장
  // string: 사용자 정보를 문자열로 저장, null: 로그인되지 않은 상태
  const [user, setUser] = useState<string | null>(null);

  return (
    <div className="App">
      {/* URL과 컴포넌트를 연결하는 컨테이너 */}
      {/* 내부에 정의된 Routes를 기준으로 URL에 따라 컴포넌트를 렌더링 */}
      <Router>
        <div className="flex">
          {user && <Navbar />} {/* 로그인 시에만 Navbar 표시 */}
          <div className="ml-72 mt-4 p-4 flex-1">
            {/* 여러 개의 경로(Route)를 관리 */}
            {/* 각 경로에 맞는 컴포넌트를 렌더링 */}
            <Routes>
              <Route path="/" element={<Navigate to="/login" />} />
              {/* setUser를 props로 전달 */}
              <Route path="/login" element={<Login setUser={setUser} />} />
              <Route path="/signup" element={<Signup />} />
              <Route
                path="/member"
                element={
                  // user가 null이 아니면 <Member /> 렌더링
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
