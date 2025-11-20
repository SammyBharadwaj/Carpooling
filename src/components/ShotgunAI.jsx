import React, { useState } from 'react';
import { Car, Zap, Trophy, Skull, Plus, User } from 'lucide-react';

const ShotgunAI = () => {
  const [players, setPlayers] = useState([
    { id: 1, name: 'Player 1', hp: 100 },
    { id: 2, name: 'Player 2', hp: 100 },
    { id: 3, name: 'Player 3', hp: 100 }
  ]);
  const [trips, setTrips] = useState([]);
  const [showBossModal, setShowBossModal] = useState(false);
  const [nextDriver, setNextDriver] = useState(null);

  // Form state
  const [newPlayerName, setNewPlayerName] = useState('');
  const [tripDriver, setTripDriver] = useState('');
  const [tripDistance, setTripDistance] = useState('');
  const [selectedPassengers, setSelectedPassengers] = useState([]);

  // Add new player
  const addPlayer = (e) => {
    e.preventDefault();
    if (!newPlayerName.trim()) return;

    const newPlayer = {
      id: Date.now(),
      name: newPlayerName,
      hp: 100
    };
    setPlayers([...players, newPlayer]);
    setNewPlayerName('');
  };

  // Toggle passenger selection
  const togglePassenger = (playerId) => {
    if (selectedPassengers.includes(playerId)) {
      setSelectedPassengers(selectedPassengers.filter(id => id !== playerId));
    } else {
      setSelectedPassengers([...selectedPassengers, playerId]);
    }
  };

  // Log a trip
  const logTrip = (e) => {
    e.preventDefault();
    if (!tripDriver || !tripDistance || selectedPassengers.length === 0) return;

    const distance = parseFloat(tripDistance);
    const hpChange = Math.round(distance * 5); // HP change based on distance

    // Update players HP
    const updatedPlayers = players.map(player => {
      if (player.id === parseInt(tripDriver)) {
        // Driver gains HP (heals)
        return { ...player, hp: Math.min(200, player.hp + hpChange) };
      } else if (selectedPassengers.includes(player.id)) {
        // Passengers lose HP (take damage)
        return { ...player, hp: Math.max(0, player.hp - hpChange) };
      }
      return player;
    });

    // Log the trip
    const driverName = players.find(p => p.id === parseInt(tripDriver))?.name;
    const passengerNames = players
      .filter(p => selectedPassengers.includes(p.id))
      .map(p => p.name)
      .join(', ');

    const newTrip = {
      id: Date.now(),
      driver: driverName,
      distance,
      passengers: passengerNames,
      hpChange,
      timestamp: new Date().toLocaleString()
    };

    setTrips([newTrip, ...trips]);
    setPlayers(updatedPlayers);

    // Reset form
    setTripDriver('');
    setTripDistance('');
    setSelectedPassengers([]);
  };

  // Find player with lowest HP
  const findNextDriver = () => {
    const lowestHpPlayer = players.reduce((min, player) =>
      player.hp < min.hp ? player : min
    , players[0]);

    setNextDriver(lowestHpPlayer);
    setShowBossModal(true);
  };

  // Get HP bar color based on HP level
  const getHpColor = (hp) => {
    if (hp >= 80) return 'bg-lime-400';
    if (hp >= 50) return 'bg-yellow-400';
    if (hp >= 30) return 'bg-orange-400';
    return 'bg-red-500';
  };

  // Get HP text color
  const getHpTextColor = (hp) => {
    if (hp >= 80) return 'text-lime-400';
    if (hp >= 50) return 'text-yellow-400';
    if (hp >= 30) return 'text-orange-400';
    return 'text-red-500';
  };

  return (
    <>
      {/* Google Fonts Import */}
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');

          .retro-font {
            font-family: 'Press Start 2P', cursive;
          }

          /* CRT Scanline Effect */
          .crt-scanlines {
            position: relative;
          }

          .crt-scanlines::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: repeating-linear-gradient(
              0deg,
              rgba(0, 0, 0, 0.15) 0px,
              rgba(0, 0, 0, 0.15) 1px,
              transparent 1px,
              transparent 2px
            );
            pointer-events: none;
            z-index: 1000;
          }

          /* Pixel border effect */
          .pixel-border {
            box-shadow:
              0 0 0 2px currentColor,
              4px 4px 0 2px currentColor;
          }

          /* Glowing text effect */
          .glow-text {
            text-shadow:
              0 0 5px currentColor,
              0 0 10px currentColor,
              0 0 20px currentColor;
          }

          /* Arcade button effect */
          .arcade-button {
            box-shadow:
              0 0 0 3px currentColor,
              0 6px 0 0 currentColor,
              0 6px 0 3px currentColor;
            transform: translateY(0);
            transition: all 0.1s;
          }

          .arcade-button:active {
            transform: translateY(4px);
            box-shadow:
              0 0 0 3px currentColor,
              0 2px 0 0 currentColor,
              0 2px 0 3px currentColor;
          }

          /* HP Bar animation */
          .hp-bar {
            transition: width 0.5s ease-in-out;
          }

          /* Retro input styling */
          .retro-input {
            background: #000;
            border: 2px solid #0f0;
            color: #0f0;
            font-family: 'Press Start 2P', cursive;
            padding: 8px;
            font-size: 10px;
          }

          .retro-input:focus {
            outline: none;
            box-shadow: 0 0 10px #0f0;
          }
        `}
      </style>

      <div className="min-h-screen bg-slate-950 text-white retro-font crt-scanlines relative overflow-hidden">
        {/* Animated background stars */}
        <div className="absolute inset-0 opacity-20">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute bg-white rounded-full"
              style={{
                width: Math.random() * 3 + 'px',
                height: Math.random() * 3 + 'px',
                top: Math.random() * 100 + '%',
                left: Math.random() * 100 + '%',
                animation: `twinkle ${Math.random() * 3 + 2}s infinite`
              }}
            />
          ))}
        </div>

        <div className="relative z-10 container mx-auto px-4 py-8 max-w-6xl">
          {/* Header */}
          <header className="text-center mb-12">
            <div className="inline-block border-8 border-lime-400 bg-black p-6 mb-4 pixel-border">
              <h1 className="text-4xl md:text-5xl text-lime-400 glow-text mb-2">
                SHOTGUN AI
              </h1>
              <p className="text-pink-500 text-xs md:text-sm glow-text">
                &gt; CARPOOL TRACKER 2.0 &lt;
              </p>
            </div>
            <div className="text-yellow-400 text-xs flex items-center justify-center gap-2">
              <Zap size={16} />
              <span>INSERT COIN TO CONTINUE</span>
              <Zap size={16} />
            </div>
          </header>

          <div className="grid md:grid-cols-2 gap-8 mb-8">
            {/* Leaderboard Section */}
            <div className="border-4 border-pink-500 bg-black p-6">
              <h2 className="text-xl text-pink-500 mb-6 flex items-center gap-2">
                <Trophy size={20} />
                PLAYER STATUS
              </h2>

              <div className="space-y-4 mb-6">
                {players.length === 0 ? (
                  <p className="text-gray-500 text-xs">NO PLAYERS REGISTERED</p>
                ) : (
                  players.map((player) => (
                    <div key={player.id} className="bg-slate-900 p-3 border-2 border-lime-400">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-lime-400 text-xs">{player.name}</span>
                        <span className={`text-xs ${getHpTextColor(player.hp)}`}>
                          HP: {player.hp}/200
                        </span>
                      </div>

                      {/* HP Bar */}
                      <div className="w-full h-4 bg-gray-800 border-2 border-gray-700 relative overflow-hidden">
                        <div
                          className={`hp-bar h-full ${getHpColor(player.hp)}`}
                          style={{ width: `${(player.hp / 200) * 100}%` }}
                        />
                        {/* Pixelated overlay */}
                        <div className="absolute inset-0 opacity-20 bg-gradient-to-r from-transparent via-white to-transparent" />
                      </div>

                      {player.hp === 0 && (
                        <div className="mt-2 text-red-500 text-xs flex items-center gap-1">
                          <Skull size={12} />
                          K.O.!
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>

              {/* Add Player Form */}
              <form onSubmit={addPlayer} className="space-y-3">
                <div>
                  <label className="block text-lime-400 text-xs mb-2">
                    &gt; NEW_PLAYER.NAME:
                  </label>
                  <input
                    type="text"
                    value={newPlayerName}
                    onChange={(e) => setNewPlayerName(e.target.value)}
                    className="retro-input w-full"
                    placeholder="ENTER NAME"
                    maxLength={20}
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-lime-400 text-black px-4 py-3 text-xs arcade-button border-0 flex items-center justify-center gap-2"
                >
                  <Plus size={16} />
                  ADD PLAYER
                </button>
              </form>
            </div>

            {/* Action Panel */}
            <div className="border-4 border-yellow-400 bg-black p-6">
              <h2 className="text-xl text-yellow-400 mb-6 flex items-center gap-2">
                <Car size={20} />
                LOG QUEST
              </h2>

              <form onSubmit={logTrip} className="space-y-4">
                <div>
                  <label className="block text-yellow-400 text-xs mb-2">
                    &gt; SELECT_DRIVER:
                  </label>
                  <select
                    value={tripDriver}
                    onChange={(e) => setTripDriver(e.target.value)}
                    className="retro-input w-full"
                  >
                    <option value="">-- SELECT --</option>
                    {players.map(player => (
                      <option key={player.id} value={player.id}>
                        {player.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-yellow-400 text-xs mb-2">
                    &gt; DISTANCE_KM:
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    value={tripDistance}
                    onChange={(e) => setTripDistance(e.target.value)}
                    className="retro-input w-full"
                    placeholder="0.0"
                  />
                </div>

                <div>
                  <label className="block text-yellow-400 text-xs mb-2">
                    &gt; SELECT_PASSENGERS:
                  </label>
                  <div className="space-y-2 max-h-32 overflow-y-auto bg-slate-900 p-2 border-2 border-yellow-400">
                    {players.filter(p => p.id !== parseInt(tripDriver)).map(player => (
                      <label key={player.id} className="flex items-center gap-2 cursor-pointer text-xs">
                        <input
                          type="checkbox"
                          checked={selectedPassengers.includes(player.id)}
                          onChange={() => togglePassenger(player.id)}
                          className="w-4 h-4"
                        />
                        <User size={12} className="text-lime-400" />
                        <span className="text-white">{player.name}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-yellow-400 text-black px-4 py-3 text-xs arcade-button border-0"
                  disabled={!tripDriver || !tripDistance || selectedPassengers.length === 0}
                >
                  EXECUTE MISSION
                </button>
              </form>

              {/* Boss Battle Button */}
              <div className="mt-6 pt-6 border-t-2 border-yellow-400">
                <button
                  onClick={findNextDriver}
                  className="w-full bg-pink-500 text-black px-4 py-4 text-sm arcade-button border-0 glow-text"
                  disabled={players.length === 0}
                >
                  ⚔️ WHO DRIVES NEXT? ⚔️
                </button>
              </div>
            </div>
          </div>

          {/* Quest Log */}
          <div className="border-4 border-lime-400 bg-black p-6">
            <h2 className="text-xl text-lime-400 mb-4 flex items-center gap-2">
              <Zap size={20} />
              QUEST LOG
            </h2>

            <div className="space-y-3 max-h-64 overflow-y-auto">
              {trips.length === 0 ? (
                <p className="text-gray-500 text-xs text-center py-8">
                  NO QUESTS COMPLETED YET...
                </p>
              ) : (
                trips.map((trip) => (
                  <div key={trip.id} className="bg-slate-900 p-3 border-2 border-lime-400 text-xs">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <span className="text-lime-400">DRIVER:</span>{' '}
                        <span className="text-white">{trip.driver}</span>
                      </div>
                      <span className="text-pink-500">+{trip.hpChange} HP</span>
                    </div>
                    <div className="mb-1">
                      <span className="text-yellow-400">DISTANCE:</span>{' '}
                      <span className="text-white">{trip.distance} km</span>
                    </div>
                    <div className="mb-1">
                      <span className="text-pink-500">PASSENGERS:</span>{' '}
                      <span className="text-white">{trip.passengers}</span>
                      <span className="text-red-500 ml-2">-{trip.hpChange} HP</span>
                    </div>
                    <div className="text-gray-500 text-xs mt-2">
                      {trip.timestamp}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Boss Battle Modal */}
        {showBossModal && nextDriver && (
          <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4">
            <div className="border-8 border-pink-500 bg-slate-950 p-8 max-w-md w-full pixel-border animate-pulse">
              <h2 className="text-2xl text-pink-500 text-center mb-6 glow-text">
                ⚔️ BOSS BATTLE ⚔️
              </h2>

              <div className="bg-black border-4 border-red-500 p-6 mb-6">
                <p className="text-yellow-400 text-sm text-center mb-4">
                  CHALLENGER IDENTIFIED!
                </p>
                <p className="text-lime-400 text-2xl text-center mb-4 glow-text">
                  {nextDriver.name}
                </p>
                <div className="text-center">
                  <span className={`text-xl ${getHpTextColor(nextDriver.hp)}`}>
                    HP: {nextDriver.hp}/200
                  </span>
                </div>
              </div>

              <p className="text-white text-xs text-center mb-6">
                YOUR HP IS THE LOWEST!<br />
                TIME TO DRIVE AND HEAL UP!
              </p>

              <button
                onClick={() => setShowBossModal(false)}
                className="w-full bg-lime-400 text-black px-4 py-3 text-sm arcade-button border-0"
              >
                ACCEPT QUEST
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Add twinkle animation */}
      <style>
        {`
          @keyframes twinkle {
            0%, 100% { opacity: 0.3; }
            50% { opacity: 1; }
          }
        `}
      </style>
    </>
  );
};

export default ShotgunAI;
