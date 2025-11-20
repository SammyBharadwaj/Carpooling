import React, { useState, useEffect } from 'react';
import { X, Trophy, Zap, Car, Users, TrendingUp, Award, Star, Flame } from 'lucide-react';

const ShotgunAI = () => {
  // View management
  const [currentView, setCurrentView] = useState('boot');

  // Member state
  const [members, setMembers] = useState([]);
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberVehicle, setNewMemberVehicle] = useState('gas');

  // Trip state
  const [trips, setTrips] = useState([]);
  const [showTripModal, setShowTripModal] = useState(false);
  const [tripDriver, setTripDriver] = useState('');
  const [tripDistance, setTripDistance] = useState('');
  const [tripPassengers, setTripPassengers] = useState([]);
  const [isDD, setIsDD] = useState(false);

  // Algorithm modal
  const [showAlgorithmModal, setShowAlgorithmModal] = useState(false);
  const [nextDriver, setNextDriver] = useState(null);

  // Animation states
  const [particles, setParticles] = useState([]);
  const [celebrating, setCelebrating] = useState(false);

  // Generate floating particles
  useEffect(() => {
    const newParticles = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      duration: Math.random() * 20 + 10,
      delay: Math.random() * 5
    }));
    setParticles(newParticles);
  }, []);

  // Add member
  const addMember = (e) => {
    e.preventDefault();
    if (!newMemberName.trim()) return;

    const newMember = {
      id: Date.now(),
      name: newMemberName.trim(),
      vehicleType: newMemberVehicle,
      milesDriven: 0,
      ddCount: 0,
      level: 1,
      xp: 0
    };

    setMembers([...members, newMember]);
    setNewMemberName('');
    setNewMemberVehicle('gas');
  };

  // Toggle passenger
  const togglePassenger = (memberId) => {
    if (tripPassengers.includes(memberId)) {
      setTripPassengers(tripPassengers.filter(id => id !== memberId));
    } else {
      setTripPassengers([...tripPassengers, memberId]);
    }
  };

  // Calculate level based on XP
  const calculateLevel = (xp) => {
    return Math.floor(xp / 100) + 1;
  };

  // Log trip
  const logTrip = (e) => {
    e.preventDefault();
    if (!tripDriver || !tripDistance || tripPassengers.length === 0) return;

    const distance = parseFloat(tripDistance);
    const driverMember = members.find(m => m.id === parseInt(tripDriver));
    const passengerNames = members
      .filter(m => tripPassengers.includes(m.id))
      .map(m => m.name)
      .join(', ');

    // Calculate XP (distance * 10, bonus for DD)
    const baseXP = Math.round(distance * 10);
    const ddBonus = isDD ? 50 : 0;
    const totalXP = baseXP + ddBonus;

    // Update members
    const updatedMembers = members.map(member => {
      if (member.id === parseInt(tripDriver)) {
        const newXP = member.xp + totalXP;
        return {
          ...member,
          milesDriven: member.milesDriven + distance,
          ddCount: isDD ? member.ddCount + 1 : member.ddCount,
          xp: newXP,
          level: calculateLevel(newXP)
        };
      }
      return member;
    });

    // Create trip record
    const newTrip = {
      id: Date.now(),
      driver: driverMember.name,
      distance,
      passengers: passengerNames,
      isDD,
      xpEarned: totalXP,
      timestamp: new Date().toLocaleString()
    };

    setMembers(updatedMembers);
    setTrips([newTrip, ...trips]);

    // Celebration effect
    setCelebrating(true);
    setTimeout(() => setCelebrating(false), 2000);

    // Reset form
    setTripDriver('');
    setTripDistance('');
    setTripPassengers([]);
    setIsDD(false);
    setShowTripModal(false);
  };

  // Calculate next driver
  const calculateNextDriver = () => {
    if (members.length === 0) return;

    const sortedByMiles = [...members].sort((a, b) => a.milesDriven - b.milesDriven);
    const lowestMiles = sortedByMiles[0].milesDriven;
    const tied = sortedByMiles.filter(m => m.milesDriven === lowestMiles);
    const selected = tied.reduce((min, member) =>
      member.ddCount < min.ddCount ? member : min
    , tied[0]);

    setNextDriver(selected);
    setShowAlgorithmModal(true);
  };

  // Get max miles for progress bar
  const getMaxMiles = () => {
    if (members.length === 0) return 100;
    const max = Math.max(...members.map(m => m.milesDriven));
    return max > 0 ? max : 100;
  };

  // Get rank badge
  const getRankBadge = (level) => {
    if (level >= 10) return { icon: '👑', name: 'Legend', color: 'from-yellow-400 to-orange-500' };
    if (level >= 7) return { icon: '💎', name: 'Diamond', color: 'from-cyan-400 to-blue-500' };
    if (level >= 5) return { icon: '⭐', name: 'Gold', color: 'from-yellow-400 to-yellow-600' };
    if (level >= 3) return { icon: '🥈', name: 'Silver', color: 'from-gray-300 to-gray-500' };
    return { icon: '🥉', name: 'Bronze', color: 'from-orange-400 to-orange-600' };
  };

  return (
    <>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;600;700&family=Orbitron:wght@700;900&display=swap');

          .retro-font {
            font-family: 'Space Grotesk', sans-serif;
          }

          .heading-font {
            font-family: 'Orbitron', sans-serif;
          }

          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-20px); }
          }

          @keyframes pulse-glow {
            0%, 100% { box-shadow: 0 0 20px rgba(139, 92, 246, 0.3); }
            50% { box-shadow: 0 0 40px rgba(139, 92, 246, 0.6); }
          }

          @keyframes slide-up {
            from { transform: translateY(20px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
          }

          @keyframes particle-float {
            0% { transform: translate(0, 0) scale(1); opacity: 0; }
            50% { opacity: 1; }
            100% { transform: translate(var(--tx), var(--ty)) scale(0); opacity: 0; }
          }

          @keyframes progress-fill {
            from { width: 0; }
            to { width: var(--progress); }
          }

          @keyframes level-up {
            0% { transform: scale(1); }
            50% { transform: scale(1.2); }
            100% { transform: scale(1); }
          }

          .glass-card {
            background: rgba(30, 30, 50, 0.7);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(139, 92, 246, 0.2);
            box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
          }

          .glass-card:hover {
            border-color: rgba(139, 92, 246, 0.4);
            transform: translateY(-2px);
            transition: all 0.3s ease;
          }

          .neon-button {
            background: linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%);
            box-shadow: 0 0 20px rgba(139, 92, 246, 0.4);
            transition: all 0.3s ease;
          }

          .neon-button:hover {
            box-shadow: 0 0 30px rgba(139, 92, 246, 0.6);
            transform: translateY(-2px);
          }

          .neon-button:active {
            transform: translateY(0);
          }

          .particle {
            position: absolute;
            background: radial-gradient(circle, rgba(139, 92, 246, 0.8) 0%, transparent 70%);
            border-radius: 50%;
            pointer-events: none;
            animation: particle-float linear infinite;
          }

          .progress-bar-fill {
            animation: progress-fill 1s ease-out forwards;
          }

          .slide-up {
            animation: slide-up 0.5s ease-out;
          }

          .float-animation {
            animation: float 3s ease-in-out infinite;
          }

          input:focus, select:focus {
            outline: none;
            border-color: #8b5cf6;
            box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.2);
          }

          .stat-card {
            transition: all 0.3s ease;
          }

          .stat-card:hover {
            transform: scale(1.05);
          }
        `}
      </style>

      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 text-gray-100 retro-font relative overflow-hidden">
        {/* Animated particles background */}
        {particles.map(particle => (
          <div
            key={particle.id}
            className="particle"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              animationDuration: `${particle.duration}s`,
              animationDelay: `${particle.delay}s`,
              '--tx': `${(Math.random() - 0.5) * 200}px`,
              '--ty': `${-Math.random() * 300}px`
            }}
          />
        ))}

        {/* BOOT SCREEN */}
        {currentView === 'boot' && (
          <div className="min-h-screen flex items-center justify-center p-4 relative z-10">
            <div className="glass-card max-w-lg w-full rounded-2xl p-12 text-center slide-up">
              <div className="float-animation mb-8">
                <div className="text-8xl mb-6">🚀</div>
                <h1 className="text-6xl font-black heading-font bg-gradient-to-r from-purple-400 via-pink-500 to-purple-400 bg-clip-text text-transparent mb-4">
                  SHOTGUN.AI
                </h1>
                <p className="text-purple-300 text-sm tracking-widest">CARPOOL COMMAND CENTER</p>
              </div>

              <div className="mb-8 p-6 bg-gradient-to-r from-purple-900/50 to-pink-900/50 rounded-xl border border-purple-500/30">
                <p className="text-lg text-gray-300">Gamified Carpool Tracking System</p>
                <p className="text-sm text-gray-400 mt-2">Earn XP • Level Up • Track Your Drives</p>
              </div>

              <button
                onClick={() => setCurrentView('setup')}
                className="neon-button w-full px-8 py-4 rounded-xl text-white font-bold text-lg tracking-wide"
              >
                <span className="flex items-center justify-center gap-3">
                  <Zap className="w-6 h-6" />
                  INITIALIZE SYSTEM
                  <Zap className="w-6 h-6" />
                </span>
              </button>
            </div>
          </div>
        )}

        {/* SETUP SCREEN */}
        {currentView === 'setup' && (
          <div className="min-h-screen flex items-center justify-center p-4 relative z-10">
            <div className="glass-card max-w-3xl w-full rounded-2xl p-8 slide-up">
              <h2 className="text-4xl font-bold heading-font bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-8">
                CREW ASSEMBLY
              </h2>

              {/* Add member form */}
              <form onSubmit={addMember} className="mb-8 p-6 bg-slate-900/50 rounded-xl border border-purple-500/20">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-purple-300 text-sm font-semibold mb-2 tracking-wide">
                      DRIVER NAME
                    </label>
                    <input
                      type="text"
                      value={newMemberName}
                      onChange={(e) => setNewMemberName(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-800/50 border border-purple-500/30 rounded-lg text-white transition-all duration-300"
                      placeholder="Enter name..."
                    />
                  </div>
                  <div>
                    <label className="block text-purple-300 text-sm font-semibold mb-2 tracking-wide">
                      VEHICLE CLASS
                    </label>
                    <select
                      value={newMemberVehicle}
                      onChange={(e) => setNewMemberVehicle(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-800/50 border border-purple-500/30 rounded-lg text-white transition-all duration-300"
                    >
                      <option value="gas">💨 Gas Guzzler</option>
                      <option value="electric">⚡ Electric/EV</option>
                    </select>
                  </div>
                </div>
                <button
                  type="submit"
                  className="neon-button w-full px-6 py-3 rounded-lg text-white font-bold tracking-wide"
                >
                  + ADD TO CREW
                </button>
              </form>

              {/* Member grid */}
              <div className="mb-8">
                <h3 className="text-xl font-bold text-purple-300 mb-4 flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  CREW ROSTER
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
                  {members.length === 0 ? (
                    <p className="text-gray-500 italic col-span-2 text-center py-8">
                      No crew members yet...
                    </p>
                  ) : (
                    members.map((member) => (
                      <div
                        key={member.id}
                        className="glass-card p-4 rounded-xl flex items-center gap-3"
                      >
                        <div className="text-3xl">
                          {member.vehicleType === 'gas' ? '💨' : '⚡'}
                        </div>
                        <div className="flex-1">
                          <div className="font-bold text-white">{member.name}</div>
                          <div className="text-xs text-gray-400">
                            {member.vehicleType === 'gas' ? 'Gas Guzzler' : 'Electric/EV'}
                          </div>
                        </div>
                        <div className="text-2xl">🎮</div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <button
                onClick={() => setCurrentView('dashboard')}
                className="neon-button w-full px-8 py-4 rounded-xl text-white font-bold text-lg tracking-wide"
                disabled={members.length === 0}
              >
                LAUNCH DASHBOARD
              </button>
            </div>
          </div>
        )}

        {/* DASHBOARD */}
        {currentView === 'dashboard' && (
          <div className="min-h-screen p-4 md:p-8 relative z-10">
            <div className="max-w-7xl mx-auto">
              {/* Header */}
              <div className="flex items-center justify-between mb-8">
                <h1 className="text-5xl font-black heading-font bg-gradient-to-r from-purple-400 via-pink-500 to-purple-400 bg-clip-text text-transparent">
                  SHOTGUN.AI
                </h1>
                <button
                  onClick={() => setCurrentView('setup')}
                  className="glass-card px-4 py-2 rounded-lg text-purple-300 hover:text-purple-200 transition-all"
                >
                  ⚙️ Crew
                </button>
              </div>

              {/* Stats Overview */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <div className="glass-card p-4 rounded-xl stat-card">
                  <div className="flex items-center gap-3">
                    <Users className="w-8 h-8 text-purple-400" />
                    <div>
                      <div className="text-2xl font-bold text-white">{members.length}</div>
                      <div className="text-xs text-gray-400">CREW MEMBERS</div>
                    </div>
                  </div>
                </div>
                <div className="glass-card p-4 rounded-xl stat-card">
                  <div className="flex items-center gap-3">
                    <Car className="w-8 h-8 text-pink-400" />
                    <div>
                      <div className="text-2xl font-bold text-white">{trips.length}</div>
                      <div className="text-xs text-gray-400">TOTAL TRIPS</div>
                    </div>
                  </div>
                </div>
                <div className="glass-card p-4 rounded-xl stat-card">
                  <div className="flex items-center gap-3">
                    <TrendingUp className="w-8 h-8 text-cyan-400" />
                    <div>
                      <div className="text-2xl font-bold text-white">
                        {members.reduce((sum, m) => sum + m.milesDriven, 0).toFixed(0)}
                      </div>
                      <div className="text-xs text-gray-400">TOTAL MILES</div>
                    </div>
                  </div>
                </div>
                <div className="glass-card p-4 rounded-xl stat-card">
                  <div className="flex items-center gap-3">
                    <Trophy className="w-8 h-8 text-yellow-400" />
                    <div>
                      <div className="text-2xl font-bold text-white">
                        {members.reduce((sum, m) => sum + m.ddCount, 0)}
                      </div>
                      <div className="text-xs text-gray-400">DD HEROES</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                {/* LEADERBOARD */}
                <div className="glass-card rounded-2xl p-6 slide-up">
                  <h3 className="text-2xl font-bold heading-font bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-6 flex items-center gap-2">
                    <Trophy className="w-6 h-6 text-yellow-400" />
                    LEADERBOARD
                  </h3>

                  <div className="space-y-4">
                    {members.length === 0 ? (
                      <p className="text-gray-500 italic text-center py-8">No crew members yet...</p>
                    ) : (
                      members
                        .sort((a, b) => b.xp - a.xp)
                        .map((member, index) => {
                          const rank = getRankBadge(member.level);
                          const maxMiles = getMaxMiles();
                          const percentage = maxMiles > 0 ? (member.milesDriven / maxMiles) * 100 : 0;
                          const xpProgress = (member.xp % 100);

                          return (
                            <div
                              key={member.id}
                              className="bg-slate-900/50 rounded-xl p-4 border border-purple-500/20 hover:border-purple-500/40 transition-all"
                            >
                              {/* Top section - Name and stats */}
                              <div className="flex items-center gap-3 mb-3">
                                <div className={`text-3xl font-bold bg-gradient-to-r ${rank.color} bg-clip-text text-transparent`}>
                                  #{index + 1}
                                </div>
                                <div className="text-2xl">{rank.icon}</div>
                                <div className="flex-1">
                                  <div className="flex items-center gap-2">
                                    <span className="font-bold text-white text-lg">{member.name}</span>
                                    <span className="text-xs px-2 py-1 bg-purple-500/30 rounded text-purple-300">
                                      LVL {member.level}
                                    </span>
                                  </div>
                                  <div className="text-xs text-gray-400">
                                    {member.milesDriven.toFixed(1)} mi • {member.xp} XP
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <div className="text-xl">
                                    {member.vehicleType === 'gas' ? '💨' : '⚡'}
                                  </div>
                                  {member.ddCount > 0 && (
                                    <div className="flex items-center gap-1 bg-amber-500/20 px-2 py-1 rounded">
                                      <span className="text-lg">🍺</span>
                                      <span className="text-sm font-bold text-amber-400">
                                        ×{member.ddCount}
                                      </span>
                                    </div>
                                  )}
                                </div>
                              </div>

                              {/* XP Progress bar */}
                              <div className="mb-2">
                                <div className="flex justify-between text-xs text-gray-400 mb-1">
                                  <span>XP Progress to Level {member.level + 1}</span>
                                  <span>{xpProgress}/100</span>
                                </div>
                                <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                                  <div
                                    className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-1000"
                                    style={{ width: `${xpProgress}%` }}
                                  />
                                </div>
                              </div>

                              {/* Miles progress bar */}
                              <div className="relative h-8 bg-slate-800 rounded-lg overflow-hidden">
                                <div
                                  className="progress-bar-fill h-full bg-gradient-to-r from-purple-600 to-pink-600 transition-all duration-1000"
                                  style={{ '--progress': `${percentage}%`, width: `${percentage}%` }}
                                />
                                <div className="absolute inset-0 flex items-center justify-end pr-2">
                                  <span className="text-2xl">
                                    {member.vehicleType === 'gas' ? '🏎️' : '🚗'}
                                  </span>
                                </div>
                              </div>
                            </div>
                          );
                        })
                    )}
                  </div>
                </div>

                {/* TRIP LOG */}
                <div className="glass-card rounded-2xl p-6 slide-up">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-bold heading-font bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent flex items-center gap-2">
                      <Zap className="w-6 h-6 text-cyan-400" />
                      TRIP LOG
                    </h3>
                    <button
                      onClick={() => setShowTripModal(true)}
                      className="neon-button px-4 py-2 rounded-lg text-white font-semibold text-sm"
                    >
                      + LOG TRIP
                    </button>
                  </div>

                  <div className="space-y-3 max-h-[500px] overflow-y-auto">
                    {trips.length === 0 ? (
                      <p className="text-gray-500 italic text-center py-8">No trips logged yet...</p>
                    ) : (
                      trips.map((trip) => (
                        <div
                          key={trip.id}
                          className="bg-slate-900/50 rounded-xl p-4 border border-purple-500/20 hover:border-purple-500/40 transition-all"
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <Car className="w-4 h-4 text-purple-400" />
                              <span className="font-bold text-white">{trip.driver}</span>
                              {trip.isDD && (
                                <span className="text-xs px-2 py-1 bg-amber-500/30 rounded text-amber-300 flex items-center gap-1">
                                  🍺 DD
                                </span>
                              )}
                            </div>
                            <span className="text-xs px-2 py-1 bg-green-500/30 rounded text-green-300 font-bold flex items-center gap-1">
                              <Star className="w-3 h-3" />
                              +{trip.xpEarned} XP
                            </span>
                          </div>
                          <div className="text-sm text-gray-400 space-y-1">
                            <div className="flex items-center gap-2">
                              <TrendingUp className="w-3 h-3" />
                              {trip.distance} miles
                            </div>
                            <div className="flex items-center gap-2">
                              <Users className="w-3 h-3" />
                              {trip.passengers}
                            </div>
                            <div className="text-xs text-gray-500 mt-2">{trip.timestamp}</div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>

              {/* ALGORITHM */}
              <div className="glass-card rounded-2xl p-6 max-w-2xl mx-auto slide-up">
                <h3 className="text-2xl font-bold heading-font bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-4 flex items-center gap-2">
                  <Award className="w-6 h-6 text-yellow-400" />
                  THE ALGORITHM
                </h3>
                <p className="text-gray-400 mb-6">
                  AI-powered fairness algorithm calculates the next driver based on miles driven and DD favors.
                </p>
                <button
                  onClick={calculateNextDriver}
                  className="neon-button w-full px-8 py-4 rounded-xl text-white font-bold text-lg tracking-wide"
                  disabled={members.length === 0}
                >
                  <span className="flex items-center justify-center gap-3">
                    <Flame className="w-6 h-6" />
                    CALCULATE NEXT DRIVER
                    <Flame className="w-6 h-6" />
                  </span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* LOG TRIP MODAL */}
        {showTripModal && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="glass-card max-w-md w-full rounded-2xl p-6 slide-up">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold heading-font bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  LOG TRIP
                </h3>
                <button
                  onClick={() => setShowTripModal(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={logTrip} className="space-y-4">
                <div>
                  <label className="block text-purple-300 text-sm font-semibold mb-2 tracking-wide">
                    WHO DROVE?
                  </label>
                  <select
                    value={tripDriver}
                    onChange={(e) => setTripDriver(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-800/50 border border-purple-500/30 rounded-lg text-white transition-all duration-300"
                    required
                  >
                    <option value="">-- Select Driver --</option>
                    {members.map(member => (
                      <option key={member.id} value={member.id}>
                        {member.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-purple-300 text-sm font-semibold mb-2 tracking-wide">
                    DISTANCE (MILES)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    value={tripDistance}
                    onChange={(e) => setTripDistance(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-800/50 border border-purple-500/30 rounded-lg text-white transition-all duration-300"
                    placeholder="0.0"
                    required
                  />
                </div>

                <div>
                  <label className="block text-purple-300 text-sm font-semibold mb-2 tracking-wide">
                    PASSENGERS
                  </label>
                  <div className="bg-slate-800/50 border border-purple-500/30 rounded-lg p-3 max-h-32 overflow-y-auto space-y-2">
                    {members.filter(m => m.id !== parseInt(tripDriver)).map(member => (
                      <label
                        key={member.id}
                        className="flex items-center gap-3 cursor-pointer hover:bg-purple-500/10 p-2 rounded transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={tripPassengers.includes(member.id)}
                          onChange={() => togglePassenger(member.id)}
                          className="w-4 h-4 accent-purple-500 cursor-pointer"
                        />
                        <span className="text-white">{member.name}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="flex items-center gap-3 cursor-pointer p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg hover:bg-amber-500/20 transition-colors">
                    <input
                      type="checkbox"
                      checked={isDD}
                      onChange={(e) => setIsDD(e.target.checked)}
                      className="w-5 h-5 accent-amber-500 cursor-pointer"
                    />
                    <span className="font-semibold text-amber-300 flex items-center gap-2">
                      <span className="text-xl">🍺</span>
                      Was Designated Driver? (+50 XP Bonus)
                    </span>
                  </label>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    className="neon-button flex-1 px-6 py-3 rounded-lg text-white font-bold"
                    disabled={!tripDriver || !tripDistance || tripPassengers.length === 0}
                  >
                    LOG TRIP
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowTripModal(false)}
                    className="glass-card px-6 py-3 rounded-lg text-gray-300 hover:text-white transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ALGORITHM RESULT MODAL */}
        {showAlgorithmModal && nextDriver && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="glass-card max-w-md w-full rounded-2xl p-8 text-center slide-up">
              <div className="text-6xl mb-6 float-animation">🎯</div>
              <h3 className="text-3xl font-bold heading-font bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent mb-4">
                NEXT DRIVER
              </h3>

              <div className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 rounded-xl p-6 mb-6 border-2 border-purple-500/50">
                <div className="text-4xl font-black text-white mb-3">{nextDriver.name}</div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="bg-slate-900/50 rounded-lg p-3">
                    <div className="text-gray-400">Miles</div>
                    <div className="text-xl font-bold text-purple-400">
                      {nextDriver.milesDriven.toFixed(1)}
                    </div>
                  </div>
                  <div className="bg-slate-900/50 rounded-lg p-3">
                    <div className="text-gray-400">Level</div>
                    <div className="text-xl font-bold text-pink-400">{nextDriver.level}</div>
                  </div>
                  <div className="bg-slate-900/50 rounded-lg p-3">
                    <div className="text-gray-400">DD Count</div>
                    <div className="text-xl font-bold text-amber-400">{nextDriver.ddCount} 🍺</div>
                  </div>
                  <div className="bg-slate-900/50 rounded-lg p-3">
                    <div className="text-gray-400">Vehicle</div>
                    <div className="text-2xl">
                      {nextDriver.vehicleType === 'gas' ? '💨' : '⚡'}
                    </div>
                  </div>
                </div>
              </div>

              <p className="text-gray-400 mb-6 text-sm">
                The algorithm has selected {nextDriver.name} as the next driver based on the lowest miles driven
                and DD count.
              </p>

              <button
                onClick={() => setShowAlgorithmModal(false)}
                className="neon-button w-full px-8 py-3 rounded-xl text-white font-bold"
              >
                GOT IT
              </button>
            </div>
          </div>
        )}

        {/* Celebration Effect */}
        {celebrating && (
          <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
            <div className="text-9xl animate-bounce">🎉</div>
          </div>
        )}
      </div>
    </>
  );
};

export default ShotgunAI;
