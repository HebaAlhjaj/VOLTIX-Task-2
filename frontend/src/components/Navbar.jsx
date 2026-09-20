import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiArrowUpRight,
  FiMenu,
  FiX,
  FiSettings,
  FiTool,
  FiLogOut,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";

function Navbar({ onAdminClick, onServiceAdminClick }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

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

  const handleAdminClick = () => {
    closeMenu();

    const token = localStorage.getItem("access_token");

    if (token) {
      onAdminClick();
    } else {
      navigate("/login");
    }
  };

  const handleServiceAdminClick = () => {
    closeMenu();

    console.log("SERVICES BUTTON CLICKED");
    console.log(
      "Service handler:",
      onServiceAdminClick
    );

    if (onServiceAdminClick) {
      console.log("OPENING SERVICE MANAGEMENT");
      onServiceAdminClick();
    } else {
      console.error(
        "ERROR: onServiceAdminClick is undefined"
      );
    }
  };

  const handleLogout = () => {
    closeMenu();
    localStorage.removeItem("access_token");
    navigate("/login");
  };

  const isLoggedIn = Boolean(
    localStorage.getItem("access_token")
  );

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

          {/* Content Management */}
          <motion.button
            type="button"
            className="nav-admin"
            onClick={handleAdminClick}
            whileHover={{
              y: -2,
              boxShadow:
                "0 0 20px rgba(0, 229, 255, 0.18)",
            }}
            whileTap={{ scale: 0.97 }}
          >
            <FiSettings />
            Admin
          </motion.button>

          {/* Service Management */}
          <motion.button
            type="button"
            className="nav-admin"
            onClick={handleServiceAdminClick}
            whileHover={{
              y: -2,
              boxShadow:
                "0 0 20px rgba(0, 229, 255, 0.18)",
            }}
            whileTap={{ scale: 0.97 }}
          >
            <FiTool />
            Services
          </motion.button>

          {/* Logout */}
          {isLoggedIn && (
            <motion.button
              type="button"
              className="nav-admin"
              onClick={handleLogout}
              whileHover={{
                y: -2,
                boxShadow:
                  "0 0 20px rgba(0, 229, 255, 0.18)",
              }}
              whileTap={{ scale: 0.97 }}
            >
              <FiLogOut />
              Logout
            </motion.button>
          )}
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
          aria-label={
            menuOpen ? "Close menu" : "Open menu"
          }
          onClick={() =>
            setMenuOpen((prev) => !prev)
          }
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

            {/* Mobile Content Management */}
            <motion.button
              type="button"
              className="mobile-admin-button"
              onClick={handleAdminClick}
            >
              <FiSettings />
              Admin
            </motion.button>

            {/* Mobile Service Management */}
            <motion.button
              type="button"
              className="mobile-admin-button"
              onClick={handleServiceAdminClick}
            >
              <FiTool />
              Services
            </motion.button>

            {/* Mobile Logout */}
            {isLoggedIn && (
              <motion.button
                type="button"
                className="mobile-admin-button"
                onClick={handleLogout}
              >
                <FiLogOut />
                Logout
              </motion.button>
            )}

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