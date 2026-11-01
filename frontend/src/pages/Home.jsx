import {Link} from 'react-router-dom';

export default function Home() {
  return (
    <main className="page home-page">
      <section className="welcome">
        <h1>Welcome to TechFest 2026</h1>
        <p className="tagline">Inspire · Innovate · Integrate</p>
        <p>Join students and tech enthusiasts for competitions, workshops and cultural events.</p>
        <Link className="home-cta" to="/events">Explore events</Link>
      </section>
      <section>
        <h2>Event highlights</h2>
        <ul className="highlights">
          <li>Coding Contest</li>
          <li>Web Dev Workshop</li>
          <li>Cultural Night</li>
        </ul>
      </section>
    </main>
  );
}
