import { Link, useLocation, useNavigate } from "react-router-dom";

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();

  const routes = [
    { path: "/member", label: "Member" },
    { path: "/japan", label: "Japan" },
    { path: "/board", label: "Board" },
    { path: "/special", label: "Special" },
  ];

  // 로그아웃 처리 함수
  const handleLogout = () => {
    sessionStorage.clear(); // 세션 스토리지 지우기
    navigate("/login"); // 로그인 페이지로 리다이렉트
    window.location.reload();
  };

  return (
    <div className="fixed top-0 left-0 h-full w-64 bg-gray-100 shadow-md flex flex-col p-4">
      <nav>
        <ul className="space-y-4">
          {routes.map((route) => (
            <li key={route.path} className="list-none">
              <Link
                to={route.path}
                className={`flex items-center p-2 rounded ${
                  location.pathname === route.path
                    ? "bg-blue-200"
                    : "text-gray-700 hover:bg-gray-200"
                } no-underline`}
              >
                <span className="ml-2">{route.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      {/* 로그아웃 버튼 추가 */}
      <button
        onClick={handleLogout}
        className="mt-auto flex items-center p-2 rounded text-gray-700 hover:bg-gray-200 no-underline"
      >
        <span className="ml-2">Logout</span>
      </button>
    </div>
  );
}
