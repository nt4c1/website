import { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import SceneCanvas from './components/SceneCanvas';
import { FaFacebookF, FaWhatsapp } from 'react-icons/fa';
import './index.css';
import CustomCursor from './components/CustomCursor';
import ParallaxScene from './components/ParallaxScene';

export default function App() {
  const totalPages = 8;
  const [page, setPage] = useState(0);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [aboutVisible, setAboutVisible] = useState(false);
  const [isPageVisible, setPageVisible] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [showScrollIndicator, setShowScrollIndicator] = useState(true);

  const aboutRef = useRef(null);
  const homeRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    const bg = document.querySelector('.parallax-background');
    const handleMouseMove = (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 20;
      const y = (e.clientY / window.innerHeight - 0.5) * 20;
      if (bg) {
        bg.style.transform = `translateZ(-1px) scale(2) translate(${x}px, ${y}px)`;
      }
    };
    if (page > 0) {
      window.addEventListener('mousemove', handleMouseMove);
    }
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [page]);

  const handleScroll = useMemo(() => {
    return () => {
      const scrollY = window.scrollY || document.documentElement.scrollTop;
      setShowScrollTop(scrollY > 300);

      if (page === 0) {
        const aboutTop = aboutRef.current?.getBoundingClientRect().top ?? 0;
        const homeBottom = homeRef.current?.getBoundingClientRect().bottom ?? 0;

        setAboutVisible(scrollY > homeBottom / 2);
        setShowScrollIndicator(scrollY < 200);
      }
    };
  }, [page]);

  useEffect(() => {
    const onScroll = () => handleScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [handleScroll]);

  useEffect(() => {
    const onKeyDown = (e) => {
      if (page > 0) {
        if (e.key === 'ArrowRight' && page < totalPages) setPage((p) => p + 1);
        else if (e.key === 'ArrowLeft' && page > 1) setPage((p) => p - 1);
      } else {
        if (e.key === 'ArrowDown') window.scrollBy({ top: 100, behavior: 'smooth' });
        if (e.key === 'ArrowUp') window.scrollBy({ top: -100, behavior: 'smooth' });
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [page]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setAboutVisible(false);
  };

  const handlePageClick = (p) => {
    setPage(p);
    setDropdownOpen(false);
    setPageVisible(false);
    setTimeout(() => setPageVisible(true), 50);
  };

  const goToAbout = () => {
    setPage(0);
    setTimeout(() => {
      aboutRef.current?.scrollIntoView({ behavior: 'smooth' });
      setAboutVisible(true);
    }, 100);
  };

  const goToHome = () => {
    setPage(0);
    scrollToTop();
  };

  const goToStoryStart = () => {
    setPage(1);
    setDropdownOpen(false);
    setPageVisible(false);
    setTimeout(() => setPageVisible(true), 50);
  };

  useEffect(() => {
    if (location.hash === '#about') {
      setPage(0);
      setTimeout(() => {
        aboutRef.current?.scrollIntoView({ behavior: 'smooth' });
        setAboutVisible(true);
      }, 300);
    }
  }, [location]);

  return (
    <div className="canvas-wrapper">
      <CustomCursor />

      {/* Navbar */}
      <nav className="navbar">
        <button onClick={goToHome}>Home</button>

        <div
          className="custom-dropdown"
          onMouseLeave={() => setDropdownOpen(false)}
        >
          <div
            className="dropdown-label"
            onClick={() =>
              page === 0 ? goToStoryStart() : setDropdownOpen(!dropdownOpen)
            }
            onMouseEnter={() => setDropdownOpen(true)}
          >
            {page === 0 ? 'Story' : `Page ${page} ▾`}
          </div>

          {dropdownOpen && (
            <div className="dropdown-options">
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={`page-${i + 1}`}
                  className={`dropdown-option ${
                    page === i + 1 ? 'active' : ''
                  }`}
                  onClick={() => handlePageClick(i + 1)}
                >
                  Page {i + 1}
                </button>
              ))}
            </div>
          )}
        </div>

        <button onClick={goToAbout}>About Us</button>
        <a href="/contact" target="_blank" rel="noopener noreferrer">
          <button>Contact Us</button>
        </a>
      </nav>

      {/* Home Page */}
      {page === 0 ? (
        <div ref={homeRef} className="home-content">
          <section className="hero-section">
            <h1>Hansel & Gretel</h1>
            <p>Scroll down or use arrow keys to explore</p>
            {showScrollIndicator && (
              <div
                className="scroll-indicator"
                onClick={() =>
                  window.scrollBy({ top: 200, behavior: 'smooth' })
                }
              >
                ↓
              </div>
            )}
          </section>

          <div ref={aboutRef} className="about-content">
            <div className="about-text">
              <h2>About Us</h2>
              <p>An interactive retelling of the classic fairy tale featuring:</p>
              <ul>
                <li>Immersive 3D scenes</li>
                <li>Dynamic storytelling</li>
                <li>Beautiful visual effects</li>
                <li>Keyboard and mouse navigation</li>
              </ul>
            </div>
            <img
              src="assets/arp.jpg"
              alt="Hansel and Gretel Illustration"
              className={`about-image ${aboutVisible ? 'visible' : ''}`}
            />
          </div>
        </div>
      ) : (
        <div className={`story-scene-wrapper ${isPageVisible ? 'fade-in' : ''}`}>
          <div className="parallax-container">
            <div
              className="parallax-background"
              style={{
                backgroundImage: `url(/assets/page-bg-${page}.jpg)`,
              }}
            />
            <div className="parallax-foreground" />
            <SceneCanvas page={page} />
            <div className="subtitle">{getSubtitleForPage(page)}</div>
          </div>
        </div>
      )}

      {/* Page Navigation Buttons */}
      {page > 0 && (
        <div className="story-nav">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1}
          >
            ◀
          </button>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page >= totalPages}
          >
            ▶
          </button>
        </div>
      )}

      {/* Progress Bar */}
      {page > 0 && (
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${(page / totalPages) * 100}%` }}
          />
        </div>
      )}

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button className="scroll-to-top" onClick={scrollToTop}>
          ↑
        </button>
      )}

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <a
            href="https://www.facebook.com/upwork.dilkumar"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-link"
          >
            <FaFacebookF size={18} style={{ marginRight: '0.5rem' }} />
            Facebook
          </a>
          <a
            href="https://wa.me/9779861404322"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-link"
          >
            <FaWhatsapp size={18} style={{ marginRight: '0.5rem' }} />
            WhatsApp
          </a>
        </div>
      </footer>
    </div>
  );
}

function getSubtitleForPage(page) {
  const story = {
    1: 'In a poor village, Hansel and Gretel are led into the forest by their parents...',
    2: 'Their stepmother learns of the trick. The second time, Hansel drops breadcrumbs...',
    3: 'Starving and lost, they wander deeper into the dark woods...',
    4: 'A kind old woman welcomes them into her candy-covered cottage...',
    5: 'At night, the woman reveals her true form - a wicked witch...',
    6: 'Gretel sneaks into the dungeon where Hansel is imprisoned...',
    7: 'To save her brother, Gretel must outsmart the witch...',
    8: 'Hansel returns home alone, forever changed by his ordeal...',
  };
  return story[page] || '';
}
