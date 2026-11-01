const announcements = ['Explore coding contests and workshops.', 'Create an account, log in and register for an event.'];
export default function Home() {return <main className="page"><h1>TechFest 2026</h1><p>Hackathons, workshops and competitions.</p><h2>Announcements</h2><ul>{announcements.map(text => <li key={text}>{text}</li>)}</ul></main>;}
