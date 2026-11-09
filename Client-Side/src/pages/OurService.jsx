import "../assets/OurService.css";

function OurService() {
  const services = [
    {
      title: "Digital Government",
      description:
        "Providing efficient, transparent, and citizen-centered digital government services.",
      icon: "🏛️",
    },
    {
      title: "Digital ID",
      description:
        "Secure digital identity solutions for citizens and government institutions.",
      icon: "🪪",
    },
    {
      title: "Smart City Solutions",
      description:
        "Developing innovative technologies to improve transportation, infrastructure, and urban living.",
      icon: "🏙️",
    },
    {
      title: "Cybersecurity",
      description:
        "Protecting government systems and citizen data with advanced cybersecurity practices.",
      icon: "🔒",
    },
    {
      title: "Research & Innovation",
      description:
        "Supporting scientific research, innovation, and technology-driven development.",
      icon: "🔬",
    },
    {
      title: "ICT Infrastructure",
      description:
        "Building reliable digital infrastructure and networking solutions for public institutions.",
      icon: "💻",
    },
    {
      title: "Digital Library",
      description:
        "Providing access to digital knowledge resources for education and research.",
      icon: "📚",
    },
    {
      title: "Technical Support",
      description:
        "Offering technical assistance, training, and maintenance for digital systems.",
      icon: "🛠️",
    },
  ];

  return (
    <section className="services">
      <div className="container">
        <div className="services-header">
          <h1>Our Services</h1>
          <p>
            Shaggar City Science and Technology delivers innovative digital
            solutions that improve public services, strengthen technology
            infrastructure, and support smart city development.
          </p>
        </div>

        <div className="services-grid">
          {services.map((service, index) => (
            <div className="service-card" key={index}>
              <div className="service-icon">{service.icon}</div>
              <h3>{service.title}</h3>
              <p>{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default OurService;