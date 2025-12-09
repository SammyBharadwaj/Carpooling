import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

const LoginPage = () => {
  const { signInWithGoogle, error } = useAuth();
  const [loading, setLoading] = useState(false);
  const [isLightMode, setIsLightMode] = useState(false);

  const handleSignIn = async () => {
    try {
      setLoading(true);
      await signInWithGoogle();
    } catch (error) {
      console.error('Sign in error:', error);
    } finally {
      setLoading(false);
    }
  };

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

          /* CRT TV Container */
          .tv-container {
            background: linear-gradient(180deg, #2a2a2a 0%, #1a1a1a 50%, #0a0a0a 100%);
            border-radius: 20px 20px 8px 8px;
            padding: 40px 50px 100px 50px;
            box-shadow:
              0 0 0 8px #3a3a3a,
              0 0 0 12px #1a1a1a,
              0 30px 80px rgba(0, 0, 0, 0.8),
              inset 0 0 60px rgba(0, 0, 0, 0.5);
            position: relative;
            max-width: 900px;
            margin: 0 auto;
          }

          /* TV Screen Bezel */
          .tv-screen-bezel {
            background: linear-gradient(145deg, #1a1a1a 0%, #2a2a2a 50%, #1a1a1a 100%);
            padding: 30px;
            border-radius: 12px;
            box-shadow:
              inset 0 0 30px rgba(0, 0, 0, 0.8),
              inset 0 0 60px rgba(0, 0, 0, 0.6);
            position: relative;
          }

          /* CRT Screen with curve effect - Dark Mode */
          .crt-screen-dark {
            background:
              radial-gradient(ellipse at center,
                rgba(180, 200, 220, 0.03) 0%,
                rgba(100, 120, 140, 0.05) 50%,
                rgba(40, 50, 60, 0.1) 100%
              ),
              linear-gradient(180deg, #0a0a0a 0%, #050505 100%);
            border-radius: 8px;
            padding: 60px 50px;
            position: relative;
            overflow: hidden;
            box-shadow:
              inset 0 0 100px rgba(100, 150, 200, 0.1),
              inset 0 0 30px rgba(150, 180, 210, 0.15);
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
            padding: 60px 50px;
            position: relative;
            overflow: hidden;
            box-shadow:
              inset 0 0 100px rgba(200, 180, 150, 0.2),
              inset 0 0 30px rgba(210, 190, 170, 0.25);
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

          /* TV Brand Badge */
          .tv-brand {
            position: absolute;
            bottom: 30px;
            left: 50%;
            transform: translateX(-50%);
            font-family: 'Orbitron', sans-serif;
            font-size: 11px;
            letter-spacing: 2px;
            color: #666;
            font-weight: 700;
          }

          /* Screen Content Styling */
          .screen-content {
            position: relative;
            z-index: 5;
          }

          .deep-forest {
            color: #FF6B4A;
          }

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

          /* Dark Mode Input */
          .retro-input-dark {
            background: rgba(20, 20, 20, 0.8);
            border: 3px solid #FF6B4A;
            border-radius: 4px;
            font-family: 'IBM Plex Mono', 'Courier New', monospace;
            font-weight: 500;
            color: #FF6B4A;
            transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
            box-shadow:
              0 0 15px rgba(255, 107, 74, 0.3),
              inset 0 2px 8px rgba(0, 0, 0, 0.6);
            position: relative;
            height: 48px;
          }

          .retro-input-dark:focus {
            outline: none;
            border-color: #FF8B6A;
            background: rgba(30, 30, 30, 0.9);
            color: #FF8B6A;
            box-shadow:
              0 0 25px rgba(255, 107, 74, 0.6),
              0 0 50px rgba(255, 107, 74, 0.3),
              inset 0 2px 8px rgba(0, 0, 0, 0.6);
          }

          .retro-input-dark::placeholder {
            color: rgba(255, 107, 74, 0.4);
            font-style: italic;
          }

          /* Light Mode Input */
          .retro-input-light {
            background: rgba(255, 255, 255, 0.95);
            border: 4px solid #3D405B;
            border-radius: 4px;
            font-family: 'IBM Plex Mono', 'Courier New', monospace;
            font-weight: 500;
            color: #3D405B;
            transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
            box-shadow:
              4px 4px 0px 0px #3D405B,
              inset 0 2px 4px rgba(0, 0, 0, 0.05);
            position: relative;
            height: 48px;
          }

          .retro-input-light:focus {
            outline: none;
            border-color: #FF6B4A;
            background: #FFFFFF;
            color: #3D405B;
            box-shadow:
              6px 6px 0px 0px #FF6B4A,
              0 0 30px rgba(255, 107, 74, 0.4),
              inset 0 2px 4px rgba(0, 0, 0, 0.05);
            transform: translate(-1px, -1px);
          }

          .retro-input-light::placeholder {
            color: rgba(61, 64, 91, 0.4);
            font-style: italic;
          }

          /* Dark Mode Title */
          .neon-title-dark {
            color: #FF6B4A;
            text-shadow:
              0 0 10px rgba(255, 107, 74, 0.8),
              0 0 20px rgba(255, 107, 74, 0.6),
              0 0 30px rgba(255, 107, 74, 0.4),
              0 0 40px rgba(255, 107, 74, 0.2);
            transition: text-shadow 0.3s ease;
          }

          .neon-title-dark:hover {
            text-shadow:
              0 0 15px rgba(255, 107, 74, 1),
              0 0 30px rgba(255, 107, 74, 0.8),
              0 0 45px rgba(255, 107, 74, 0.6),
              0 0 60px rgba(255, 107, 74, 0.4);
            animation: flicker 3s infinite alternate;
          }

          /* Light Mode Title */
          .neon-title-light {
            color: #FF6B4A;
            text-shadow: 2px 2px 0px rgba(61, 64, 91, 0.8);
            transition: text-shadow 0.3s ease;
          }

          .neon-title-light:hover {
            text-shadow:
              0 0 10px rgba(255, 107, 74, 0.8),
              0 0 20px rgba(255, 107, 74, 0.6),
              0 0 30px rgba(255, 107, 74, 0.4),
              0 0 40px rgba(255, 107, 74, 0.2),
              2px 2px 0px rgba(61, 64, 91, 0.8);
            animation: flicker 3s infinite alternate;
          }

          @keyframes flicker {
            0%, 100% { opacity: 1; }
            41%, 43% { opacity: 0.95; }
            45% { opacity: 0.98; }
            47% { opacity: 0.96; }
            50% { opacity: 1; }
          }

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
      <div className="mono-font min-h-screen flex items-center justify-center p-4 md:p-8" style={{
        background: 'linear-gradient(180deg, #1a1a1a 0%, #0a0a0a 100%)'
      }}>
        {/* CRT TV */}
        <div className="tv-container">
          {/* Screen Bezel */}
          <div className="tv-screen-bezel">
            {/* CRT Screen */}
            <div className={isLightMode ? "crt-screen-light" : "crt-screen-dark"}>
              <div className="screen-content" style={{ border: 'none' }}>
                {/* Header */}
                <div className="text-center mb-8" style={{ border: 'none' }}>
                  <h1 className={`pixel-font text-6xl md:text-7xl font-bold mb-2 glitch ${isLightMode ? 'neon-title-light' : 'neon-title-dark'}`} data-text="SHOTGUN.AI" style={{
                    letterSpacing: '0.1em'
                  }}>
                    SHOTGUN.AI
                  </h1>
                  <p className="text-base md:text-lg future-font uppercase tracking-wider" style={{
                    color: '#FF6B4A',
                    textShadow: isLightMode
                      ? '0 0 8px rgba(255, 107, 74, 0.4), 0 0 15px rgba(255, 107, 74, 0.2)'
                      : '0 0 15px rgba(255, 107, 74, 0.8), 0 0 30px rgba(255, 107, 74, 0.4)',
                    fontWeight: '700'
                  }}>
                    ⚡ Making Carpooling Fair ⚡
                  </p>
                </div>

                {/* Login Card */}
                <div className="max-w-md mx-auto px-4" style={{ border: 'none' }}>
                  <h2 className="pixel-font text-3xl sm:text-4xl md:text-5xl mb-4 sm:mb-6 text-center" style={{
                    color: isLightMode ? '#3D405B' : '#FF6B4A',
                    textShadow: isLightMode
                      ? '2px 2px 0px rgba(224, 122, 95, 0.2)'
                      : '0 0 10px rgba(255, 107, 74, 0.6)'
                  }}>WELCOME</h2>

                  <div className="mb-6">
                    <p className="mono-font text-center text-xs mb-4" style={{
                      color: isLightMode ? '#666' : '#AAA'
                    }}>
                      Sign in with your Google account to get started
                    </p>
                  </div>

                  {/* Sign In Button */}
                  <button
                    onClick={handleSignIn}
                    disabled={loading}
                    className="pixel-button w-full py-3 rounded-lg text-white pixel-font text-xl md:text-2xl"
                  >
                    {loading ? 'SIGNING IN...' : 'SIGN IN WITH GOOGLE'}
                  </button>

                  {error && (
                    <div className="p-3 mt-4" style={{
                      background: 'rgba(239, 68, 68, 0.2)',
                      border: '2px solid rgba(239, 68, 68, 0.6)',
                      borderRadius: '4px'
                    }}>
                      <p className="text-red-500 text-center text-sm font-bold" style={{
                        textShadow: '0 0 10px rgba(239, 68, 68, 0.8)'
                      }}>
                        {error}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* TV Controls */}
          <div className="tv-controls">
            <div className="tv-knob" title="Volume"></div>
            <div
              className="tv-knob tv-knob-clickable"
              title={`Switch to ${isLightMode ? 'Dark' : 'Light'} Mode`}
              onClick={() => setIsLightMode(!isLightMode)}
            ></div>
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

export default LoginPage;
