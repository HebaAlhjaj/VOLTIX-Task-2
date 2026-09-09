import { useState } from "react";
import { motion } from "framer-motion";
import {
  FiMail,
  FiMapPin,
  FiPhone,
  FiSend,
} from "react-icons/fi";

function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [status, setStatus] = useState({
    type: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (event) => {
    const { id, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [id]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setStatus({
      type: "",
      message: "",
    });

    setIsSubmitting(true);

    try {
      const response = await fetch("http://127.0.0.1:8000/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Something went wrong.");
      }

      setStatus({
        type: "success",
        message: "Your message has been sent successfully!",
      });

      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
    } catch (error) {
      setStatus({
        type: "error",
        message:
          error.message || "Failed to send your message. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="contact-section" id="contact-form">
      <div className="section-container contact-container">
        <motion.div
          className="contact-info"
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7 }}
        >
          <p className="section-label">CONTACT US</p>

          <h2>
            Let's start a
            <span> conversation.</span>
          </h2>

          <p className="contact-description">
            Have a project in mind or simply want to say hello?
            Send us a message and we'll get back to you soon.
          </p>

          <div className="contact-details">
            <div>
              <FiMail />
              <span>hello@novatech.dev</span>
            </div>

            <div>
              <FiPhone />
              <span>+962 7780745380</span>
            </div>

            <div>
              <FiMapPin />
              <span>Amman, Jordan</span>
            </div>
          </div>
        </motion.div>

        <motion.form
          className="contact-form"
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          onSubmit={handleSubmit}
        >
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input
                id="name"
                type="text"
                placeholder="Your name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="subject">Subject</label>
            <input
              id="subject"
              type="text"
              placeholder="How can we help?"
              value={formData.subject}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="message">Message</label>
            <textarea
              id="message"
              rows="6"
              placeholder="Tell us about your project..."
              value={formData.message}
              onChange={handleChange}
              required
            ></textarea>
          </div>

          {status.message && (
            <div className={`contact-status ${status.type}`}>
              {status.message}
            </div>
          )}

          <motion.button
            type="submit"
            className="contact-button"
            disabled={isSubmitting}
            whileHover={{
              scale: 1.02,
              boxShadow: "0 0 30px rgba(0, 229, 255, 0.22)",
            }}
            whileTap={{ scale: 0.98 }}
          >
            {isSubmitting ? "Sending..." : "Send Message"}
            <FiSend />
          </motion.button>
        </motion.form>
      </div>
    </section>
  );
}

export default Contact;