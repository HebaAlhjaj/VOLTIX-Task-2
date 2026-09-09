import { motion } from "framer-motion";
import {
  FiArrowRight,
  FiPlay,
  FiCode,
  FiLayers,
  FiZap,
} from "react-icons/fi";

function Hero() {
  return (
    <section className="hero" id="home">
      {/* Background Effects */}
      <div className="hero-grid"></div>
      <div className="hero-orb hero-orb-one"></div>
      <div className="hero-orb hero-orb-two"></div>

      <div className="hero-content">
        <motion.div
          className="hero-badge"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="status-dot"></span>
          WE BUILD THE FUTURE
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 45 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15 }}
        >
          Digital solutions
          <br />
          built for <span>growth.</span>
        </motion.h1>

        <motion.p
          className="hero-description"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
        >
          We transform ideas into modern digital products that help
          businesses innovate, connect with their customers, and grow.
        </motion.p>

        <motion.div
          className="hero-actions"
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.45 }}
        >
          <motion.a
            href="#contact"
            className="hero-primary"
            whileHover={{
              scale: 1.04,
              boxShadow: "0 0 35px rgba(0, 229, 255, 0.3)",
            }}
            whileTap={{ scale: 0.97 }}
          >
            Start a Project
            <FiArrowRight />
          </motion.a>

          <motion.a
            href="#projects"
            className="hero-secondary"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <FiPlay />
            View Our Work
          </motion.a>
        </motion.div>

        <motion.div
          className="hero-stats"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.7 }}
        >
          <div className="stat">
            <h3>50+</h3>
            <p>Projects Delivered</p>
          </div>

          <div className="stat">
            <h3>20+</h3>
            <p>Happy Clients</p>
          </div>

          <div className="stat">
            <h3>5+</h3>
            <p>Years Experience</p>
          </div>
        </motion.div>
      </div>

      {/* Tech Visual */}
      <motion.div
        className="hero-visual"
        initial={{ opacity: 0, scale: 0.8, x: 40 }}
        animate={{ opacity: 1, scale: 1, x: 0 }}
        transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
      >
        <motion.div
          className="tech-card"
          animate={{ y: [0, -12, 0] }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <div className="tech-card-header">
            <div className="window-dots">
              <span></span>
              <span></span>
              <span></span>
            </div>

            <span className="file-name">novatech.jsx</span>
          </div>

          <div className="code-content">
            <div>
              <span className="code-number">01</span>
              <span className="code-purple">const</span>{" "}
              <span className="code-cyan">future</span> = {"{"}
            </div>

            <div>
              <span className="code-number">02</span>
              &nbsp;&nbsp;<span className="code-purple">design</span>:{" "}
              <span className="code-green">"beautiful"</span>,
            </div>

            <div>
              <span className="code-number">03</span>
              &nbsp;&nbsp;<span className="code-purple">technology</span>:{" "}
              <span className="code-green">"smart"</span>,
            </div>

            <div>
              <span className="code-number">04</span>
              &nbsp;&nbsp;<span className="code-purple">growth</span>:{" "}
              <span className="code-green">true</span>,
            </div>

            <div>
              <span className="code-number">05</span>
              {"}"}
            </div>

            <div className="cursor-line">
              <span className="code-number">06</span>
              <span className="cursor"></span>
            </div>
          </div>

          <div className="tech-card-footer">
            <span>
              <FiCode /> React
            </span>

            <span>
              <FiLayers /> Design
            </span>

            <span>
              <FiZap /> Fast
            </span>
          </div>
        </motion.div>

        <motion.div
          className="floating-tech floating-one"
          animate={{ y: [0, -15, 0], rotate: [0, 3, 0] }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <FiCode />
          <div>
            <strong>Clean Code</strong>
            <small>Built to scale</small>
          </div>
        </motion.div>

        <motion.div
          className="floating-tech floating-two"
          animate={{ y: [0, 12, 0] }}
          transition={{
            duration: 4.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <strong>+28.4%</strong>
          <small>Growth</small>
        </motion.div>
      </motion.div>
    </section>
  );
}

export default Hero;