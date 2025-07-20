// src/components/ParallaxScene.jsx
import React, { useEffect, useRef } from 'react';
import './ParallaxScene.css';

export default function ParallaxScene({ backgroundImage, title, subtitle, children }) {
  const bgRef = useRef();

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      if (bgRef.current) {
        bgRef.current.style.transform = `translateY(${offset * 0.4}px)`;
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="parallax-scene">
      <div
        className="scene-background"
        ref={bgRef}
        style={{ backgroundImage: `url(${backgroundImage})` }}
      />
      <div className="scene-content">
        {title && <h2 className="scene-title">{title}</h2>}
        {subtitle && <p className="scene-subtitle">{subtitle}</p>}
        <div className="scene-body">{children}</div>
      </div>
    </div>
  );
}
