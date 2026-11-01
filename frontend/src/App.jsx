import { lazy, Suspense, useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Events from "./pages/Events";
import Registration from "./pages/Registration";
import Login from "./pages/Login";
const Gallery = lazy(() => import("./pages/Gallery"));
import {api} from "./api";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import { useTheme } from "./context/ThemeContext";

function App() {
  const { theme } = useTheme();
  const [token, setToken] = useState(null);
  useEffect(() => {
    localStorage.removeItem('token');
    api('/auth/me').then(res => res.ok ? res.json() : null).then(data => setToken(data?.user || null)).catch(() => setToken(null));
  }, []);

  return (
    <div className={theme}>
      <Navbar token={token} setToken={setToken} />
      <Suspense fallback={<p className="page">Loading...</p>}><Routes>
        <Route path="/" element={<Home />} />
        <Route path="/events" element={<Events token={token} />} />
        <Route path="/register" element={<Registration />} />
        <Route path="/login" element={<Login setToken={setToken} />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="*" element={<NotFound />} />
      </Routes></Suspense>
    </div>
  );
}

export default App;