import React, { useEffect, useState } from "react";

const bgImages = [
  "/auth_form_bg-1.jpg",
  "/auth_form_bg-2.jpg",
  "/auth_form_bg-3.jpg",
];

const FADE_DURATION = 2000; // ms
const ROTATE_INTERVAL = 6000; // ms

export default function AuthBackgroundRotator() {
  const [currentBg, setCurrentBg] = useState(0);
  const [nextBg, setNextBg] = useState(1);
  const [fade, setFade] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(true);
      setTimeout(() => {
        setCurrentBg(nextBg);
        setNextBg((nextBg + 1) % bgImages.length);
        setFade(false);
      }, FADE_DURATION);
    }, ROTATE_INTERVAL);
    return () => clearInterval(interval);
  }, [nextBg]);

  // Preload images
  useEffect(() => {
    bgImages.forEach((src) => {
      const img = new window.Image();
      img.src = src;
    });
  }, []);

  return (
    <>
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          backgroundImage: `url(${bgImages[currentBg]})`,
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          opacity: fade ? 0 : 1,
          zIndex: -2,
          pointerEvents: "none",
          transition: `opacity ${FADE_DURATION}ms ease`,
        }}
      />
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          backgroundImage: `url(${bgImages[nextBg]})`,
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          opacity: fade ? 1 : 0,
          zIndex: -1,
          pointerEvents: "none",
          transition: `opacity ${FADE_DURATION}ms ease`,
        }}
      />
    </>
  );
} 