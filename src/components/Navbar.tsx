import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const location = useLocation();
  const routes = [
    { path: '/member', label: 'Member' },
    { path: '/login', label: 'Login' },
    { path: '/japan', label: 'Japan' },
    { path: '/board', label: 'Board' },
  ];

  return (
    <div className="fixed top-0 left-0 h-full w-64 bg-gray-100 shadow-md flex flex-col p-4">
      <nav>
        <ul className="space-y-4">
          {routes.map((route) => (
            <li key={route.path} className="list-none">
              <Link
                to={route.path}
                className={`flex items-center p-2 rounded ${
                  location.pathname === route.path ? 'bg-blue-200' : 'text-gray-700 hover:bg-gray-200'
                } no-underline`}
              >
                <span className="ml-2">{route.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
