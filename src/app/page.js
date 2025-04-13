'use client'
import { motion, useScroll, useTransform, useAnimation, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from 'react';
import { FaInstagram, FaLinkedinIn, FaMapMarkerAlt } from 'react-icons/fa';
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
    <nav className="fixed top-0 w-full z-50 bg-black backdrop-blur-md px-6 py-4 flex items-center justify-between">
      <div className="text-white font-light text-xl">
        <img src="/assets/logoa.png" className="w-[150px] h-[150px]" alt="Atelier Republic Logo" />
      </div>
      <div className="md:hidden text-white" onClick={() => setIsOpen(!isOpen)}>
        ☰
      </div>
      <ul className={`md:flex gap-6 text-white font-light transition-all duration-300 
                      ${isOpen ? 'block absolute top-full left-0 w-full bg-black p-4' : 'hidden md:flex'}`}>
        {["home", "about", "video", "projects", "team"].map((id) => (
          <li key={id} className="cursor-pointer hover:text-white/80" onClick={() => scrollToSection(id)}>
            {id.charAt(0).toUpperCase() + id.slice(1)}
          </li>
        ))}
      </ul>
    </nav>
  );
};

const LetterReveal = () => {
  const controls = useAnimation();
  const [isMounted, setIsMounted] = useState(false);
  const [finalPositions, setFinalPositions] = useState([]);
  const containerRef = useRef(null);
  const textRef = useRef(null);

  const letters = "atelier republic".split("");
  const baseSpacing = 16;
  const spaceWidth = 64;

  const specialSpacing = {
    2: 0,
    3: 0,
    11: 0,
    7: spaceWidth
  };

  const getRandomPosition = () => ({
    x: isMounted ? Math.random() * 1000 - 500 : 0,
    y: isMounted ? Math.random() * 600 - 300 : 0,
    rotate: isMounted ? Math.random() * 60 - 30 : 0,
    scale: isMounted ? Math.random() * 0.5 + 0.5 : 1
  });

  const getCenteredPositions = () => {
    if (!textRef.current || !containerRef.current) return letters.map(() => ({ x: 0, y: 0 }));

    const containerRect = containerRef.current.getBoundingClientRect();
    const textRect = textRef.current.getBoundingClientRect();

    const letterWidths = letters.map(letter => {
      const span = document.createElement('span');
      span.textContent = letter;
      span.style.fontSize = window.getComputedStyle(textRef.current).fontSize;
      span.style.fontFamily = window.getComputedStyle(textRef.current).fontFamily;
      span.style.display = 'inline-block';
      document.body.appendChild(span);
      const width = span.getBoundingClientRect().width;
      document.body.removeChild(span);
      return width;
    });

    let totalWidth = 0;
    letters.forEach((_, i) => {
      totalWidth += letterWidths[i] + (specialSpacing[i] || baseSpacing);
    });

    const startX = (containerRect.width - totalWidth) / 2;
    const centerY = containerRect.height / 2 - textRect.height / 2;

    let currentX = startX;
    return letters.map((_, i) => {
      const position = {
        x: currentX,
        y: centerY,
      };
      currentX += letterWidths[i] + (specialSpacing[i] || baseSpacing);
      return position;
    });
  };

  useEffect(() => {
    setIsMounted(true);
    const handleResize = () => setFinalPositions(getCenteredPositions());
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (isMounted && finalPositions.length === letters.length) {
      controls.start("scattered").then(() =>
        setTimeout(() => controls.start("combined"), 200)
      );
    }
  }, [isMounted, finalPositions]);

  const letterVariants = {
    scattered: () => ({
      opacity: 0.7,
      ...getRandomPosition(),
      transition: { duration: 0 }
    }),
    combined: (i) => ({
      opacity: 1,
      x: finalPositions[i]?.x || 0,
      y: finalPositions[i]?.y || 0,
      rotate: 0,
      scale: 1,
      transition: {
        type: "spring",
        damping: 50,
        stiffness: 100,
        delay: i * 0.03
      }
    })
  };

  return (
    <div
    id="home"
      ref={containerRef}
      className="h-screen w-full flex items-center justify-center bg-black overflow-hidden relative "
    >
      {/* Hidden reference text for measuring dimensions */}
      <div
        ref={textRef}
        className="absolute opacity-0 pointer-events-none font-light text-[clamp(2rem,5vw,6rem)] m-4"
      >
        atelier republic
      </div>

      {isMounted &&
        letters.map((letter, i) => (
          <motion.span
            key={i}
            custom={i}
            variants={letterVariants}
            initial="scattered"
            animate={controls}
            className="absolute text-white font-light text-[clamp(2rem,5vw,6rem)]"
            style={{
              left: 0,
              visibility: isMounted ? "visible" : "hidden",
            }}
          >
            {letter === " " ? "\u00A0" : letter}
          </motion.span>
        ))}
    </div>
  );
};

const AboutSection = () => {
  return (
    <section id="about" className="min-h-screen bg-black text-white flex items-center justify-center px-8 py-20">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
      <div className="relative aspect-square">
          <img 
            src="/assets/logoa.png" 
            alt="Atelier Republic Studio" 
            className="w-full h-full object-cover rounded-lg"
          />
        </div>
        <div>
          <h2 className="text-4xl font-light mb-8">Our Philosophy</h2>
          <p className="text-lg mb-6 opacity-80">
            Atelier Republic is an architectural practice rooted in the belief that design should be
            a dialogue between space, light, and human experience. We approach each project as a
            unique narrative, blending local context with global perspectives.
          </p>
          <p className="text-lg mb-6 opacity-80">
            Founded in Kerala, our work spans across residential, commercial, and public spaces,
            with a focus on sustainable and contextually responsive architecture.
          </p>
          <p className="text-lg opacity-80">
            Our designs emerge from careful study of site conditions, cultural heritage, and
            contemporary needs, resulting in spaces that are both timeless and forward-looking.
          </p>
        </div>
     
      </div>
    </section>
  );
};



const VideoSection = () => {
  const containerRef = useRef(null);
  const videoRef = useRef(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  return (
    <section id="video" ref={containerRef} className="h-screen w-full relative bg-black ">
      <motion.div
        className="absolute inset-10 flex items-center justify-center"
        style={{ opacity }}
      >
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          className="max-w-full max-h-full mt-6"
          src="/videos/showreel.mp4"
        />
      </motion.div>
    </section>
  );
};


const ProjectGrid = ({ projects }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(null);
  const carouselRef = useRef(null);

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

  const variants = {
    hidden: (direction) => ({
      x: direction === "right" ? "100%" : "-100%",
      opacity: 0.7
    }),
    visible: {
      x: "0%",
      opacity: 1,
      transition: { duration: 0.4, ease: "easeInOut" }
    },
    exit: (direction) => ({
      x: direction === "right" ? "-100%" : "100%",
      opacity: 0.7,
      transition: { duration: 0.4, ease: "easeInOut" }
    })
  };

  return (
    <section id="project" className="min-h-screen w-screen bg-black relative overflow-hidden">
      <div className="relative h-screen w-full">
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={variants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="absolute inset-0 w-full h-full"
          >
            <div className="group relative w-full h-full">
              <img
                src={projects[currentIndex].image}
                alt={projects[currentIndex].title}
                className="w-full h-full object-contain"
              />
              
              <AnimatePresence>
                <motion.div
                  className="absolute inset-0  flex flex-col justify-end p-6 md:p-8"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="opacity-100 group-hover:opacity-100 transition-opacity duration-300">
                    <h3 className="text-2xl md:text-4xl font-medium text-white mb-2">
                      {projects[currentIndex].title}
                    </h3>
                    <p className="text-sm md:text-lg text-white/80">
                      {projects[currentIndex].location}
                    </p>
                    <p className="text-xs md:text-base text-white/60 mt-4 max-w-2xl">
                      {projects[currentIndex].description}
                    </p>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 bg-black/30 p-3 rounded-full hover:bg-black/60 transition-colors backdrop-blur-sm"
          aria-label="Previous project"
        >
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 bg-black/30 p-3 rounded-full hover:bg-black/60 transition-colors backdrop-blur-sm"
          aria-label="Next project"
        >
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Dots Indicator */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {projects.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                currentIndex === index 
                  ? "bg-white scale-125" 
                  : "bg-white/30 hover:bg-white/50 scale-100"
              }`}
              aria-label={`Go to project ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
const TeamSection = () => {
  const team = [
    { 
      name: "Latif Afsal", 
      role: "Senior Architect, CEO", 
      img: "/assets/team1.jpg",
      bio: "Latif Afsal founded Atelier Republic with a vision to bridge traditional Kerala architecture with contemporary design principles. With a Master's in Sustainable Design from CEPT University and 12+ years of experience, he leads projects that emphasize climate-responsive design and cultural authenticity. His award-winning work on vernacular reinterpretations has been featured in Architectural Digest India. "
    },
    { 
      name: "Shijna Abusalih", 
      role: "Head of Operations", 
      img: "/assets/team2.jpg",
      bio: "Shijna brings 8 years of experience in architectural project management, streamlining workflows between design teams and construction sites. Specializing in resource optimization and client relations, she holds a PMP certification and has successfully delivered 30+ projects ranging from luxury residences to institutional campuses across South India"
    },
    { 
      name: "Jean Solomon", 
      role: "Junior Architect", 
      img: "https://media.licdn.com/dms/image/v2/D5603AQHD-O7qAJnI-A/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1720927323391?e=1750291200&v=beta&t=Myk25syAo9PR5mrDb19f_aDTGkwSlZI7KkFq73MFgas",
      bio: "A recent graduate from the University of Kerala with honors in Architectural Design, Jean contributes fresh perspectives to the studio's residential projects. Passionate about parametric design and digital fabrication, they assist in 3D modeling and material research while developing expertise in tropical modernism under the team's mentorship"
    },
  ];

  return (
    <section id="team" className="bg-black text-white py-20 px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-light mb-4">Our Team</h2>
          <p className="max-w-2xl mx-auto opacity-80">
            A collaborative collective of architects, designers, and thinkers committed to creating
            meaningful spaces that respond to their environment and users.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-12">
          {team.map((member, idx) => (
            <div key={idx} className="flex flex-col items-center text-center">
              <img
                src={member.img}
                alt={member.name}
                className="w-40 h-40 object-cover rounded-full border-2 border-white mb-6"
              />
              <h3 className="text-xl font-medium mb-2">{member.name}</h3>
              <p className="text-white/60 mb-4">{member.role}</p>
              <p className="text-white/70 text-sm">{member.bio}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};



export default function Home() {
  const projects = [
    {
      id: 1,
      title: "Harsham",
      location: "Wadakkanchery, Thrissur",
      description: "Mixed-use development blending Japanese aesthetics with modern design",
      image: "/assets/image1.svg"
    },
    {
      id: 2,
      title: "Harsham",
      location: "Wadakkanchery, Thrissur",
      description: "Minimalist villa carved into volcanic cliffs",
      image: "/assets/image2.svg"
    },
    {
      id: 3,
      title: "Harsham",
      location: "Wadakkanchery, Thrissur",
      description: "Vertical garden tower with biophilic design",
      image: "/assets/image3.svg"
    },
    {
      id: 4,
      title: "Harsham",
      location: "Wadakkanchery, Thrissur",
      description: "Luxury resort with passive cooling systems",
      image: "/assets/image4.svg"
    },

  ];

  return (

    <div className="relative w-full">
      <Navbar />
      <LetterReveal id="home" />
      <AboutSection  />
      <section className="mt-[200px]">
      <VideoSection id="video" />
      </section>
     
      <ProjectGrid id="projects" projects={projects} />
      <TeamSection />
      
      <footer className="py-16 px-8 border-t border-white/10 bg-black">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-light mb-4">Atelier Republic</h3>
            <p className="opacity-70">
              2nd floor, Arfa Complex<br />
              Herbert Road, Near Municipal Town Hall<br />
              Kunnamkulam, Kerala 680503
            </p>
          </div>

          <div>
            <h3 className="text-xl font-light mb-4">Contact</h3>
            <p className="opacity-70">studio@atelierrepublic.com</p>
            <p className="opacity-70">+91 751 096 4201 </p>
          </div>

          <div>
            <h3 className="text-xl font-light mb-4">Connect</h3>
            <div className="flex gap-4">
              <a
                href="https://www.instagram.com/atelier.republic/"
                target="_blank"
                rel="noopener noreferrer"
                className="opacity-70 hover:opacity-100 transition"
              >
                <FaInstagram size={24} />
              </a>
              <a
                href="https://www.linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="opacity-70 hover:opacity-100 transition"
              >
                <FaLinkedinIn size={24} />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-light mb-4 flex items-center gap-2">
              <FaMapMarkerAlt /> Location
            </h3>
            <div className="aspect-video relative rounded-lg overflow-hidden border border-white/10">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.753812430012!2d76.06944277603357!3d10.64892518944534!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba7d9b489f4f0c3%3A0x7f67f3b3d3a4e3b8!2sAtelier%20Republic!5e0!3m2!1sen!2sin!4v1716999999999!5m2!1sen!2sin"
                className="absolute inset-0 w-full h-full"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto mt-12 pt-8 border-t border-white/10 text-sm opacity-50">
          © {new Date().getFullYear()} Atelier Republic. All rights reserved.
        </div>
      </footer>
    </div>
  );
}