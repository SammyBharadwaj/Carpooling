import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

const LoginPage = () => {
  const { signInWithGoogle, error } = useAuth();
  const [loading, setLoading] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const [nameError, setNameError] = useState('');

  const handleSignIn = async () => {
    // Validate name
    if (!displayName.trim()) {
      setNameError('Please enter your name first!');
      return;
    }

    try {
      setLoading(true);
      setNameError('');
      await signInWithGoogle();
      // Store the display name in localStorage to use after auth
      localStorage.setItem('pendingDisplayName', displayName.trim());
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

          .warm-cream-bg {
            background:
              linear-gradient(180deg,
                rgba(255, 200, 180, 0.15) 0%,
                rgba(255, 180, 150, 0.08) 50%,
                rgba(240, 160, 130, 0.05) 100%
              ),
              linear-gradient(180deg, #F5F1ED 0%, #E8E2DC 50%, #DDD7D1 100%);
            position: relative;
          }

          .deep-forest {
            color: #3D405B;
          }

          .pixel-button {
            background: linear-gradient(135deg, #FF6B4A 0%, #E85D3C 100%);
            border: 5px solid #3D405B;
            box-shadow:
              6px 6px 0px #3D405B,
              0 0 30px rgba(255, 107, 74, 0.6),
              inset 0 -2px 10px rgba(0, 0, 0, 0.2),
              inset 0 2px 10px rgba(255, 255, 255, 0.3);
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
            transform: translateY(-4px) translateX(-2px);
            box-shadow:
              10px 10px 0px #3D405B,
              0 0 50px rgba(255, 107, 74, 0.9),
              inset 0 -2px 10px rgba(0, 0, 0, 0.2),
              inset 0 2px 10px rgba(255, 255, 255, 0.4);
            filter: brightness(1.15) saturate(1.2);
          }

          .pixel-button:active {
            transform: translateY(3px) translateX(3px);
            box-shadow:
              3px 3px 0px #3D405B,
              0 0 20px rgba(255, 107, 74, 0.7);
          }

          .pixel-button:disabled {
            opacity: 0.4;
            cursor: not-allowed;
            transform: none;
            filter: grayscale(0.8);
          }

          .retro-input {
            background: rgba(255, 255, 255, 0.98);
            border: 4px solid #3D405B;
            border-radius: 0px;
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

          .retro-input:focus {
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

          .retro-input:active {
            box-shadow:
              2px 2px 0px 0px #3D405B,
              inset 0 2px 4px rgba(0, 0, 0, 0.1);
            transform: translate(2px, 2px);
          }

          .retro-input::placeholder {
            color: rgba(61, 64, 91, 0.4);
            font-style: italic;
          }

          .neon-title {
            color: #FF6B4A;
            text-shadow: 2px 2px 0px rgba(61, 64, 91, 0.8);
            transition: text-shadow 0.3s ease;
          }

          .neon-title:hover {
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

          .punk-border {
            border-width: 5px;
            border-style: solid;
            position: relative;
          }

          .shadow-retro-lg {
            box-shadow: 8px 8px 0px #3D405B;
          }

          @keyframes cardFloat {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-8px); }
          }

          .card-float {
            animation: cardFloat 6s ease-in-out infinite;
          }

          .shine-effect {
            position: relative;
            overflow: hidden;
          }

          .shine-effect::after {
            content: '';
            position: absolute;
            top: -50%;
            right: -50%;
            bottom: -50%;
            left: -50%;
            background: linear-gradient(to bottom, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.1) 50%, rgba(255, 255, 255, 0) 100%);
            transform: rotateZ(45deg) translate(-100%, 0);
            transition: transform 0.6s;
          }

          .shine-effect:hover::after {
            transform: rotateZ(45deg) translate(100%, 0);
          }

          @keyframes glitch {
            0% { text-shadow: 2px 2px 0px rgba(61, 64, 91, 0.8); }
            20% { text-shadow: -2px -2px 0px rgba(61, 64, 91, 0.8); }
            40% { text-shadow: 2px -2px 0px rgba(61, 64, 91, 0.8); }
            60% { text-shadow: -2px 2px 0px rgba(61, 64, 91, 0.8); }
            80% { text-shadow: 2px 2px 0px rgba(61, 64, 91, 0.8); }
            100% { text-shadow: 2px 2px 0px rgba(61, 64, 91, 0.8); }
          }

          .glitch {
            position: relative;
          }

          .glitch:hover {
            animation: glitch 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94) both infinite;
          }
        `}
      </style>
      <div className="mono-font warm-cream-bg min-h-screen flex items-center justify-center p-4">
        <div className="max-w-2xl w-full">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="pixel-font text-7xl font-bold mb-2 neon-title glitch" data-text="SHOTGUN.AI" style={{
              letterSpacing: '0.1em'
            }}>
              SHOTGUN.AI
            </h1>
            <p className="text-lg future-font uppercase tracking-wider" style={{
              color: '#FF6B4A',
              textShadow: '0 0 15px rgba(255, 107, 74, 0.8), 0 0 30px rgba(255, 107, 74, 0.4)',
              fontWeight: '700'
            }}>
              ⚡ Making Carpooling Fair ⚡
            </p>
          </div>

          {/* Login Card */}
          <div className="rounded-lg punk-border shadow-retro-lg p-8 mb-6 card-float shine-effect bg-gradient-to-br from-white to-[#FDF8F3] border-[#3D405B]">
            <h2 className="pixel-font text-4xl deep-forest mb-6" style={{
              textShadow: '2px 2px 0px rgba(224, 122, 95, 0.2)'
            }}>WELCOME</h2>

            {/* Name Input */}
            <div className="mb-6">
              <label className="block text-sm font-bold deep-forest mb-2">
                NAME
              </label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => {
                  setDisplayName(e.target.value);
                  setNameError('');
                }}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleSignIn();
                  }
                }}
                className="retro-input w-full px-4 py-2 rounded"
                placeholder="Enter your name..."
                disabled={loading}
              />
              {nameError && (
                <p className="text-red-600 text-sm font-bold mt-2">
                  {nameError}
                </p>
              )}
            </div>

            {/* Sign In Button */}
            <button
              onClick={handleSignIn}
              disabled={loading}
              className="pixel-button w-full py-3 rounded-lg text-white pixel-font text-2xl"
            >
              {loading ? 'SIGNING IN...' : 'SIGN IN WITH GOOGLE'}
            </button>

            {error && (
              <div className="punk-border p-3 bg-red-50 mt-4">
                <p className="text-red-600 text-center text-sm font-bold">
                  {error}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
