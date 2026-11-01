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
      <section>
        <h2>Something for everyone</h2>
        <div className="home-details">
          <article><h3>Compete</h3><p>Put your coding skills to the test and tackle new challenges.</p></article>
          <article><h3>Learn</h3><p>Build something new in a hands-on web development workshop.</p></article>
          <article><h3>Connect</h3><p>Meet fellow students and enjoy the cultural celebrations.</p></article>
        </div>
      </section>
      <section>
        <h2>How to join</h2>
        <ol className="join-steps">
          <li><Link to="/register">Create an account</Link> and log in.</li>
          <li>Explore events, fees and available seats.</li>
          <li>Choose your event and register your place.</li>
        </ol>
      </section>
      <section className="home-venue">
        <div><h2>See you on campus</h2><p>MBCET Campus, Thiruvananthapuram.</p></div>
        <Link to="/contact">Contact the team →</Link>
      </section>
    </main>
  );
}
