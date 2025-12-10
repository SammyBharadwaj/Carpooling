import { useState } from 'react';

const TVWrapper = ({ children, showThemeToggle = false, initialDarkMode = false }) => {
  const [isLightMode, setIsLightMode] = useState(!initialDarkMode);

  return (
    <>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=VT323&family=IBM+Plex+Mono:wght@400;600;700&family=Orbitron:wght@400;700;900&display=swap');

          .pixel-font {
            font-family: 'VT323', monospace;
            letter-spacing: 2px;
            text-rendering: geometricPrecision;
          }

          .mono-font {
            font-family: 'IBM Plex Mono', 'Courier New', monospace;
            line-height: 1.6;
          }

          .future-font {
            font-family: 'Orbitron', sans-serif;
            letter-spacing: 0.05em;
          }

          /* Glitch Animation */
          .glitch {
            position: relative;
          }

          .glitch:hover {
            animation: glitch 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94) both infinite;
          }

          @keyframes glitch {
            0% { transform: translate(0); }
            20% { transform: translate(-2px, 2px); }
            40% { transform: translate(-2px, -2px); }
            60% { transform: translate(2px, 2px); }
            80% { transform: translate(2px, -2px); }
            100% { transform: translate(0); }
          }

          /* Pixel Button */
          .pixel-button {
            background: linear-gradient(135deg, #FF6B4A 0%, #E85D3C 100%);
            border: 4px solid #FF6B4A;
            box-shadow:
              0 0 20px rgba(255, 107, 74, 0.6),
              0 0 40px rgba(255, 107, 74, 0.4),
              inset 0 -2px 10px rgba(0, 0, 0, 0.3),
              inset 0 2px 10px rgba(255, 255, 255, 0.2);
            transition: all 0.15s cubic-bezier(0.4, 0, 0.2, 1);
            cursor: pointer;
            text-transform: uppercase;
            letter-spacing: 3px;
            position: relative;
            overflow: hidden;
          }

          .pixel-button::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
            transition: left 0.5s;
          }

          .pixel-button:hover::before {
            left: 100%;
          }

          .pixel-button:hover {
            box-shadow:
              0 0 30px rgba(255, 107, 74, 0.9),
              0 0 60px rgba(255, 107, 74, 0.6),
              inset 0 -2px 10px rgba(0, 0, 0, 0.3),
              inset 0 2px 10px rgba(255, 255, 255, 0.3);
            filter: brightness(1.2) saturate(1.3);
            transform: scale(1.02);
          }

          .pixel-button:active {
            transform: scale(0.98);
            box-shadow:
              0 0 15px rgba(255, 107, 74, 0.7),
              0 0 30px rgba(255, 107, 74, 0.4);
          }

          .pixel-button:disabled {
            opacity: 0.4;
            cursor: not-allowed;
            transform: none;
            filter: grayscale(0.8);
          }

          /* Secondary Button */
          .pixel-button-secondary {
            background: linear-gradient(135deg, #6B6B6B 0%, #4A4A4A 100%);
            border: 4px solid #6B6B6B;
            box-shadow:
              0 0 20px rgba(107, 107, 107, 0.6),
              0 0 40px rgba(107, 107, 107, 0.4),
              inset 0 -2px 10px rgba(0, 0, 0, 0.3),
              inset 0 2px 10px rgba(255, 255, 255, 0.2);
            transition: all 0.15s cubic-bezier(0.4, 0, 0.2, 1);
            cursor: pointer;
            text-transform: uppercase;
            letter-spacing: 3px;
            position: relative;
            overflow: hidden;
          }

          .pixel-button-secondary:hover {
            box-shadow:
              0 0 30px rgba(107, 107, 107, 0.9),
              0 0 60px rgba(107, 107, 107, 0.6),
              inset 0 -2px 10px rgba(0, 0, 0, 0.3),
              inset 0 2px 10px rgba(255, 255, 255, 0.3);
            filter: brightness(1.2);
            transform: scale(1.02);
          }

          .pixel-button-secondary:active {
            transform: scale(0.98);
          }

          .pixel-button-secondary:disabled {
            opacity: 0.4;
            cursor: not-allowed;
            transform: none;
            filter: grayscale(0.8);
          }

          /* CRT TV Container */
          .tv-container {
            background: linear-gradient(180deg, #2a2a2a 0%, #1a1a1a 50%, #0a0a0a 100%);
            border-radius: 20px 20px 8px 8px;
            padding: 10px 10px 60px 10px;
            box-shadow:
              0 0 0 8px #3a3a3a,
              0 0 0 12px #1a1a1a,
              0 30px 80px rgba(0, 0, 0, 0.8),
              inset 0 0 60px rgba(0, 0, 0, 0.5);
            position: relative;
            max-width: 100%;
            width: 98%;
            margin: 0 auto;
          }

          @media (min-width: 640px) {
            .tv-container {
              padding: 20px 25px 80px 25px;
              max-width: 95%;
            }
          }

          @media (min-width: 768px) {
            .tv-container {
              padding: 30px 40px 90px 40px;
              max-width: 1200px;
            }
          }

          @media (min-width: 1024px) {
            .tv-container {
              padding: 40px 50px 100px 50px;
              max-width: 1400px;
            }
          }

          /* TV Screen Bezel */
          .tv-screen-bezel {
            background: linear-gradient(145deg, #1a1a1a 0%, #2a2a2a 50%, #1a1a1a 100%);
            padding: 8px;
            border-radius: 12px;
            box-shadow:
              inset 0 0 30px rgba(0, 0, 0, 0.8),
              inset 0 0 60px rgba(0, 0, 0, 0.6);
            position: relative;
          }

          @media (min-width: 640px) {
            .tv-screen-bezel {
              padding: 15px;
            }
          }

          @media (min-width: 768px) {
            .tv-screen-bezel {
              padding: 20px;
            }
          }

          @media (min-width: 1024px) {
            .tv-screen-bezel {
              padding: 30px;
            }
          }

          /* CRT Screen - Dark Mode */
          .crt-screen-dark {
            background:
              radial-gradient(ellipse at center,
                rgba(180, 200, 220, 0.03) 0%,
                rgba(100, 120, 140, 0.05) 50%,
                rgba(40, 50, 60, 0.1) 100%
              ),
              linear-gradient(180deg, #0a0a0a 0%, #050505 100%);
            border-radius: 8px;
            padding: 15px 10px;
            position: relative;
            overflow: hidden;
            box-shadow:
              inset 0 0 100px rgba(100, 150, 200, 0.1),
              inset 0 0 30px rgba(150, 180, 210, 0.15);
            min-height: 60vh;
          }

          @media (min-width: 640px) {
            .crt-screen-dark {
              padding: 25px 18px;
              min-height: 65vh;
            }
          }

          @media (min-width: 768px) {
            .crt-screen-dark {
              padding: 35px 25px;
              min-height: 70vh;
            }
          }

          @media (min-width: 1024px) {
            .crt-screen-dark {
              padding: 40px 30px;
            }
          }

          /* CRT Screen - Light Mode */
          .crt-screen-light {
            background:
              radial-gradient(ellipse at center,
                rgba(255, 240, 220, 0.3) 0%,
                rgba(255, 250, 240, 0.5) 50%,
                rgba(245, 240, 230, 0.7) 100%
              ),
              linear-gradient(180deg, #F5F1ED 0%, #E8E2DC 100%);
            border-radius: 8px;
            padding: 15px 10px;
            position: relative;
            overflow: hidden;
            box-shadow:
              inset 0 0 100px rgba(200, 180, 150, 0.2),
              inset 0 0 30px rgba(210, 190, 170, 0.25);
            min-height: 60vh;
          }

          @media (min-width: 640px) {
            .crt-screen-light {
              padding: 25px 18px;
              min-height: 65vh;
            }
          }

          @media (min-width: 768px) {
            .crt-screen-light {
              padding: 35px 25px;
              min-height: 70vh;
            }
          }

          @media (min-width: 1024px) {
            .crt-screen-light {
              padding: 40px 30px;
            }
          }

          /* CRT Glass reflection */
          .crt-screen-dark::before,
          .crt-screen-light::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(
              135deg,
              rgba(255, 255, 255, 0.15) 0%,
              transparent 20%,
              transparent 80%,
              rgba(255, 255, 255, 0.05) 100%
            );
            border-radius: 8px;
            pointer-events: none;
          }

          /* Scanlines */
          .crt-screen-dark::after,
          .crt-screen-light::after {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: repeating-linear-gradient(
              0deg,
              rgba(0, 0, 0, 0.15) 0px,
              rgba(0, 0, 0, 0.15) 1px,
              transparent 1px,
              transparent 2px
            );
            pointer-events: none;
            animation: scanlines 8s linear infinite;
            z-index: 10;
          }

          @keyframes scanlines {
            0% { transform: translateY(0); }
            100% { transform: translateY(4px); }
          }

          /* Screen Content Styling */
          .screen-content {
            position: relative;
            z-index: 5;
          }

          /* TV Controls Panel */
          .tv-controls {
            position: absolute;
            bottom: 20px;
            right: 50px;
            display: flex;
            gap: 15px;
            align-items: center;
          }

          .tv-knob {
            width: 50px;
            height: 50px;
            background: radial-gradient(circle at 30% 30%, #4a4a4a, #1a1a1a);
            border-radius: 50%;
            border: 3px solid #0a0a0a;
            box-shadow:
              0 4px 8px rgba(0, 0, 0, 0.6),
              inset 0 2px 4px rgba(255, 255, 255, 0.1);
            position: relative;
          }

          .tv-knob::after {
            content: '';
            position: absolute;
            top: 8px;
            left: 50%;
            transform: translateX(-50%);
            width: 3px;
            height: 15px;
            background: #666;
            border-radius: 2px;
          }

          .tv-knob-clickable {
            cursor: pointer;
            transition: all 0.2s ease;
          }

          .tv-knob-clickable:hover {
            transform: scale(1.1);
            box-shadow:
              0 6px 12px rgba(0, 0, 0, 0.8),
              inset 0 2px 6px rgba(255, 255, 255, 0.2);
          }

          .tv-knob-clickable:active {
            transform: scale(0.95) rotate(45deg);
          }

          /* Speaker Grille */
          .tv-speaker {
            position: absolute;
            bottom: 20px;
            left: 50px;
            width: 200px;
            height: 60px;
            background: #0a0a0a;
            border-radius: 4px;
            border: 2px solid #1a1a1a;
            box-shadow: inset 0 2px 8px rgba(0, 0, 0, 0.8);
            display: grid;
            grid-template-columns: repeat(20, 1fr);
            gap: 3px;
            padding: 8px;
          }

          .speaker-hole {
            background: #050505;
            border-radius: 50%;
            box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.9);
          }

          /* Power indicator */
          .power-led {
            position: absolute;
            bottom: 45px;
            right: 120px;
            width: 12px;
            height: 12px;
            background: #00ff00;
            border-radius: 50%;
            box-shadow:
              0 0 10px #00ff00,
              0 0 20px #00ff00,
              inset 0 0 5px rgba(255, 255, 255, 0.5);
            animation: pulse 2s ease-in-out infinite;
          }

          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.6; }
          }
        `}
      </style>
      <div className="min-h-screen flex items-center justify-center p-4 md:p-8" style={{
        background: 'linear-gradient(180deg, #1a1a1a 0%, #0a0a0a 100%)'
      }}>
        {/* CRT TV */}
        <div className="tv-container">
          {/* Screen Bezel */}
          <div className="tv-screen-bezel">
            {/* CRT Screen */}
            <div className={isLightMode ? "crt-screen-light" : "crt-screen-dark"}>
              <div className="screen-content">
                {typeof children === 'function' ? children(isLightMode) : children}
              </div>
            </div>
          </div>

          {/* TV Controls */}
          <div className="tv-controls">
            <div className="tv-knob" title="Volume"></div>
            {showThemeToggle && (
              <div
                className="tv-knob tv-knob-clickable"
                title={`Switch to ${isLightMode ? 'Dark' : 'Light'} Mode`}
                onClick={() => setIsLightMode(!isLightMode)}
              ></div>
            )}
          </div>

          {/* Power LED */}
          <div className="power-led" title="Power"></div>

          {/* Speaker Grille */}
          <div className="tv-speaker">
            {[...Array(40)].map((_, i) => (
              <div key={i} className="speaker-hole"></div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default TVWrapper;
