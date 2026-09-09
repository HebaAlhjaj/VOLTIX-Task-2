import {
  FiGithub,
  FiInstagram,
  FiLinkedin,
  FiTwitter,
} from "react-icons/fi";

function Footer() {
  return (
    <footer className="footer">
      <div className="section-container">
        <div className="footer-main">
          <div className="footer-brand">
            <a href="#home" className="logo">
              NOVA<span>TECH</span>
            </a>

            <p>
              Building digital experiences
              that move businesses forward.
            </p>
          </div>

          <div className="footer-links">
            <div>
              <h4>Company</h4>
              <a href="#about">About</a>
              <a href="#services">Services</a>
              <a href="#projects">Projects</a>
            </div>

            <div>
              <h4>Connect</h4>
              <a href="#contact">Contact</a>
              <a href="#contact">Start a Project</a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>
            © {new Date().getFullYear()} NOVATECH. All rights reserved.
          </p>

          <div className="social-links">
            <a href="#footer" aria-label="GitHub">
              <FiGithub />
            </a>

            <a href="#footer" aria-label="LinkedIn">
              <FiLinkedin />
            </a>

            <a href="#footer" aria-label="Instagram">
              <FiInstagram />
            </a>

            <a href="#footer" aria-label="Twitter">
              <FiTwitter />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;