import { Link, useLocation, useNavigate } from "react-router-dom";

export default function Navbar() {
  // useLocation: 현재 URL 경로 정보를 가져오는 React Router 훅
  // location: 현재 URL 경로를 저장
  const location = useLocation();
  // useNavigate: 프로그래밍적으로 경로를 이동할 때 사용하는 React Router 훅
  // navigate: 특정 경로로 이동하는 함수
  const navigate = useNavigate();

  // 네비게이션에 표시될 페이지 경로와 이름
  const routes = [
    { path: "/member", label: "Member" },
    { path: "/japan", label: "Japan" },
    { path: "/board", label: "Board" },
    { path: "/special", label: "Quiz" },
  ];

  // 로그아웃 처리 함수
  const handleLogout = () => {
    // 현재 브라우저의 세션 스토리지 데이터를 모두 삭제
    // 세션 스토리지: 페이지를 닫거나 새로고침하면 사라지는 임시 저장소
    sessionStorage.clear();
    navigate("/login"); // 로그인 페이지로 리다이렉트
    window.location.reload();
  };

  return (
    <div className="fixed top-0 left-0 h-full w-64 bg-gray-100 shadow-md flex flex-col p-4">
      <nav>
        <ul className="space-y-4">
          {/* routes 배열을 순회하며 각 경로와 이름을 기반으로 링크 생성 */}
          {routes.map((route) => (
            <li key={route.path} className="list-none">
              <Link
                to={route.path}
                className={`flex items-center p-2 rounded ${
                  location.pathname === route.path
                    ? // 현재 경로와 같으면
                      "bg-blue-200"
                    : // 다르면
                      "text-gray-700 hover:bg-gray-200"
                } no-underline`}
              >
                {/* 경로 이름 표시 */}
                <span className="ml-2">{route.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      {/* 로그아웃 버튼 추가 */}
      <button
        // 클릭 시 세션 스토리지 클리어, 로그인 페이지로 리다이렉션
        onClick={handleLogout}
        className="mt-auto flex items-center p-2 rounded text-gray-700 hover:bg-gray-200 no-underline"
      >
        <span className="ml-2">Logout</span>
      </button>
    </div>
  );
}
