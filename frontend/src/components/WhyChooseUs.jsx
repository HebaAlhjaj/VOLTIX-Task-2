import { motion } from "framer-motion";
import {
  FiTarget,
  FiTrendingUp,
  FiShield,
  FiLayers,
} from "react-icons/fi";

const reasons = [
  {
    icon: FiTarget,
    number: "01",
    title: "Business Focused",
    description:
      "Every solution is designed around your goals, your users, and your long-term growth.",
  },
  {
    icon: FiTrendingUp,
    number: "02",
    title: "Built to Scale",
    description:
      "We build flexible digital products that can evolve as your business grows.",
  },
  {
    icon: FiShield,
    number: "03",
    title: "Reliable Quality",
    description:
      "Clean code, thoughtful design, and modern development practices from start to finish.",
  },
  {
    icon: FiLayers,
    number: "04",
    title: "One Digital Partner",
    description:
      "Design, development, and digital solutions brought together under one team.",
  },
];

function WhyChooseUs() {
  return (
    <section className="why-section" id="why-us">
      <div className="section-container">
        <div className="why-heading">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.7 }}
          >
            <p className="section-label">WHY NOVATECH</p>

            <h2>
              Technology with a
              <span> purpose.</span>
            </h2>
          </motion.div>

          <motion.p
            className="why-intro"
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            Great digital products are more than beautiful interfaces.
            They need to solve real problems, perform reliably, and create
            value for the people using them.
          </motion.p>
        </div>

        <div className="why-grid">
          {reasons.map((reason, index) => {
            const Icon = reason.icon;

            return (
              <motion.article
                className="why-card"
                key={reason.number}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.1,
                }}
                whileHover={{
                  y: -8,
                }}
              >
                <div className="why-top">
                  <span>{reason.number}</span>

                  <motion.div
                    className="why-icon"
                    whileHover={{ rotate: 8, scale: 1.08 }}
                  >
                    <Icon />
                  </motion.div>
                </div>

                <div>
                  <h3>{reason.title}</h3>

                  <p>{reason.description}</p>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default WhyChooseUs;