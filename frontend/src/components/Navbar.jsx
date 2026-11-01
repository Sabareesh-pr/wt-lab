import { Link } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

function Navbar({ token, setToken }) {
  const { theme, toggleTheme } = useTheme();

  function handleLogout() {
    setToken(null);
    localStorage.removeItem("token");
  }

  return (
    <nav className="navbar">
      <h2>TechFest 2026</h2>
      <div className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/events">Events</Link>
        <Link to="/register">Register</Link>
        {!token && <Link to="/login">Login</Link>}
        <Link to="/gallery">Gallery</Link>
        <Link to="/contact">Contact</Link>
      </div>
      {token && <button onClick={handleLogout}>Logout</button>}
      <button onClick={toggleTheme}>
        {theme === "light" ? "Switch to Dark" : "Switch to Light"}
      </button>
    </nav>
  );
}

export default Navbar;