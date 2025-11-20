import React, { useState } from 'react';
import { X } from 'lucide-react';

const ShotgunAI = () => {
  // View management
  const [currentView, setCurrentView] = useState('boot'); // boot, setup, dashboard

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

  // Add member
  const addMember = (e) => {
    e.preventDefault();
    if (!newMemberName.trim()) return;

    const newMember = {
      id: Date.now(),
      name: newMemberName.trim(),
      vehicleType: newMemberVehicle,
      milesDriven: 0,
      ddCount: 0
    };

    setMembers([...members, newMember]);
    setNewMemberName('');
    setNewMemberVehicle('gas');
  };

  // Toggle passenger selection
  const togglePassenger = (memberId) => {
    if (tripPassengers.includes(memberId)) {
      setTripPassengers(tripPassengers.filter(id => id !== memberId));
    } else {
      setTripPassengers([...tripPassengers, memberId]);
    }
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

    // Update member miles and DD count
    const updatedMembers = members.map(member => {
      if (member.id === parseInt(tripDriver)) {
        return {
          ...member,
          milesDriven: member.milesDriven + distance,
          ddCount: isDD ? member.ddCount + 1 : member.ddCount
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
      timestamp: new Date().toLocaleString()
    };

    setMembers(updatedMembers);
    setTrips([newTrip, ...trips]);

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

    // Find member with lowest miles driven
    const sortedByMiles = [...members].sort((a, b) => a.milesDriven - b.milesDriven);
    const lowestMiles = sortedByMiles[0].milesDriven;

    // If there's a tie, prefer the one with fewer DD counts
    const tied = sortedByMiles.filter(m => m.milesDriven === lowestMiles);
    const selected = tied.reduce((min, member) =>
      member.ddCount < min.ddCount ? member : min
    , tied[0]);

    setNextDriver(selected);
    setShowAlgorithmModal(true);
  };

  // Get max miles for progress bar scaling
  const getMaxMiles = () => {
    if (members.length === 0) return 100;
    const max = Math.max(...members.map(m => m.milesDriven));
    return max > 0 ? max : 100;
  };

  return (
    <>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Libre+Franklin:wght@400;600;700&display=swap');

          .mac-font {
            font-family: 'Libre Franklin', -apple-system, 'Chicago', 'Geneva', sans-serif;
          }

          .striped-titlebar {
            background: repeating-linear-gradient(
              90deg,
              #000 0px,
              #000 1px,
              #fff 1px,
              #fff 2px
            );
            height: 20px;
          }

          .mac-button {
            background: #e0e0e0;
            border: 1px solid #000;
            border-top-color: #fff;
            border-left-color: #fff;
            border-bottom-color: #404040;
            border-right-color: #404040;
            box-shadow: inset 1px 1px 0 #fff, inset -1px -1px 0 #808080;
            cursor: pointer;
          }

          .mac-button:active {
            border-top-color: #404040;
            border-left-color: #404040;
            border-bottom-color: #fff;
            border-right-color: #fff;
            box-shadow: inset -1px -1px 0 #fff, inset 1px 1px 0 #808080;
          }

          .mac-button:disabled {
            opacity: 0.5;
            cursor: not-allowed;
          }

          .mac-window {
            background: #c0c0c0;
            border: 1px solid #000;
            box-shadow: 2px 2px 0 rgba(0,0,0,0.3);
          }

          .mac-input {
            background: #fff;
            border: 1px solid #000;
            border-top-color: #404040;
            border-left-color: #404040;
            box-shadow: inset 1px 1px 2px rgba(0,0,0,0.2);
          }

          .mac-select {
            background: #fff;
            border: 1px solid #000;
            border-top-color: #404040;
            border-left-color: #404040;
            box-shadow: inset 1px 1px 2px rgba(0,0,0,0.2);
          }

          .progress-bar {
            background: #fff;
            border: 1px solid #000;
            box-shadow: inset 1px 1px 2px rgba(0,0,0,0.2);
          }

          .progress-fill {
            background: #000;
            height: 100%;
          }

          .desktop-pattern {
            background-color: #008080;
            background-image:
              repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,.03) 10px, rgba(255,255,255,.03) 20px);
          }
        `}
      </style>

      <div className="min-h-screen bg-gray-200 mac-font">
        {/* BOOT SCREEN */}
        {currentView === 'boot' && (
          <div className="desktop-pattern min-h-screen flex items-center justify-center p-4">
            <div className="mac-window max-w-md w-full">
              {/* Title bar */}
              <div className="striped-titlebar" />

              {/* Window content */}
              <div className="p-8 text-center">
                <div className="mb-8">
                  <div className="text-6xl mb-4">🚗</div>
                  <h1 className="text-3xl font-bold mb-2">Shotgun.ai</h1>
                  <p className="text-sm text-gray-600">Carpool Management System v1.0</p>
                </div>

                <div className="mb-8 p-4 bg-white border border-gray-400">
                  <p className="text-sm">Welcome to Shotgun.ai</p>
                  <p className="text-xs text-gray-600 mt-2">
                    The intelligent carpool tracker
                  </p>
                </div>

                <button
                  onClick={() => setCurrentView('setup')}
                  className="mac-button px-6 py-2 text-sm font-semibold"
                >
                  Initialize System...
                </button>
              </div>
            </div>
          </div>
        )}

        {/* SETUP SCREEN */}
        {currentView === 'setup' && (
          <div className="desktop-pattern min-h-screen flex items-center justify-center p-4">
            <div className="mac-window max-w-2xl w-full">
              {/* Title bar */}
              <div className="striped-titlebar" />

              {/* Window content */}
              <div className="p-6">
                <h2 className="text-xl font-bold mb-6">System Setup - Add Members</h2>

                {/* Add member form */}
                <form onSubmit={addMember} className="mb-6 p-4 bg-white border border-gray-400">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-semibold mb-1">Name:</label>
                      <input
                        type="text"
                        value={newMemberName}
                        onChange={(e) => setNewMemberName(e.target.value)}
                        className="mac-input w-full px-2 py-1 text-sm"
                        placeholder="Enter name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-1">Vehicle Type:</label>
                      <select
                        value={newMemberVehicle}
                        onChange={(e) => setNewMemberVehicle(e.target.value)}
                        className="mac-select w-full px-2 py-1 text-sm"
                      >
                        <option value="gas">Gas Guzzler</option>
                        <option value="electric">Electric/EV</option>
                      </select>
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="mac-button px-4 py-2 text-sm font-semibold"
                  >
                    Add to Group
                  </button>
                </form>

                {/* Member list */}
                <div className="mb-6">
                  <h3 className="text-sm font-bold mb-2">File Directory - Group Members:</h3>
                  <div className="bg-white border border-gray-400 p-2 min-h-[200px] max-h-[300px] overflow-y-auto">
                    {members.length === 0 ? (
                      <p className="text-sm text-gray-500 italic">No members added yet...</p>
                    ) : (
                      <div className="space-y-1">
                        {members.map((member, index) => (
                          <div key={member.id} className="text-sm flex items-center gap-2">
                            <span>📄</span>
                            <span className="font-mono">{member.name}</span>
                            <span className="text-xs text-gray-600">
                              ({member.vehicleType === 'gas' ? '💨 Gas Guzzler' : '⚡ Electric/EV'})
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => setCurrentView('dashboard')}
                  className="mac-button px-6 py-2 text-sm font-semibold"
                  disabled={members.length === 0}
                >
                  Launch Dashboard
                </button>
              </div>
            </div>
          </div>
        )}

        {/* DASHBOARD */}
        {currentView === 'dashboard' && (
          <div className="desktop-pattern min-h-screen p-4">
            <div className="max-w-7xl mx-auto space-y-4">
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-bold">Shotgun.ai Desktop</h1>
                <button
                  onClick={() => setCurrentView('setup')}
                  className="mac-button px-3 py-1 text-xs"
                >
                  ⚙️ Setup
                </button>
              </div>

              {/* Windows container */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* WINDOW A: Fleet Status */}
                <div className="mac-window">
                  <div className="striped-titlebar flex items-center justify-between px-2">
                    <span className="text-xs font-bold">Fleet Status</span>
                  </div>
                  <div className="p-4 bg-white min-h-[300px]">
                    <h3 className="text-sm font-bold mb-4 border-b border-gray-400 pb-2">
                      Miles Driven - Progress Bars
                    </h3>
                    {members.length === 0 ? (
                      <p className="text-sm text-gray-500 italic">No members in system</p>
                    ) : (
                      <div className="space-y-4">
                        {members.map(member => {
                          const maxMiles = getMaxMiles();
                          const percentage = maxMiles > 0 ? (member.milesDriven / maxMiles) * 100 : 0;

                          return (
                            <div key={member.id}>
                              <div className="flex items-center justify-between mb-1">
                                <div className="flex items-center gap-2">
                                  <span className="text-sm font-semibold">{member.name}</span>
                                  {member.ddCount > 0 && (
                                    <div className="flex items-center">
                                      {Array.from({ length: member.ddCount }).map((_, i) => (
                                        <span key={i} className="text-sm">🍺</span>
                                      ))}
                                    </div>
                                  )}
                                </div>
                                <span className="text-xs text-gray-600">
                                  {member.milesDriven.toFixed(1)} mi
                                </span>
                              </div>
                              <div className="progress-bar h-6 relative">
                                <div
                                  className="progress-fill transition-all duration-500"
                                  style={{ width: `${percentage}%` }}
                                />
                                <div
                                  className="absolute top-0 text-sm flex items-center"
                                  style={{
                                    left: `${Math.max(percentage, 0)}%`,
                                    transform: 'translateX(-50%)'
                                  }}
                                >
                                  {member.vehicleType === 'gas' ? '💨' : '⚡'}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>

                {/* WINDOW B: Quest Log */}
                <div className="mac-window">
                  <div className="striped-titlebar flex items-center justify-between px-2">
                    <span className="text-xs font-bold">Quest Log</span>
                  </div>
                  <div className="p-4 bg-white min-h-[300px]">
                    <div className="flex items-center justify-between mb-4 border-b border-gray-400 pb-2">
                      <h3 className="text-sm font-bold">Past Trips</h3>
                      <button
                        onClick={() => setShowTripModal(true)}
                        className="mac-button px-3 py-1 text-xs font-semibold"
                      >
                        Log New Trip
                      </button>
                    </div>

                    <div className="space-y-2 max-h-[400px] overflow-y-auto">
                      {trips.length === 0 ? (
                        <p className="text-sm text-gray-500 italic">No trips logged yet...</p>
                      ) : (
                        trips.map(trip => (
                          <div key={trip.id} className="border border-gray-400 p-2 bg-gray-50">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-sm font-semibold">{trip.driver}</span>
                              {trip.isDD && <span className="text-sm">🍺 DD</span>}
                            </div>
                            <div className="text-xs text-gray-600">
                              <div>Distance: {trip.distance} miles</div>
                              <div>Passengers: {trip.passengers}</div>
                              <div className="text-gray-500 mt-1">{trip.timestamp}</div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* WINDOW C: Algorithm */}
              <div className="mac-window max-w-md">
                <div className="striped-titlebar flex items-center justify-between px-2">
                  <span className="text-xs font-bold">The Algorithm</span>
                </div>
                <div className="p-4 bg-white">
                  <p className="text-sm mb-4">
                    Calculate who should drive next based on miles driven and DD count.
                  </p>
                  <button
                    onClick={calculateNextDriver}
                    className="mac-button px-6 py-3 text-sm font-bold w-full"
                    disabled={members.length === 0}
                  >
                    Calculate Next Driver
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* LOG TRIP MODAL */}
        {showTripModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="mac-window max-w-md w-full">
              <div className="striped-titlebar flex items-center justify-between px-2">
                <span className="text-xs font-bold">Log New Trip</span>
                <button
                  onClick={() => setShowTripModal(false)}
                  className="text-xs font-bold"
                >
                  <X size={14} />
                </button>
              </div>
              <div className="p-4 bg-white">
                <form onSubmit={logTrip} className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold mb-1">Who drove?</label>
                    <select
                      value={tripDriver}
                      onChange={(e) => setTripDriver(e.target.value)}
                      className="mac-select w-full px-2 py-1 text-sm"
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
                    <label className="block text-sm font-semibold mb-1">Distance (miles):</label>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      value={tripDistance}
                      onChange={(e) => setTripDistance(e.target.value)}
                      className="mac-input w-full px-2 py-1 text-sm"
                      placeholder="0.0"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">Passengers:</label>
                    <div className="border border-gray-400 p-2 bg-gray-50 max-h-32 overflow-y-auto space-y-1">
                      {members.filter(m => m.id !== parseInt(tripDriver)).map(member => (
                        <label key={member.id} className="flex items-center gap-2 text-sm cursor-pointer">
                          <input
                            type="checkbox"
                            checked={tripPassengers.includes(member.id)}
                            onChange={() => togglePassenger(member.id)}
                            className="cursor-pointer"
                          />
                          <span>{member.name}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-sm cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isDD}
                        onChange={(e) => setIsDD(e.target.checked)}
                        className="cursor-pointer"
                      />
                      <span className="font-semibold">Was Designated Driver (DD)?</span>
                    </label>
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="submit"
                      className="mac-button px-4 py-2 text-sm font-semibold flex-1"
                      disabled={!tripDriver || !tripDistance || tripPassengers.length === 0}
                    >
                      Log Trip
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowTripModal(false)}
                      className="mac-button px-4 py-2 text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* ALGORITHM RESULT MODAL */}
        {showAlgorithmModal && nextDriver && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="mac-window max-w-md w-full">
              <div className="striped-titlebar flex items-center justify-between px-2">
                <span className="text-xs font-bold">System Alert</span>
              </div>
              <div className="p-6 bg-white text-center">
                <div className="mb-4">
                  <div className="text-6xl mb-4">⚠️</div>
                  <h3 className="text-xl font-bold mb-2">Next Driver Calculated</h3>
                </div>

                <div className="border-2 border-black p-4 mb-4 bg-gray-100">
                  <p className="text-2xl font-bold mb-2">{nextDriver.name}</p>
                  <div className="text-sm text-gray-600 space-y-1">
                    <div>Miles Driven: {nextDriver.milesDriven.toFixed(1)}</div>
                    <div>DD Count: {nextDriver.ddCount} 🍺</div>
                    <div>Vehicle: {nextDriver.vehicleType === 'gas' ? '💨 Gas' : '⚡ Electric'}</div>
                  </div>
                </div>

                <p className="text-sm mb-4">
                  Based on the algorithm, {nextDriver.name} has the lowest miles driven
                  {nextDriver.ddCount > 0 && ` and ${nextDriver.ddCount} DD favor(s)`}.
                </p>

                <button
                  onClick={() => setShowAlgorithmModal(false)}
                  className="mac-button px-6 py-2 text-sm font-semibold"
                >
                  OK
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ShotgunAI;
