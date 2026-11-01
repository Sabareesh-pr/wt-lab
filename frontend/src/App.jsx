import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Events from "./pages/Events";
import Registration from "./pages/Registration";
import Login from "./pages/Login";
import Gallery from "./pages/Gallery";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import { useTheme } from "./context/ThemeContext";

function App() {
  const { theme } = useTheme();
  const [token, setToken] = useState(localStorage.getItem("token") || null);

  // Keep token in sync if it's set elsewhere
  useEffect(() => {
    if (token) localStorage.setItem("token", token);
  }, [token]);

  return (
    <div className={theme}>
      <Navbar token={token} setToken={setToken} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/events" element={<Events token={token} />} />
        <Route path="/register" element={<Registration />} />
        <Route path="/login" element={<Login setToken={setToken} />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;