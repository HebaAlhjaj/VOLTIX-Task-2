import { motion } from "framer-motion";
import { FiStar } from "react-icons/fi";

const testimonials = [
  {
    quote:
      "NOVATECH understood our vision from day one and turned it into a product our customers genuinely enjoy using.",
    name: "Sarah Mitchell",
    role: "Founder, Luma Store",
    initials: "SM",
  },
  {
    quote:
      "The team combines great design with solid technology. The final product was fast, intuitive, and exactly what we needed.",
    name: "Daniel Carter",
    role: "Product Manager, CareFlow",
    initials: "DC",
  },
  {
    quote:
      "Working with NOVATECH felt like having a real technology partner, not just an agency. They delivered beyond expectations.",
    name: "Maya Thompson",
    role: "CEO, Nexora",
    initials: "MT",
  },
];

function Testimonials() {
  return (
    <section className="testimonials-section">
      <div className="section-container">
        <motion.div
          className="testimonials-heading"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.7 }}
        >
          <p className="section-label">CLIENT STORIES</p>

          <h2>
            Built with our clients,
            <span> trusted by them.</span>
          </h2>
        </motion.div>

        <div className="testimonials-grid">
          {testimonials.map((testimonial, index) => (
            <motion.article
              className="testimonial-card"
              key={testimonial.name}
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{
                duration: 0.6,
                delay: index * 0.12,
              }}
              whileHover={{ y: -7 }}
            >
              <div className="stars">
                {[1, 2, 3, 4, 5].map((star) => (
                  <FiStar key={star} fill="currentColor" />
                ))}
              </div>

              <p className="testimonial-quote">
                “{testimonial.quote}”
              </p>

              <div className="testimonial-person">
                <div className="testimonial-avatar">
                  {testimonial.initials}
                </div>

                <div>
                  <strong>{testimonial.name}</strong>
                  <small>{testimonial.role}</small>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Testimonials;