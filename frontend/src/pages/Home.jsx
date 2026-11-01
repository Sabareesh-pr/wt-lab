import { useState, useEffect } from "react";

const announcements = [
  "Registrations for Coding Contest close on 15th September",
  "Robotics Challenge venue shifted to Auditorium Block B",
  "Cultural Night line-up announced — check the Gallery page"
];

function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Simulating an API call with setTimeout so Loading state is still visible
    const timer = setTimeout(() => {
      setPosts(announcements);
      setLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="page">
      <h1>Welcome to TechFest 2026</h1>
      <p>Three days of hackathons, workshops and competitions.</p>

      <h2>Announcements</h2>
      {loading && <p>Loading...</p>}
      {error && <p className="error-msg">{error}</p>}
      {!loading && !error && (
        <ul>
          {posts.map((text, index) => (
            <li key={index}>{text}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Home;