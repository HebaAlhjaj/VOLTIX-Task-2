import { motion } from "framer-motion";
import { FiArrowUpRight } from "react-icons/fi";

function CTA() {
  return (
    <section className="cta-section" id="contact">
      <div className="cta-grid"></div>
      <div className="cta-glow"></div>

      <div className="section-container">
        <motion.div
          className="cta-content"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8 }}
        >
          <p className="section-label">LET'S BUILD SOMETHING</p>

          <h2>
            Have an idea?
            <span> Let's make it real.</span>
          </h2>

          <p>
            Tell us what you're building. We'll help you turn your idea
            into a digital experience people love.
          </p>

          <motion.a
            href="#contact-form"
            className="cta-button"
            whileHover={{
              scale: 1.04,
              boxShadow: "0 0 40px rgba(0, 229, 255, 0.3)",
            }}
            whileTap={{ scale: 0.97 }}
          >
            Start a Conversation
            <FiArrowUpRight />
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}

export default CTA;