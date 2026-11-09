import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import sheggerLogo from '../assets/images/sheggerLogo.jpg';
import security from '../assets/images/security.jpg';
import smartcity from '../assets/images/smartcity.jpg';
import digitalGovernment from '../assets/images/digital-government.jpg';
import digitalHousing from '../assets/images/digital-housing.jpg';
import digitalID from '../assets/images/Digital-ID.jpg';
import digitalLibrary from '../assets/images/digital-library.jpg';
import eCourt from '../assets/images/E-court.jpg';
import eLand from '../assets/images/E-land.jpg';
import eLearning from '../assets/images/E-learning.jpg';
import fleetManagement from '../assets/images/Fllet-management.jpg';
import medicalRecord from '../assets/images/medical-record.jpg';
import queueManagement from '../assets/images/queueMGS.jpg';
import idms from '../assets/images/IDMS.jpg';
import '../assets/homepages.css';

const services = [
  {
    image: digitalGovernment,
    title: "Digital Government",
    description:
      "Access government services online including permits, taxes, and public administration.",
  },
  {
    image: digitalHousing,
    title: "Digital Housing",
    description:
      "Manage housing applications, property registration, and housing services digitally.",
  },
  {
    image: digitalID,
    title: "Digital ID",
    description:
      "Secure digital identity for authentication and accessing city services.",
  },
  {
    image: digitalLibrary,
    title: "Digital Library",
    description:
      "Read books, journals, and educational resources online.",
      // link: "http://196.189.124.193/"
  },
  {
    image: fleetManagement,
    title: "Fleet Management",
    description:
      "Track and manage vehicles efficiently.",
  },
  {
    image: eCourt,
    title: "E-Court",
    description:
      "File cases, schedule hearings, and access court services online.",
  },
  {
    image: eLand,
    title: "E-Land",
    description:
      "Land registration, ownership verification, and digital property management.",
  },
  {
    image: security,
    title: "Smart Security",
    description:
      "Surveillance and emergency response for smart cities.",
  },
  {
    image: eLearning,
    title: "E-Learning",
    description:
      "Online education platform for students and professionals.",
  },
  {
    image: medicalRecord,
    title: "Medical Records",
    description:
      "Secure electronic health records accessible by authorized hospitals.",
  },
  {
    image: queueManagement,
    title: "Queue Management",
    description:
      "Smart queue systems for faster service delivery and shorter wait times.",
  },
  {
    image: idms,
    title: "IDMS",
    description:
      "Integrated data management system for city operations and records.",
  },
];

function Homepage() {
  const [selectedService, setSelectedService] = useState(services[0]);
  const [isNavigationOpen, setIsNavigationOpen] = useState(false);

  const handleSelectService = (service) => {
    setSelectedService(service);
  };

  const closeNavigation = () => {
    setIsNavigationOpen(false);
  };

  return (
    <>
     <div className="homepage">
        <div className='navigation-bar'> 
            <div className='logo-container'>
                <img className='logo' src={sheggerLogo} alt="logo" />
                <h1 className='company-name'>Shaggar City Science  <br />  And Technology</h1>
            </div>
            <button
                className={`navigation-toggle ${isNavigationOpen ? 'open' : ''}`}
                type="button"
                aria-label={isNavigationOpen ? 'Close navigation menu' : 'Open navigation menu'}
                aria-expanded={isNavigationOpen}
                aria-controls="homepage-navigation"
                onClick={() => setIsNavigationOpen((isOpen) => !isOpen)}
            >
                <span />
                <span />
                <span />
            </button>
            <nav
                id="homepage-navigation"
                className={`navigation-links ${isNavigationOpen ? 'open' : ''}`}
                aria-label="Main navigation"
            >
                <ul>
                 <li><Link to="/" onClick={closeNavigation}>Home</Link></li>
                 <li><Link to="/about" onClick={closeNavigation}>About</Link></li>
                 <li><Link to="/services" onClick={closeNavigation}>Services</Link></li>
                 <li><Link to="/events" onClick={closeNavigation}>Events And News</Link></li>
                  {/* <li><Link to="/documents">Documents</Link></li> */}
                  <li><Link to="/citizen/login" onClick={closeNavigation}>Contact Us As A Citizen</Link></li>
                 {/* <li><Link>Contact</Link></li> */}
                </ul>
            </nav>
        </div>
    </div>

   <div className="hero">
  {/* First Image */}
  <div className="hero-slide slide1">
    <img src={smartcity} alt="Smart City" className="hero-image" />

    <div className="hero-overlay"></div>

    <div className="hero-content">
      <h1 className="hero-title">
        We Are Building Shaggar,<br />
        The Smart City of The Future
      </h1>
    </div>
  </div>

  {/* Second Image */}
  <div className="hero-slide slide2">
    <img src={security} alt="Secure City" className="hero-image" />

    <div className="hero-overlay"></div>

    <div className="hero-content">
      <h1 className="hero-title">
        Make Shaggar City Into <br /> 
        Save And Secure City
      </h1>
    </div>
  </div>
</div>

<div className="services-section">
  <div className="services-container">
    <h1>See what we provide for people before</h1>
    <div className="service-grid">
      
      {services.map((service) => (
        
        <button
          type="button"
          key={service.title}
          className={`service-card ${selectedService.title === service.title ? 'active' : ''}`}
          onMouseEnter={() => handleSelectService(service)}
          onClick={() => handleSelectService(service)}
        >   
           
          <img src={service.image} alt={service.title }  />
          <div className="service-card-body">
            <h3>{service.title}</h3>
            <p className="service-description">{service.description}</p>
          </div>
        </button>
      ))}
    </div>
    {/* <div className="service-info">
      <h2>{selectedService.title}</h2>
      <p>{selectedService.description}</p>
    </div> */}
  </div>
</div>
<section className="about-company">

  {/* Our Plan */}
  <div className="about-card">
    <h2>Our Plan</h2>
    <p>
      Shaggar Science and Technology is committed to building a modern,
      digital-first city by introducing smart technologies that improve
      public services, transportation, education, healthcare, land
      management, and governance. Our goal is to create an efficient,
      transparent, and connected city for every resident.
    </p>
  </div>

  {/* Our Goals */}
  <div className="about-card">
    <h2>Our Goals</h2>

    <ul>
      <li>Digitize government services for faster access.</li>
      <li>Provide secure Digital ID for every citizen.</li>
      <li>Improve healthcare through electronic medical records.</li>
      <li>Develop smart transportation and fleet management systems.</li>
      <li>Create a safe city using smart security technologies.</li>
      <li>Promote digital education through e-learning platforms.</li>
      <li>Increase transparency with digital land and court services.</li>
    </ul>
  </div>

  {/* Our Vision */}
  <div className="about-card">
    <h2>Our Vision</h2>

    <p>
      To become Ethiopia's leading Smart City by delivering innovative,
      secure, and sustainable digital solutions that improve the quality
      of life for citizens while supporting economic growth and good
      governance.
    </p>
  </div>
</section>
<section className="why-us">
  <div className="section-title">
    <h2>Why Shaggar Science & Technology?</h2>
    <p>
      We are committed to transforming Shaggar City into a modern, secure,
      and digitally connected smart city through innovative technology
      solutions that improve the quality of life for all citizens.
    </p>
  </div>

  <div className="why-grid">
    <div className="why-card">
      <h3>🏛 Smart Governance</h3>
      <p>
        Digital government services that improve transparency,
        accountability, and public service delivery.
      </p>
    </div>

    <div className="why-card">
      <h3>🆔 Digital Identity</h3>
      <p>
        Secure digital identification for citizens to access government
        services safely and efficiently.
      </p>
    </div>

    <div className="why-card">
      <h3>💻 E-Government</h3>
      <p>
        Online government platforms that reduce paperwork and provide
        services anytime, anywhere.
      </p>
    </div>

    <div className="why-card">
      <h3>🏥 Smart Healthcare</h3>
      <p>
        Electronic medical records and digital healthcare services for
        faster and better patient care.
      </p>
    </div>

    <div className="why-card">
      <h3>🎓 Smart Education</h3>
      <p>
        Digital learning platforms that support students, teachers, and
        lifelong learning opportunities.
      </p>
    </div>

    <div className="why-card">
      <h3>🛡 Secure City</h3>
      <p>
        Smart surveillance, emergency response systems, and public safety
        technologies for a safer city.
      </p>
    </div>
  </div>
  
</section>
 <footer className="footer">
      <div className="footer-container">

        {/* Company Info */}
        <div className="footer-section">
          <h2>Shaggar Science & Technology</h2>
          <p>
            Building a smart and secure digital future for the city through
            innovation and technology.
          </p>
        </div>

        {/* Quick Links */}
        <div className="footer-section">
          <h3>Quick Links</h3>
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/about">About</a></li>
            <li><a href="/services">Services</a></li>
            <li><a href="/events">Events And News</a></li>
            <li><a href="">Contact</a></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div className="footer-section">
          <h3>Contact</h3>
          <p>Email: info@shaggar.com</p>
          <p>Phone: +251 9xx xxx xxx</p>
          <p>Location:Bole Imperial, Gadisa building 6th floor<br></br> Addis Ababa, Ethiopia</p>
          <ul>
            <li><a href="https://www.facebook.com/shaggar" target="_blank" rel="noopener noreferrer">Facebook</a></li>
            <li><a href="https://linkedin.com/shaggar" target="_blank" rel="noopener noreferrer">LinkedIn</a></li>
            {/* <li><a href="https://www.instagram.com/shaggar" target="_blank" rel="noopener noreferrer">Instagram</a></li> */}
          </ul>
        </div>

      </div>

      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} Shaggar Science & Technology. All rights reserved.</p>
      </div>
    </footer>

</>
   
  );
}

export default Homepage;