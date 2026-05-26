export default function Overlay() {
  return (
    <div className="overlay">
      <nav className="nav">
        <div className="logo">NOVA</div>
        <ul className="nav-links">
          <li><a href="#features">Features</a></li>
          <li><a href="#about">About</a></li>
          <li><a href="#contact">Contact</a></li>
        </ul>
      </nav>

      <div className="hero-text">
        <h1>Build in 3D</h1>
        <p>
          Create stunning interactive 3D experiences for the web.
          Powered by Three.js and React Three Fiber.
        </p>
        <button className="cta">Get Started</button>
      </div>

      <div className="features">
        <div className="feature">
          <div className="number">60fps</div>
          <div className="label">Performance</div>
        </div>
        <div className="feature">
          <div className="number">3D</div>
          <div className="label">Interactive</div>
        </div>
        <div className="feature">
          <div className="number">WebGL</div>
          <div className="label">Technology</div>
        </div>
      </div>

      <div className="bottom-text">Scroll to explore</div>
    </div>
  )
}
