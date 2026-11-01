import {Link} from 'react-router-dom';

export default function Home() {
  return (
    <main className="page home-page">
      <div className="home-hero">
      <video className="home-video" autoPlay muted loop playsInline preload="metadata" aria-label="TechFest campus highlights"><source src="/media/hero.mp4" type="video/mp4" />Your browser does not support video playback.</video>
      <section className="home-banner" aria-labelledby="festival-tagline">
        <h1 id="festival-tagline">Inspire • Innovate • Integrate</h1>
        <p>Experience the excitement of TechFest 2026.</p>
      </section>
      </div>
      <section className="welcome">
        <h2>Welcome to TechFest 2026</h2>
        <p>Join students, innovators, and tech enthusiasts for exciting competitions, workshops, and networking opportunities.</p>
      </section>
      <section>
        <h2>Event Highlights</h2>
        <ul className="highlights">
          <li>Coding Contest</li>
          <li>Web Dev Workshop</li>
          <li>Cultural Night</li>
        </ul>
        <Link className="home-cta" to="/events">Explore events</Link>
      </section>
      <section className="home-announcements">
        <h2>Announcements</h2>
        <p>Discover the latest events and available seats.</p>
        <p><Link to="/register">Create an account</Link> to register for your favourite events.</p>
      </section>
    </main>
  );
}
