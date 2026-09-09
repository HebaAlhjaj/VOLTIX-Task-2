import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiArrowUpRight,
  FiMenu,
  FiX,
} from "react-icons/fi";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const navItems = [
    { label: "Home", href: "#home" },
    { label: "About", href: "#about" },
    { label: "Services", href: "#services" },
    { label: "Projects", href: "#projects" },
    { label: "Contact", href: "#contact" },
  ];

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <>
      <motion.nav
        className="navbar"
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{
          duration: 0.8,
          ease: "easeOut",
        }}
      >
        <motion.a
          href="#home"
          className="logo"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.2 }}
          onClick={closeMenu}
        >
          NOVA<span>TECH</span>
        </motion.a>

        <div className="nav-links">
          {navItems.map((item) => (
            <motion.a
              key={item.label}
              href={item.href}
              whileHover={{ y: -2 }}
            >
              {item.label}
            </motion.a>
          ))}
        </div>

        <motion.a
          href="#contact"
          className="nav-cta"
          whileHover={{
            scale: 1.04,
            boxShadow:
              "0 0 25px rgba(0, 229, 255, 0.25)",
          }}
          whileTap={{ scale: 0.97 }}
        >
          Get Started
          <FiArrowUpRight />
        </motion.a>

        <button
          className="mobile-menu-button"
          type="button"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          onClick={() => setMenuOpen((prev) => !prev)}
        >
          {menuOpen ? <FiX /> : <FiMenu />}
        </button>
      </motion.nav>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="mobile-menu"
            initial={{
              opacity: 0,
              y: -15,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              y: -15,
            }}
            transition={{ duration: 0.25 }}
          >
            {navItems.map((item, index) => (
              <motion.a
                key={item.label}
                href={item.href}
                onClick={closeMenu}
                initial={{
                  opacity: 0,
                  x: -15,
                }}
                animate={{
                  opacity: 1,
                  x: 0,
                }}
                transition={{
                  delay: index * 0.06,
                }}
              >
                {item.label}
              </motion.a>
            ))}

            <motion.a
              href="#contact"
              className="mobile-menu-cta"
              onClick={closeMenu}
            >
              Get Started
              <FiArrowUpRight />
            </motion.a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default Navbar;