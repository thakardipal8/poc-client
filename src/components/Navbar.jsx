import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { contractorNavItems } from "../data/navigation/contractorNavItems";
import { adminNavItems } from "../data/navigation/adminNavItems";

const Navbar = ({ user, hamburgerControl }) => {
  const [activeNavItems, setActiveNavItems] = useState([]);

  useEffect(() => {
    // Sets navbar items based on user props passed from AppLayout.jsx

    if (user === "admin" || "superAdmin") {
      setActiveNavItems(adminNavItems);
    }

    if (user === "contractor") {
      setActiveNavItems(contractorNavItems);
    }
  }, [activeNavItems, user]);

  return (
    <nav className="nav-background">
      <ul>
        {activeNavItems.map((link) => (
          <li
            className="nav-list-item"
            key={link.id}
            onClick={hamburgerControl}
          >
            <Link to={link.path} className="nav-link">
              {link.item}
            </Link>
          </li>
        ))}
        {user === "superAdmin" ? (
          <li className="nav-list-item" onClick={hamburgerControl}>
            <Link to="/admin/Administrators" className="nav-link">
              Administrators
            </Link>
          </li>
        ) : (
          ""
        )}
        <li className="nav-list-item">
          <Link
            to="/"
            className="nav-link"
            onClick={() => localStorage.clear()}
          >
            Logout
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
