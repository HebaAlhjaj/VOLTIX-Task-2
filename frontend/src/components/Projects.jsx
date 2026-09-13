import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  FiArrowUpRight,
  FiShoppingBag,
  FiActivity,
  FiBarChart2,
} from "react-icons/fi";
import { getContentItems } from "../services/contentApi";

function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getContentItems()
      .then((data) => {
        setProjects(data);
      })
      .catch((error) => {
        console.error("Error loading projects:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const getProjectIcon = (category) => {
    switch (category?.toLowerCase()) {
      case "e-commerce":
      case "ecommerce":
        return FiShoppingBag;

      case "healthcare":
        return FiActivity;

      case "business":
      case "technology":
        return FiBarChart2;

      default:
        return FiBarChart2;
    }
  };

  return (
    <section className="projects-section" id="projects">
      <div className="section-container">
        <motion.div
          className="projects-heading"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.7 }}
        >
          <div>
            <p className="section-label">SELECTED WORK</p>

            <h2>
              Ideas we've turned
              <span> into reality.</span>
            </h2>
          </div>

          <p>
            A selection of digital experiences created to solve challenges,
            simplify processes, and help businesses grow.
          </p>
        </motion.div>

        {loading ? (
          <p>Loading projects...</p>
        ) : (
          <div className="projects-list">
            {projects.map((project, index) => {
              const Icon = getProjectIcon(project.category);

              return (
                <motion.article
                  className="project-card"
                  key={project.id}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.15 }}
                  transition={{
                    duration: 0.7,
                    delay: index * 0.12,
                  }}
                  whileHover={{ y: -6 }}
                >
                  <div className="project-visual">
                    <div className="project-glow"></div>

                    <div className="project-window">
                      <div className="project-window-header">
                        <div>
                          <span></span>
                          <span></span>
                          <span></span>
                        </div>

                        <small>
                          {project.title.toLowerCase()}.app
                        </small>
                      </div>

                      <div className="project-window-content">
                        <Icon className="project-main-icon" />

                        <div className="project-lines">
                          <span></span>
                          <span></span>
                          <span></span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="project-info">
                    <div className="project-meta">
                      <span>
                        {String(index + 1).padStart(2, "0")}
                      </span>

                      <span>{project.category}</span>
                    </div>

                    <h3>{project.title}</h3>

                    <p>{project.description}</p>

                    <a href="#contact">
                      View Project
                      <FiArrowUpRight />
                    </a>
                  </div>
                </motion.article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

export default Projects;