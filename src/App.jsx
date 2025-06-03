import { useEffect, useRef, useState } from 'react';
import SceneCanvas from './components/SceneCanvas';
import './index.css';

export default function App() {
  const totalPages = 8;
  const [page, setPage] = useState(0);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [aboutVisible, setAboutVisible] = useState(false);
  const [isPageVisible, setPageVisible] = useState(false);
  const aboutRef = useRef(null);

  useEffect(() => {
    const handleKey = (e) => {
      if (page > 0) {
        if (e.key === 'ArrowRight' && page < totalPages) setPage((p) => p + 1);
        else if (e.key === 'ArrowLeft' && page > 1) setPage((p) => p - 1);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [page]);

  useEffect(() => {
    if (!aboutRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => setAboutVisible(entry.isIntersecting),
      { threshold: 0.3 }
    );
    observer.observe(aboutRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (page > 0) {
      setPageVisible(false);
      const timeout = setTimeout(() => setPageVisible(true), 30);
      return () => clearTimeout(timeout);
    }
  }, [page]);

  const handlePageClick = (p) => {
    setPage(p);
    setDropdownOpen(false);
  };

  const scrollToAbout = () => {
    if (aboutRef.current) {
      aboutRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="canvas-wrapper scrollable-home">
      {/* Navbar */}
      <nav className="navbar">
        <button onClick={() => setPage(0)}>Home</button>

        <div
          className="custom-dropdown"
          onMouseEnter={() => page > 0 && setDropdownOpen(true)}
          onMouseLeave={() => setDropdownOpen(false)}
        >
          <div
            className="dropdown-label"
            onClick={() => {
              if (page === 0) {
                setPage(1);
                setTimeout(() => setDropdownOpen(true), 200);
              }
            }}
          >
            {page === 0 ? 'Story' : `Page ${page} ▾`}
          </div>

          <div className={`dropdown-options-wrapper ${dropdownOpen ? 'open' : ''}`}>
            {dropdownOpen && (
              <div className="dropdown-options">
                {[...Array(totalPages).keys()].map((p) => {
                  const pageNum = p + 1;
                  return (
                    <button
                      key={pageNum}
                      className={`dropdown-option ${page === pageNum ? 'active' : ''}`}
                      onClick={() => handlePageClick(pageNum)}
                    >
                      Page {pageNum}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <button onClick={scrollToAbout}>About Us</button>

        <a href="/contact" target="_blank" rel="noopener noreferrer">
          <button>Contact Us</button>
        </a>
      </nav>

      {page === 0 ? (
        <div className={`home-scroll-wrapper`}>
          {/* Home Content */}
          <section className="home-content-static">
            <h1>Welcome to Hansel & Gretel</h1>
            <p>Use the navigation bar or start the story below.</p>
            <button className="start-button" onClick={() => setPage(1)}>
              Start Story
            </button>
          </section>

          {/* About Us */}
          <section className={`about-plain-text ${aboutVisible ? 'visible' : ''}`}>
            <h2>About Us</h2>
            <div className="about-content">
              <div className="about-text">
                <p>Welcome to our Hansel & Gretel Storybook! This experience blends 3D storytelling...</p>
                <p>We’re a team of indie creators inspired by timeless folklore...</p>
              </div>
              <div className="about-image">
                <img src="/arp.jpg" alt="About visual" />
              </div>
            </div>
          </section>

        </div>
      ) : (
        isPageVisible && (
          <div className="story-scene-wrapper fade-in">
            <SceneCanvas page={page} />
            <div className="subtitle">{getSubtitleForPage(page)}</div>
            <div className="story-nav">
              <button
                className="nav-button"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                ◀
              </button>
              <button
                className="nav-button"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              >
                ▶
              </button>
            </div>
          </div>
        )
      )}

      {/* Progress Bar */}
      {page > 0 && (
        <div className="progress-bar visible">
          <div
            className="progress-fill"
            style={{ width: `${(page / totalPages) * 100}%` }}
          />
        </div>
      )}

      {/* Footer only on Home */}
      {page === 0 && (
        <footer className="footer">
          <a href="https://www.facebook.com/upwork.dilkumar" target="_blank" rel="noopener noreferrer" className="footer-link">
            <img src="https://cdn-icons-png.flaticon.com/512/733/733547.png" alt="Facebook" className="footer-icon" />
            /upwork.dilkumar
          </a>
        </footer>
      )}
    </div>
  );
}

function getSubtitleForPage(page) {
  const story = {
    1: "In a poor village, Hansel and Gretel are led into the forest by their parents...",
    2: "Their stepmother learns of the trick. The second time, Hansel drops breadcrumbs...",
    3: "Starving and lost, they wander deeper...",
    4: "A kind old woman welcomes them...",
    5: "At night, the woman reveals her true form — a witch...",
    6: "Gretel sneaks into the dungeon...",
    7: "To save her brother, Gretel pierces her own heart...",
    8: "Hansel returns home alone...",
  };
  return story[page] || '';
}
