"use client";

export default function HomePage() {
  return (
    <main>
      <header>
        <h1>PortPro Dashboard</h1>
      </header>
      <nav aria-label="Main navigation">
        <ul>
          <li><a href="/">Home</a></li>
          <li><a href="/shipping-berthing">Shipping & Berthing</a></li>
          {/* Add more links as needed */}
        </ul>
      </nav>
      <section>
        <h2>Welcome</h2>
        <p>This is the PortPro frontend web app. All backend and styling frameworks have been removed for a clean, accessible base.</p>
      </section>
      <footer>
        <p>&copy; {new Date().getFullYear()} PortPro</p>
      </footer>
    </main>
  );
}
