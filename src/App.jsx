import { useState, useEffect, useRef } from 'react'
import { Analytics } from '@vercel/analytics/react'
import './App.css'

/* ===== SVG Icons ===== */
const Icons = {
  shield: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    </svg>
  ),
  target: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>
    </svg>
  ),
  layers: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/>
    </svg>
  ),
  globe: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
    </svg>
  ),
  search: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
    </svg>
  ),
  check: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
    </svg>
  ),
  truck: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>
    </svg>
  ),
  arrowRight: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
    </svg>
  ),
  linkedin: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
    </svg>
  ),
  mail: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
    </svg>
  ),
  mapPin: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
    </svg>
  ),
  web: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
    </svg>
  ),
}

/* ===== Intersection Observer Hook ===== */
function useInView(options = {}) {
  const ref = useRef(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true)
        observer.unobserve(entry.target)
      }
    }, { threshold: 0.15, ...options })

    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return [ref, isVisible]
}

/* ===== Animated Counter ===== */
function AnimatedNumber({ target, suffix = '', duration = 2000 }) {
  const [count, setCount] = useState(0)
  const [ref, isVisible] = useInView()

  useEffect(() => {
    if (!isVisible) return
    let start = 0
    const end = parseInt(target)
    const increment = end / (duration / 16)
    const timer = setInterval(() => {
      start += increment
      if (start >= end) {
        setCount(end)
        clearInterval(timer)
      } else {
        setCount(Math.ceil(start))
      }
    }, 16)
    return () => clearInterval(timer)
  }, [isVisible, target, duration])

  return <span ref={ref}>{count}{suffix}</span>
}

/* ===== NAVBAR ===== */
function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`} id="navbar">
      <div className="container">
        <a href="#" className="navbar-logo">
          <div className="navbar-logo-icon">K</div>
          <div className="navbar-logo-text">KITKO <span>GROUP</span></div>
        </a>
        <div className={`navbar-links ${menuOpen ? 'open' : ''}`} id="nav-links">
          <a href="#about" onClick={() => setMenuOpen(false)}>About</a>
          <a href="#services" onClick={() => setMenuOpen(false)}>Services</a>
          <a href="#presence" onClick={() => setMenuOpen(false)}>Presence</a>
          <a href="#sectors" onClick={() => setMenuOpen(false)}>Sectors</a>
          <a href="#contact" className="navbar-cta" onClick={() => setMenuOpen(false)}>Get in Touch</a>
        </div>
        <button className="navbar-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu" id="nav-toggle">
          <span></span><span></span><span></span>
        </button>
      </div>
    </nav>
  )
}

/* ===== HERO ===== */
function Hero() {
  return (
    <section className="hero" id="hero">
      <div className="hero-bg">
        <img src="/hero-bg.png" alt="Industrial mining operations" />
      </div>
      <div className="hero-grid-overlay"></div>
      <div className="hero-float-accent"></div>
      <div className="container">
        <div className="hero-content">
          <div className="hero-badge">
            <span className="hero-badge-dot"></span>
            Strategic Sourcing · Technical Auditing · India-China Corridor
          </div>
          <h1>
            Bridging <span className="accent">Engineering</span> Precision with Commercial Viability
          </h1>
          <p className="hero-description">
            KITKO GROUP is a premier technocrat-led value-add trading house of Indian origin,
            headquartered in Ordos, China. We specialize in the strategic procurement and distribution
            of critical components and raw materials for the Mining, Metal, and Energy sectors.
          </p>
          <div className="hero-actions">
            <a href="#contact" className="btn-primary" id="hero-cta-primary">
              Partner With Us {Icons.arrowRight}
            </a>
            <a href="#about" className="btn-secondary" id="hero-cta-secondary">
              Explore Our Edge
            </a>
          </div>
          <div className="hero-stats">
            <div className="hero-stat">
              <div className="hero-stat-number"><AnimatedNumber target={15} suffix="+" /></div>
              <div className="hero-stat-label">Years of Expertise</div>
            </div>
            <div className="hero-stat">
              <div className="hero-stat-number"><AnimatedNumber target={4} /></div>
              <div className="hero-stat-label">Point Technical Audit</div>
            </div>
            <div className="hero-stat">
              <div className="hero-stat-number"><AnimatedNumber target={2} /></div>
              <div className="hero-stat-label">Countries, One Corridor</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ===== ABOUT ===== */
function About() {
  const [ref, isVisible] = useInView()

  return (
    <section className="about" id="about" ref={ref}>
      <div className="container">
        <div className="about-grid">
          <div className="about-image-wrapper">
            <img src="/materials.png" alt="Industrial raw materials and precision components" />
            <div className="about-image-badge">
              <div className="about-image-badge-number">15+</div>
              <div className="about-image-badge-text">Years Field Expertise</div>
            </div>
          </div>
          <div className={`about-text fade-in ${isVisible ? 'visible' : ''}`}>
            <div className="section-label">The Technocrat Advantage</div>
            <h2 className="section-title">Rooted in Technical Integrity</h2>
            <p>
              Unlike traditional brokers, our operations are rooted in <strong>Technical Integrity</strong>.
              We operate under a "Technical-First" mandate, ensuring that every commodity or spare part in our
              portfolio survives a rigorous 4-point technical audit before reaching our partners.
            </p>
            <div className="about-features">
              <div className="about-feature">
                <div className="about-feature-icon">{Icons.target}</div>
                <div>
                  <h4>Engineering Alignment</h4>
                  <p>We translate complex industrial requirements into precise manufacturer strengths.</p>
                </div>
              </div>
              <div className="about-feature">
                <div className="about-feature-icon">{Icons.shield}</div>
                <div>
                  <h4>Risk Mitigation</h4>
                  <p>Our leadership's deep-rooted field insights prevent technical mismatches and operational downtime.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ===== SERVICES ===== */
const services = [
  {
    icon: Icons.search,
    title: 'Strategic Sourcing',
    description: 'End-to-end procurement of critical industrial components from Tier-1 verified manufacturers across the India-China corridor.',
    num: '01',
  },
  {
    icon: Icons.check,
    title: 'Technical Auditing',
    description: 'Rigorous 4-point quality verification ensuring every commodity meets exact engineering specifications before delivery.',
    num: '02',
  },
  {
    icon: Icons.truck,
    title: 'Supply Chain Solutions',
    description: 'Comprehensive logistics management handling FDI regulations, trade policies, and cross-border compliance as a single-window solution.',
    num: '03',
  },
  {
    icon: Icons.layers,
    title: 'Material Advisory',
    description: 'Expert consultation on material behavior, grade optimization, and techno-commercial compatibility for maximum ROI.',
    num: '04',
  },
  {
    icon: Icons.globe,
    title: 'Cross-Border Trade',
    description: 'Seamless India-China trade facilitation with on-ground presence ensuring quality verification and compliance.',
    num: '05',
  },
  {
    icon: Icons.shield,
    title: 'Quality Assurance',
    description: 'Direct, audited relationships with manufacturers providing end-to-end quality control and operational stability.',
    num: '06',
  },
]

function Services() {
  const [ref, isVisible] = useInView()

  return (
    <section className="services" id="services" ref={ref}>
      <div className="container">
        <div className={`services-header fade-in ${isVisible ? 'visible' : ''}`}>
          <div className="section-label" style={{ justifyContent: 'center' }}>What We Do</div>
          <h2 className="section-title">Our Core Capabilities</h2>
          <p className="section-subtitle">
            From strategic sourcing to cross-border compliance, we deliver a comprehensive suite
            of services built on technical expertise and market intelligence.
          </p>
        </div>
        <div className="services-grid">
          {services.map((s, i) => (
            <div
              className={`service-card fade-in fade-in-delay-${(i % 3) + 1} ${isVisible ? 'visible' : ''}`}
              key={i}
              id={`service-card-${i}`}
            >
              <div className="service-number">{s.num}</div>
              <div className="service-icon">{s.icon}</div>
              <h3>{s.title}</h3>
              <p>{s.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ===== PRESENCE ===== */
function Presence() {
  const [ref, isVisible] = useInView()

  return (
    <section className="presence" id="presence" ref={ref}>
      <div className="container">
        <div className={`fade-in ${isVisible ? 'visible' : ''}`}>
          <div className="section-label">Strategic Presence</div>
          <h2 className="section-title">The India-China Corridor</h2>
          <p className="section-subtitle">
            Operating at the epicenter of global commodity demand. Our dual-presence
            allows us to provide unmatched market intelligence and supply chain security.
          </p>
        </div>
        <div className="presence-grid">
          <div className={`presence-card fade-in fade-in-delay-1 ${isVisible ? 'visible' : ''}`} id="presence-china">
            <div className="presence-card-flag">🇨🇳</div>
            <h3>China Operations</h3>
            <div className="presence-card-subtitle">Ordos, Inner Mongolia · HQ</div>
            <p>
              We maintain direct, audited relationships with Tier-1 manufacturers. Our headquarters
              in Ordos ensures Quality Verification, Cross-Border Compliance, and on-ground
              oversight for Indian firms requiring specialized intermediate goods.
            </p>
            <div className="presence-card-tag">
              📍 Headquarters
            </div>
          </div>
          <div className={`presence-card fade-in fade-in-delay-2 ${isVisible ? 'visible' : ''}`} id="presence-india">
            <div className="presence-card-flag">🇮🇳</div>
            <h3>India Operations</h3>
            <div className="presence-card-subtitle">Raipur, Chhattisgarh · Regional Office</div>
            <p>
              Leveraging the 2026 National Critical Mineral Mission, we support the rapid
              operationalization of domestic mineral blocks through local technical advisory
              and parts distribution.
            </p>
            <div className="presence-card-tag">
              🏢 Regional Office
            </div>
          </div>
        </div>
        <div className={`presence-image fade-in ${isVisible ? 'visible' : ''}`}>
          <img src="/operations.png" alt="Global trade operations and logistics" />
        </div>
      </div>
    </section>
  )
}

/* ===== VALUES ===== */
const values = [
  {
    icon: '⚖️',
    title: 'Techno-Commercial Compatibility',
    description: 'We ensure the commercial price is always justified by the technical grade, maximizing ROI for our partners.',
  },
  {
    icon: '🔧',
    title: 'Operational Stability',
    description: 'We act as an extension of our clients\' technical teams, offering advisory on material behavior and grade optimization.',
  },
  {
    icon: '🔗',
    title: 'Supply Chain Resilience',
    description: 'We manage the complexities of FDI regulations, trade policies, and logistics — providing a single-window solution.',
  },
]

function Values() {
  const [ref, isVisible] = useInView()

  return (
    <section className="values" id="values" ref={ref}>
      <div className="container">
        <div className={`values-header fade-in ${isVisible ? 'visible' : ''}`}>
          <div className="section-label" style={{ justifyContent: 'center' }}>Our Philosophy</div>
          <h2 className="section-title">The Value-Add Approach</h2>
          <p className="section-subtitle">
            Every engagement is guided by our commitment to delivering measurable value
            beyond the transaction.
          </p>
        </div>
        <div className="values-grid">
          {values.map((v, i) => (
            <div
              className={`value-card fade-in fade-in-delay-${i + 1} ${isVisible ? 'visible' : ''}`}
              key={i}
              id={`value-card-${i}`}
            >
              <div className="value-icon">{v.icon}</div>
              <h3>{v.title}</h3>
              <p>{v.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ===== SECTORS ===== */
function Sectors() {
  const [ref, isVisible] = useInView()

  return (
    <section className="sectors" id="sectors" ref={ref}>
      <div className="container">
        <div className={`sectors-header fade-in ${isVisible ? 'visible' : ''}`}>
          <div className="section-label" style={{ justifyContent: 'center' }}>Focus Sectors</div>
          <h2 className="section-title">Industries We Serve</h2>
          <p className="section-subtitle">
            Deep domain expertise across three critical industrial verticals driving
            India's infrastructure and manufacturing growth.
          </p>
        </div>
        <div className="sectors-row">
          <div className={`sector-card fade-in fade-in-delay-1 ${isVisible ? 'visible' : ''}`} id="sector-mining">
            <span className="sector-icon">⛏️</span>
            <h3>Mining</h3>
            <p>Critical components and raw materials for mining operations. From exploration equipment to processing plant spares.</p>
          </div>
          <div className={`sector-card fade-in fade-in-delay-2 ${isVisible ? 'visible' : ''}`} id="sector-metal">
            <span className="sector-icon">🔩</span>
            <h3>Metal</h3>
            <p>Precision-grade metals, alloys, and specialized intermediate goods for metal processing and manufacturing facilities.</p>
          </div>
          <div className={`sector-card fade-in fade-in-delay-3 ${isVisible ? 'visible' : ''}`} id="sector-energy">
            <span className="sector-icon">⚡</span>
            <h3>Energy</h3>
            <p>Essential components and materials powering India's energy infrastructure — from thermal to renewable sectors.</p>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ===== CTA ===== */
function CTA() {
  const [ref, isVisible] = useInView()

  return (
    <section className="cta" id="contact" ref={ref}>
      <div className="container">
        <div className={`cta-wrapper fade-in ${isVisible ? 'visible' : ''}`}>
          <h2>Ready to Optimize Your Supply Chain?</h2>
          <p>
            Partner with KITKO GROUP for technically audited sourcing,
            cross-border compliance, and unmatched industry expertise.
          </p>
          <div className="cta-buttons">
            <a href="mailto:info@kitcoindia.com" className="btn-primary" id="cta-email">
              {Icons.mail} Get in Touch
            </a>
            <a href="https://www.kitcoindia.com" target="_blank" rel="noopener noreferrer" className="btn-secondary" id="cta-website">
              {Icons.web} Visit kitcoindia.com
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ===== FOOTER ===== */
function Footer() {
  return (
    <footer className="footer" id="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <a href="#" className="navbar-logo">
              <div className="navbar-logo-icon">K</div>
              <div className="navbar-logo-text">KITKO <span>GROUP</span></div>
            </a>
            <p>
              A premier technocrat-led value-add trading house bridging engineering
              precision with commercial viability across the India-China industrial corridor.
            </p>
          </div>
          <div className="footer-column">
            <h4>Company</h4>
            <a href="#about">About Us</a>
            <a href="#services">Services</a>
            <a href="#presence">Global Presence</a>
            <a href="#sectors">Sectors</a>
          </div>
          <div className="footer-column">
            <h4>Services</h4>
            <a href="#services">Strategic Sourcing</a>
            <a href="#services">Technical Auditing</a>
            <a href="#services">Supply Chain</a>
            <a href="#services">Material Advisory</a>
          </div>
          <div className="footer-column">
            <h4>Contact</h4>
            <a href="#">HQ: Ordos, Inner Mongolia, China</a>
            <a href="#">Office: Raipur, Chhattisgarh, India</a>
            <a href="https://www.kitcoindia.com" target="_blank" rel="noopener noreferrer">kitcoindia.com</a>
            <a href="https://www.kitcoindia.in" target="_blank" rel="noopener noreferrer">kitcoindia.in</a>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} KITKO GROUP. All rights reserved.</span>
          <div className="footer-social">
            <a href="https://www.linkedin.com/company/kitcogroup" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" id="social-linkedin">
              {Icons.linkedin}
            </a>
            <a href="mailto:info@kitcoindia.com" aria-label="Email" id="social-email">
              {Icons.mail}
            </a>
            <a href="https://www.kitcoindia.com" target="_blank" rel="noopener noreferrer" aria-label="Website" id="social-website">
              {Icons.web}
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

/* ===== APP ===== */
function App() {
  return (
    <>
      <Analytics />
      <Navbar />
      <Hero />
      <About />
      <Services />
      <Presence />
      <Values />
      <Sectors />
      <CTA />
      <Footer />
    </>
  )
}

export default App
