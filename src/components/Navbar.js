import { Link, useLocation } from "react-router-dom";

const Navbar = ({ account }) => {
  const location = useLocation();

  const links = [
    { label: "Home", path: "/" },
    { label: "Admin", path: "/admin" },
    { label: "Regulator", path: "/regulator" },
    { label: "Report", path: "/report" },
  ];

  return (
    <nav className="bg-white shadow sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-green-700 flex items-center gap-2">
         Shikkha <i className="fas fa-link text-green-600"></i><span className="italic">Chain</span>
        </Link>

        <div className="flex items-center gap-4">
          {links.map(({ label, path }) => (
            <Link
              key={path}
              to={path}
              className={`text-sm font-medium px-3 py-1 rounded transition 
                ${location.pathname === path
                  ? "bg-green-600 text-white"
                  : "text-gray-700 hover:text-green-700 hover:bg-green-100"
                }`}
            >
              {label}
            </Link>
          ))}

          {account && (
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <i className="fas fa-wallet text-green-600"></i>
              {account.slice(0, 6)}...{account.slice(-4)}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
