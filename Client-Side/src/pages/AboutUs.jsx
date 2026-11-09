import "../assets/AboutUs.css";

function AboutUs() {
  return (
    <section className="about-page">
      <div className="container">

        <div className="about-header">
          <h1>About Shaggar City Science and Technology</h1>
          <p>
            Building a smarter, more connected, and innovative future through
            science, technology, and digital transformation.
          </p>
        </div>

        <div className="about-section">
          <h2>Who We Are</h2>
          <p>
            Shaggar City Science and Technology is responsible for leading the
            city's digital transformation initiatives. We design and implement
            modern technology solutions that improve government services,
            encourage innovation, strengthen digital infrastructure, and support
            sustainable urban development.
          </p>
        </div>

        {/* <div className="about-grid">
          <div className="card">
            <h3>Our Mission</h3>
            <p>
              To provide innovative digital solutions that improve public
              services, encourage research, and support the development of a
              smart city.
            </p>
          </div>

          <div className="card">
            <h3>Our Vision</h3>
            <p>
              To become a leading smart city powered by technology, innovation,
              and sustainable digital services.
            </p>
          </div>
        </div> */}

        <div className="about-section">
          <h2>What We Do</h2>

          <ul>
            <li>Develop smart city digital services.</li>
            <li>Support e-Government initiatives.</li>
            <li>Promote scientific research and innovation.</li>
            <li>Improve public service delivery using technology.</li>
            <li>Strengthen cybersecurity and digital infrastructure.</li>
            <li>collaboration with other technology institutes.</li>
          </ul>
        </div>

        <div className="about-section">
          <h2>Core Values</h2>

          <div className="values">
            <div>Innovation</div>
            <div>Transparency</div>
            <div>Integrity</div>
            <div>Collaboration</div>
            <div>Excellence</div>
            <div>Sustainability</div>
          </div>
        </div>

      </div>
    </section>
  );
}

export default AboutUs;