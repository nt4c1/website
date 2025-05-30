import { useEffect, useState } from 'react';
import SceneCanvas from './components/SceneCanvas';
import './index.css';

export default function App() {
  const totalPages = 8;
  const [page, setPage] = useState(0);
  const [dropdownOpen, setDropdownOpen] = useState(false);

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

  const handlePageClick = (p) => {
    setPage(p);
    setDropdownOpen(false);
  };

  return (
    <div className="canvas-wrapper">
      {/* Navbar */}
      <nav className="navbar">
        <button onClick={() => setPage(0)}>Home</button>

        {/* Dropdown Menu */}
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

          <div
            className={`dropdown-options-wrapper ${dropdownOpen ? 'open' : ''
              }`}
          >
            {dropdownOpen && (
              <div className="dropdown-options">
                {[...Array(totalPages).keys()].slice(1).map((p) => {
                  const pageNum = p + 1;
                  return (
                    <button
                      key={pageNum}
                      className={`dropdown-option ${page === pageNum ? 'active' : ''
                        }`}
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

        <a href="/contact" target="_blank" rel="noopener noreferrer">
          <button>Contact Us</button>
        </a>
        <a href="/about.html" target="_blank" rel="noopener noreferrer">
          <button>About Us</button>
        </a>

      </nav>

      {/* Home Page */}
      {page === 0 ? (
        <div className="home-content">
          <h1>Welcome to Hansel & Gretel</h1>
          <p>Use the navigation bar or start the story below.</p>
          <button className="start-button" onClick={() => setPage(1)}>
            Start Story
          </button>
        </div>
      ) : (
        <>
          <SceneCanvas page={page} />
          <div className="page-indicator">
            Page {page} / {totalPages}
          </div>
          <div className="subtitle">{getSubtitleForPage(page)}</div>

          <div className="story-nav">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="nav-button"
              title="Previous Page"
            >
              ◀
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="nav-button"
              title="Next Page"
            >
              ▶
            </button>
          </div>
        </>
      )}
      {/* Progress Bar */}
      <div className="progress-bar">
        <div
          className="progress-fill"
          style={{ width: `${(page / totalPages) * 100}%` }}
        />
      </div>

      {/* Footer */}
      <footer className="footer">
        <a
          href="https://www.facebook.com/upwork.dilkumar"
          target="_blank"
          rel="noopener noreferrer"
          className="footer-link"
        >
          <img src="https://cdn-icons-png.flaticon.com/512/733/733547.png" alt="Facebook" className="footer-icon" />
          /upwork.dilkumar
        </a>
      </footer>

    </div>
  );
}

function getSubtitleForPage(page) {
  const story = {
    1: "In a poor village, Hansel and Gretel are led into the forest by their parents. Hansel drops glowing pebbles to mark the way back.",
    2: "Their stepmother learns of the trick. The second time, Hansel drops breadcrumbs — but birds eat them. The forest swallows them whole.",
    3: "Starving and lost, they wander deeper. A rotting candy house appears, lit by moonlight and mystery.",
    4: "A kind old woman welcomes them. She offers food and warmth. But her smile feels too wide, too sharp.",
    5: "At night, the woman reveals her true form — a witch. She steals Hansel’s soul, turning him to a silent skeleton.",
    6: "Gretel sneaks into the dungeon. She finds Hansel’s soul glowing inside a jar. The witch approaches.",
    7: "To save her brother, Gretel pierces her own heart, breaking the jar. Hansel awakens. Gretel fades into ash.",
    8: "Hansel returns home alone. He clutches Gretel’s pendant. The wind whispers her name, but she is gone forever.",
  };
  return story[page] || '';
}
