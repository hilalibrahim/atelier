'use client'
import { motion, useScroll, useTransform, useAnimation, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from 'react';
import { FaInstagram, FaLinkedinIn, FaMapMarkerAlt } from 'react-icons/fa';

// Navbar remains the same
const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const scrollToSection = (id) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
      setIsOpen(false);
    }
  };

  return (
    <nav className="fixed top-0 w-full z-50 bg-[] px-6 py-4 flex items-center justify-between">
      <div className="text-white font-light text-xl">
        <img src="/assets/logoa.png" className="w-[20px] h-[20px]" alt="Atelier Republic Logo" />
      </div>
      <div className="md:hidden text-white" onClick={() => setIsOpen(!isOpen)}>
        ☰
      </div>
      <ul className={`md:flex gap-6 text-white font-light transition-all duration-300 
                      ${isOpen ? 'block absolute top-full left-0 w-full bg-black p-4' : 'hidden md:flex'}`}>
        {[ "about", "projects", "team"].map((id) => (
          <li key={id} className="cursor-pointer hover:text-white/80" onClick={() => scrollToSection(id)}>
            {id.charAt(0).toUpperCase() + id.slice(1)}
          </li>
        ))}
      </ul>
    </nav>
  );
};

const VideoSection = () => {
  const containerRef = useRef(null);
  const videoRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);

  return (
    <section 
      id="video" 
      ref={containerRef} 
      className="relative w-full h-screen bg-black overflow-hidden flex items-center justify-center"
    >
      <motion.div 
        className="absolute inset-0 w-full h-full"
        style={{ y }}
      >
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover sm:object-contain md:object-cover"
          src="/videos/showreeln.mp4"
        />
      </motion.div>
    </section>
  );
};
const AboutSection = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "center start"]
  });
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0, 1, 1]);
  const y = useTransform(scrollYProgress, [0, 1], ["50px", "0px"]);

  // Split text into words for animation
  const title = "Our Philosophy".split(" ");
  const paragraphs = [
    "Atelier Republic is an architectural practice rooted in the belief that design should be a dialogue between space, light, and human experience.",
    "Founded in Kerala, our work spans across residential, commercial, and public spaces, with a focus on sustainable and contextually responsive architecture.",
    "Our designs emerge from careful study of site conditions, cultural heritage, and contemporary needs, resulting in spaces that are both timeless and forward-looking."
  ];

  return (
    <motion.section 
      id="about" 
      ref={ref}
      style={{ opacity, y }}
      className="min-h-screen bg-black text-white flex items-center justify-center px-8 py-20"
    >
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        <motion.div 
          className="relative aspect-square"
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: false, margin: "-100px 0px -100px 0px" }}
          transition={{ duration: 0.8 }}
        >
          <img 
            src="/assets/logoan.png" 
            alt="Atelier Republic Studio" 
            className="w-full h-full object-cover rounded-lg"
          />
        </motion.div>
        
        <div>
          <h2 className="text-4xl font-light mb-8 overflow-hidden">
            {title.map((word, i) => (
              <motion.span
                key={i}
                className="inline-block"
                initial={{ y: "100%", opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: false, margin: "-100px 0px -100px 0px" }}
                transition={{ 
                  duration: 0.5, 
                  delay: i * 0.1,
                  ease: [0.16, 0.77, 0.47, 0.97]
                }}
              >
                {word}&nbsp;
              </motion.span>
            ))}
          </h2>
          
          {paragraphs.map((text, i) => (
            <motion.p 
              key={i}
              className="text-lg mb-6 opacity-80"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, margin: "-100px 0px -100px 0px" }}
              transition={{ 
                duration: 0.6, 
                delay: 0.3 + (i * 0.15),
                ease: "easeOut"
              }}
            >
              {text}
            </motion.p>
          ))}
        </div>
      </div>
    </motion.section>
  );
};

const ProjectGrid = ({ projects }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(null);
  const [isHovered, setIsHovered] = useState(false);
  const sectionRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "center start"]
  });

  const nextSlide = () => {
    setDirection("right");
    setCurrentIndex((prev) => (prev === projects.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setDirection("left");
    setCurrentIndex((prev) => (prev === 0 ? projects.length - 1 : prev - 1));
  };

  const goToSlide = (index) => {
    setDirection(index > currentIndex ? "right" : "left");
    setCurrentIndex(index);
  };

  // Animation variants
  const slideVariants = {
    hidden: (direction) => ({
      x: direction === "right" ? "30%" : "-30%",
      opacity: 0,
      scale: 0.95,
      filter: "blur(4px)"
    }),
    visible: {
      x: "0%",
      opacity: 1,
      scale: 1,
      filter: "blur(0px)",
      transition: { 
        duration: 0.8, 
        ease: [0.16, 0.77, 0.47, 0.97],
      }
    },
    exit: (direction) => ({
      x: direction === "right" ? "-30%" : "30%",
      opacity: 0,
      scale: 0.95,
      filter: "blur(4px)",
      transition: { 
        duration: 0.8, 
        ease: [0.16, 0.77, 0.47, 0.97]
      }
    })
  };

  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.6, 
        delay: 0.4,
        ease: "easeOut"
      }
    }
  };

  const dotVariants = {
    inactive: { scale: 1, backgroundColor: "rgba(255,255,255,0.3)" },
    active: { 
      scale: 1.3, 
      backgroundColor: "rgba(255,255,255,1)",
      transition: { type: "spring", stiffness: 500 }
    },
    hover: { scale: 1.2, backgroundColor: "rgba(255,255,255,0.7)" }
  };

  return (
    <motion.section 
      id="projects" 
      ref={sectionRef}
      className="min-h-screen w-full bg-black relative overflow-hidden"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: false, margin: "-100px" }}
      transition={{ duration: 0.6 }}
    >
      <div 
        className="relative h-screen w-full flex items-center justify-center"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={slideVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="absolute inset-0 w-full h-full flex items-center justify-center"
          >
            <div className="relative w-full h-full max-w-6xl mx-auto">
              <img
                src={projects[currentIndex].image}
                alt={projects[currentIndex].title}
                className="w-full h-full object-cover rounded-xl"
              />
              
              <motion.div
                className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex flex-col justify-end p-8"
                initial="hidden"
                animate="visible"
                variants={textVariants}
              >
                <div className="max-w-2xl">
                  <motion.h3 
                    className="text-3xl md:text-5xl font-light text-white mb-2"
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    {projects[currentIndex].title}
                  </motion.h3>
                  <motion.p 
                    className="text-lg md:text-xl text-white/80 mb-4"
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.6 }}
                  >
                    {projects[currentIndex].location}
                  </motion.p>
                  <motion.p 
                    className="text-base md:text-lg text-white/60"
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.7 }}
                  >
                    {projects[currentIndex].description}
                  </motion.p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Arrows */}
        <motion.button
          onClick={prevSlide}
          className="absolute left-8 top-1/2 -translate-y-1/2 bg-black/50 p-4 rounded-full backdrop-blur-sm z-10"
          aria-label="Previous project"
          initial={{ opacity: 0, x: -20 }}
          animate={{ 
            opacity: isHovered ? 1 : 0.7,
            x: 0
          }}
          whileHover={{ scale: 1.1, backgroundColor: "rgba(0,0,0,0.8)" }}
          transition={{ type: "spring", stiffness: 400 }}
        >
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </motion.button>
        
        <motion.button
          onClick={nextSlide}
          className="absolute right-8 top-1/2 -translate-y-1/2 bg-black/50 p-4 rounded-full backdrop-blur-sm z-10"
          aria-label="Next project"
          initial={{ opacity: 0, x: 20 }}
          animate={{ 
            opacity: isHovered ? 1 : 0.7,
            x: 0
          }}
          whileHover={{ scale: 1.1, backgroundColor: "rgba(0,0,0,0.8)" }}
          transition={{ type: "spring", stiffness: 400 }}
        >
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </motion.button>

        {/* Dots Indicator */}
        <motion.div 
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          {projects.map((_, index) => (
            <motion.button
              key={index}
              onClick={() => goToSlide(index)}
              className="w-3 h-3 rounded-full"
              variants={dotVariants}
              initial="inactive"
              animate={currentIndex === index ? "active" : "inactive"}
              whileHover="hover"
              transition={{ type: "spring", stiffness: 500 }}
              aria-label={`Go to project ${index + 1}`}
            />
          ))}
        </motion.div>

        {/* Project Counter */}
        <motion.div 
          className="absolute bottom-8 right-8 text-white/60 text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.7 }}
          transition={{ delay: 1 }}
        >
          {currentIndex + 1} / {projects.length}
        </motion.div>
      </div>
    </motion.section>
  );
};
const Footer = () => {
  const footerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.16, 0.77, 0.47, 0.97]
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.6,
        ease: "easeOut"
      }
    }),
    hover: {
      y: -3,
      transition: { duration: 0.2 }
    }
  };

  const socialVariants = {
    hover: {
      scale: 1.2,
      rotate: [0, -10, 10, 0],
      transition: { duration: 0.6 }
    },
    tap: { scale: 0.9 }
  };

  return (
    <motion.footer 
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false, margin: "-50px" }}
      variants={footerVariants}
      className="py-20 px-6 sm:px-8 bg-gradient-to-b from-black to-gray-900/50 relative overflow-hidden"
    >
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-64 h-64 bg-blue-500/5 rounded-full filter blur-3xl -translate-x-1/3 -translate-y-1/3" />
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full filter blur-3xl translate-x-1/3 translate-y-1/3" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-16">
          {/* Company Info */}
          <motion.div
            custom={0}
            variants={itemVariants}
            whileHover="hover"
          >
            <motion.h3 
              className="text-xl font-light mb-6 text-white/90"
              whileHover={{ color: "#ffffff" }}
            >
              Atelier Republic
            </motion.h3>
            <motion.p 
              className="opacity-70 mb-4 leading-relaxed"
              whileHover={{ opacity: 0.9 }}
            >
              2nd floor, Arfa Complex<br />
              Herbert Road, Near Municipal Town Hall<br />
              Kunnamkulam, Kerala 680503
            </motion.p>
          </motion.div>

          {/* Contact */}
          <motion.div
            custom={1}
            variants={itemVariants}
            whileHover="hover"
          >
            <motion.h3 
              className="text-xl font-light mb-6 text-white/90"
              whileHover={{ color: "#ffffff" }}
            >
              Contact
            </motion.h3>
            <motion.a 
              href="mailto:latif@atelierrepublic.com" 
              className="block opacity-70 mb-3 hover:opacity-100 transition-all"
              whileHover={{ x: 5 }}
            >
              latif@atelierrepublic.com
            </motion.a>
            <motion.a 
              href="tel:+917510964201" 
              className="block opacity-70 hover:opacity-100 transition-all"
              whileHover={{ x: 5 }}
            >
              +91 751 096 4201
            </motion.a>
          </motion.div>

          {/* Connect */}
          <motion.div
            custom={2}
            variants={itemVariants}
          >
            <motion.h3 
              className="text-xl font-light mb-6 text-white/90"
              whileHover={{ color: "#ffffff" }}
            >
              Connect
            </motion.h3>
            <div className="flex gap-5">
              <motion.a
                href="https://www.instagram.com/atelier.republic/"
                target="_blank"
                rel="noopener noreferrer"
                className="opacity-70 hover:opacity-100"
                variants={socialVariants}
                whileHover="hover"
                whileTap="tap"
              >
                <FaInstagram size={22} />
              </motion.a>
              <motion.a
                href="https://www.linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="opacity-70 hover:opacity-100"
                variants={socialVariants}
                whileHover="hover"
                whileTap="tap"
              >
                <FaLinkedinIn size={22} />
              </motion.a>
            </div>
          </motion.div>

          {/* Location */}
          <motion.div
            custom={3}
            variants={itemVariants}
            whileHover="hover"
          >
            <motion.h3 
              className="text-xl font-light mb-6 flex items-center gap-2 text-white/90"
              whileHover={{ color: "#ffffff" }}
            >
              <FaMapMarkerAlt /> Location
            </motion.h3>
            <motion.div 
              className="aspect-video relative rounded-xl overflow-hidden border border-white/10 hover:border-white/30 transition-all"
              whileHover={{ scale: 1.02 }}
            >
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.753812430012!2d76.06944277603357!3d10.64892518944534!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba7d9b489f4f0c3%3A0x7f67f3b3d3a4e3b8!2sAtelier%20Republic!5e0!3m2!1sen!2sin!4v1716999999999!5m2!1sen!2sin"
                className="absolute inset-0 w-full h-full"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </motion.div>
          </motion.div>
        </div>

        {/* Copyright */}
        <motion.div 
          className="pt-8 border-t border-white/10 text-sm opacity-70 flex flex-col md:flex-row justify-between items-center gap-4"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 0.7 }}
          transition={{ delay: 0.4 }}
        >
          <div>
            © {new Date().getFullYear()} Atelier Republic. All rights reserved.
          </div>
          <motion.div 
            className="flex gap-6"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <motion.a 
              href="#" 
              className="text-xs hover:underline"
              whileHover={{ scale: 1.05 }}
            >
              Privacy Policy
            </motion.a>
            <motion.a 
              href="#" 
              className="text-xs hover:underline"
              whileHover={{ scale: 1.05 }}
            >
              Terms of Service
            </motion.a>
          </motion.div>
        </motion.div>
      </div>
    </motion.footer>
  );
};
const TeamSection = () => {
  const team = [
    { 
      name: "Latif Afsal", 
      role: "Senior Architect, CEO", 
      img: "/assets/pica2.svg",
      bio: "Latif Afsal founded Atelier Republic with a vision to bridge traditional Kerala architecture with contemporary design principles. 12+ years of experience, he leads projects that emphasize climate-responsive design and cultural authenticity.",
      social: {
        linkedin: "#",
        instagram: "https://www.instagram.com/latif_afsal/"
      }
    },
    { 
      name: "Shijna Abusalih", 
      role: "Head of Operations", 
      img: "/assets/shij.svg",
      bio: "Shijna brings 8 years of experience in architectural project management, streamlining workflows between design teams and construction sites. Specializing in resource optimization and client relations.",
      social: {
        linkedin: "#",
        instagram: "https://www.instagram.com/shijna_abu/"
      }
    },
    { 
      name: "Jean Solomon", 
      role: "Junior Architect", 
      img: "/assets/j1.svg",
      bio: "A recent graduate from the University of Kerala with honors in Architectural Design, Jean contributes fresh perspectives to the studio's residential projects. Passionate about parametric design and digital fabrication.",
      social: {
        linkedin: "https://www.linkedin.com/in/jean-solomon-b59481186/",
        instagram: "https://www.instagram.com/jeanoninsta/"
      }
    },
  ];

  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "center start"]
  });

  const titleVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.16, 0.77, 0.47, 0.97]
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.95 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        delay: i * 0.15,
        duration: 0.6,
        ease: "easeOut"
      }
    }),
    hover: {
      y: -10,
      transition: { 
        duration: 0.3,
        ease: "easeOut"
      }
    }
  };

  const imageVariants = {
    hidden: { scale: 1.1, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: [0.16, 0.77, 0.47, 0.97]
      }
    },
    hover: {
      scale: 1.05,
      transition: { duration: 0.3 }
    }
  };

  const textVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  return (
    <motion.section 
      id="team" 
      ref={ref}
      className="bg-black text-white py-28 px-6 sm:px-8 overflow-hidden"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: false, margin: "-100px" }}
      transition={{ duration: 0.6 }}
    >
      <div className="max-w-7xl mx-auto">
        <motion.div 
          className="text-center mb-20"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, margin: "-50px" }}
          variants={titleVariants}
        >
          <motion.h2 
            className="text-4xl md:text-5xl font-light mb-6"
          >
            Our Creative Minds
          </motion.h2>
          <motion.p 
            className="max-w-2xl mx-auto text-lg opacity-80"
            variants={textVariants}
          >
            The talented individuals who bring our architectural visions to life through innovation and collaboration.
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {team.map((member, idx) => (
            <motion.div
              key={idx}
              className="group relative"
              custom={idx}
              initial="hidden"
              whileInView="visible"
              whileHover="hover"
              viewport={{ once: false, margin: "-50px" }}
              variants={cardVariants}
            >
              <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm p-8 h-full flex flex-col items-center">
                {/* Image with animation */}
                <motion.div
                  className="relative w-48 h-48 mb-8 rounded-full overflow-hidden border-2 border-white/20 group-hover:border-white/50 transition-all duration-300"
                  variants={imageVariants}
                >
                  <img
                    src={member.img}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </motion.div>

                {/* Content */}
                <motion.div 
                  className="text-center flex-1 flex flex-col"
                  variants={textVariants}
                >
                  <motion.h3 
                    className="text-2xl font-medium mb-2"
                    whileHover={{ color: "#ffffff" }}
                    transition={{ duration: 0.2 }}
                  >
                    {member.name}
                  </motion.h3>
                  <motion.p 
                    className="text-white/60 mb-4 text-sm uppercase tracking-wider"
                    whileHover={{ color: "#ffffff" }}
                    transition={{ duration: 0.2 }}
                  >
                    {member.role}
                  </motion.p>
                  <motion.p 
                    className="text-white/70 text-sm md:text-base mb-6 flex-1"
                    whileHover={{ color: "#ffffff" }}
                    transition={{ duration: 0.2 }}
                  >
                    {member.bio}
                  </motion.p>
                  
                  {/* Social Links */}
                  <motion.div 
                    className="flex justify-center gap-4 mt-4"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ delay: 0.4 + (idx * 0.1) }}
                  >
                    <motion.a
                      href={member.social.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white/60 hover:text-white transition-colors"
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <FaLinkedinIn size={18} />
                    </motion.a>
                    <motion.a
                      href={member.social.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white/60 hover:text-white transition-colors"
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <FaInstagram size={18} />
                    </motion.a>
                  </motion.div>
                </motion.div>

                {/* Decorative elements */}
                <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
                  <div className="absolute top-0 left-0 w-32 h-32 bg-blue-500/10 rounded-full filter blur-3xl -translate-x-1/2 -translate-y-1/2" />
                  <div className="absolute bottom-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full filter blur-3xl translate-x-1/2 translate-y-1/2" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
};

export default function Home() {
  const projects = [
    {
      id: 1,
      title: "Harsham",
      location: "Wadakkanchery, Thrissur",
      // description: "Mixed-use development blending Japanese aesthetics with modern design",
      image: "/assets/image1.svg"
    },
    {
      id: 2,
      title: "Harsham",
      location: "Wadakkanchery, Thrissur",
      // description: "Minimalist villa carved into volcanic cliffs",
      image: "/assets/image2.svg"
    },
    {
      id: 3,
      title: "Harsham",
      location: "Wadakkanchery, Thrissur",
      // description: "Vertical garden tower with biophilic design",
      image: "/assets/image3.svg"
    },
    {
      id: 4,
      title: "Harsham",
      location: "Wadakkanchery, Thrissur",
      // description: "Luxury resort with passive cooling systems",
      image: "/assets/image4.svg"
    },
  ];

  return (
    <div className="relative w-full">
      <Navbar />
      <VideoSection />
      <AboutSection />
      <ProjectGrid projects={projects} />
      <TeamSection />
<Footer/>
    </div>
  );
}