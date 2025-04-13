'use client'
import { motion, useScroll, useTransform, useAnimation, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from 'react';
import { FaInstagram, FaLinkedinIn, FaMapMarkerAlt } from 'react-icons/fa';


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




const VideoSection = () => {
  const containerRef = useRef(null);
  const videoRef = useRef(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  return (
    <section ref={containerRef} className="h-screen w-full relative bg-black">
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        style={{ opacity }}
      >
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          className="max-w-full max-h-full"
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
    <section className="min-h-screen w-screen bg-black relative overflow-hidden">
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
      <LetterReveal />
      <VideoSection />
      <ProjectGrid projects={projects} />
      
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