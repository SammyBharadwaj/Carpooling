import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Navigation, Car, Zap, Fuel, Beer, Plus, TrendingUp, Crown, UserMinus, X, Edit2, Trash2, RotateCcw, Download, Star, DollarSign, Moon, Sun, Award, BarChart3, History, AlertCircle, Save, Check, Settings } from 'lucide-react';
import { useLoadScript, GoogleMap, DirectionsRenderer, Autocomplete } from '@react-google-maps/api';

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
const libraries = ['places'];

// Pixel Car Components
const PixelGasCar = ({ className = "" }) => (
  <svg width="32" height="20" viewBox="0 0 32 20" className={className} style={{ imageRendering: 'pixelated' }}>
    <rect x="8" y="8" width="4" height="4" fill="#E07A5F"/>
    <rect x="12" y="8" width="4" height="4" fill="#E07A5F"/>
    <rect x="16" y="8" width="4" height="4" fill="#E07A5F"/>
    <rect x="20" y="8" width="4" height="4" fill="#E07A5F"/>
    <rect x="8" y="4" width="4" height="4" fill="#FF6B4A"/>
    <rect x="12" y="4" width="4" height="4" fill="#87CEEB"/>
    <rect x="16" y="4" width="4" height="4" fill="#87CEEB"/>
    <rect x="20" y="4" width="4" height="4" fill="#FF6B4A"/>
    <rect x="6" y="12" width="4" height="4" fill="#3D405B"/>
    <rect x="10" y="12" width="2" height="2" fill="#FFFFFF"/>
    <rect x="22" y="12" width="4" height="4" fill="#3D405B"/>
    <rect x="24" y="12" width="2" height="2" fill="#FFFFFF"/>
    <rect x="12" y="0" width="4" height="4" fill="#FFD700"/>
    <rect x="16" y="0" width="4" height="4" fill="#FFD700"/>
  </svg>
);

const PixelElectricCar = ({ className = "" }) => (
  <svg width="32" height="20" viewBox="0 0 32 20" className={className} style={{ imageRendering: 'pixelated' }}>
    <rect x="8" y="8" width="4" height="4" fill="#2A9D8F"/>
    <rect x="12" y="8" width="4" height="4" fill="#2A9D8F"/>
    <rect x="16" y="8" width="4" height="4" fill="#2A9D8F"/>
    <rect x="20" y="8" width="4" height="4" fill="#2A9D8F"/>
    <rect x="8" y="4" width="4" height="4" fill="#4ECDC4"/>
    <rect x="12" y="4" width="4" height="4" fill="#87CEEB"/>
    <rect x="16" y="4" width="4" height="4" fill="#87CEEB"/>
    <rect x="20" y="4" width="4" height="4" fill="#4ECDC4"/>
    <rect x="6" y="12" width="4" height="4" fill="#3D405B"/>
    <rect x="10" y="12" width="2" height="2" fill="#FFFFFF"/>
    <rect x="22" y="12" width="4" height="4" fill="#3D405B"/>
    <rect x="24" y="12" width="2" height="2" fill="#FFFFFF"/>
    <rect x="14" y="0" width="4" height="4" fill="#FFD700"/>
    <rect x="13" y="1" width="2" height="2" fill="#FFF700"/>
    <rect x="17" y="1" width="2" height="2" fill="#FFF700"/>
  </svg>
);

// Pixel Beer Mug Component
const PixelBeer = ({ className = "" }) => (
  <svg width="16" height="16" viewBox="0 0 16 16" className={className} style={{ imageRendering: 'pixelated' }}>
    {/* Mug body */}
    <rect x="3" y="4" width="8" height="9" fill="#F4A261"/>
    <rect x="4" y="5" width="6" height="7" fill="#E07A5F"/>
    {/* Beer foam */}
    <rect x="3" y="3" width="8" height="2" fill="#FFF8DC"/>
    <rect x="4" y="2" width="2" height="1" fill="#FFF8DC"/>
    <rect x="8" y="2" width="2" height="1" fill="#FFF8DC"/>
    {/* Mug handle */}
    <rect x="11" y="6" width="2" height="1" fill="#3D405B"/>
    <rect x="11" y="9" width="2" height="1" fill="#3D405B"/>
    <rect x="13" y="7" width="1" height="2" fill="#3D405B"/>
    {/* Highlights */}
    <rect x="5" y="6" width="1" height="2" fill="#FFFFFF" opacity="0.6"/>
  </svg>
);

// Custom Google Maps styling - Retro with Information
const mapStyles = [
  {
    featureType: 'water',
    elementType: 'geometry',
    stylers: [{ color: '#6B9BD1' }, { lightness: 10 }]
  },
  {
    featureType: 'landscape',
    elementType: 'geometry',
    stylers: [{ color: '#F5F1E8' }]
  },
  {
    featureType: 'road',
    elementType: 'geometry',
    stylers: [{ color: '#FFFFFF' }]
  },
  {
    featureType: 'road',
    elementType: 'geometry.stroke',
    stylers: [{ color: '#D8D8D8' }]
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry',
    stylers: [{ color: '#FFE8D6' }]
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry.stroke',
    stylers: [{ color: '#E07A5F' }]
  },
  {
    featureType: 'poi.park',
    elementType: 'geometry',
    stylers: [{ color: '#B8D4B8' }]
  },
  {
    featureType: 'all',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#3D405B' }, { saturation: -20 }]
  },
  {
    featureType: 'all',
    elementType: 'labels.text.stroke',
    stylers: [{ color: '#FFFFFF' }, { weight: 3 }]
  }
];

const ShotgunAI = () => {
  // Load Google Maps
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    libraries,
  });

  // View management
  const [currentView, setCurrentView] = useState('lobby'); // lobby, dashboard

  // Theme
  const [darkMode, setDarkMode] = useState(false);

  // Group management
  const [groupName, setGroupName] = useState('');
  const [savedGroups, setSavedGroups] = useState([]);
  const [showSaveGroupModal, setShowSaveGroupModal] = useState(false);
  const [groupToDelete, setGroupToDelete] = useState(null);

  // Member state
  const [members, setMembers] = useState([]);
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberVehicle, setNewMemberVehicle] = useState('gas');

  // City state
  const [defaultCity, setDefaultCity] = useState(null);
  const predefinedCities = [
    { name: 'Seattle', lat: 47.6062, lng: -122.3321 },
    { name: 'San Francisco', lat: 37.7749, lng: -122.4194 },
    { name: 'New York', lat: 40.7128, lng: -74.0060 },
    { name: 'Los Angeles', lat: 34.0522, lng: -118.2437 },
    { name: 'Chicago', lat: 41.8781, lng: -87.6298 },
    { name: 'Austin', lat: 30.2672, lng: -97.7431 },
  ];

  // Trip state
  const [trips, setTrips] = useState([]);
  const [showTripModal, setShowTripModal] = useState(false);
  const [editingTrip, setEditingTrip] = useState(null);
  const [tripDriver, setTripDriver] = useState('');
  const [tripFrom, setTripFrom] = useState('');
  const [tripTo, setTripTo] = useState('');
  const [tripDistance, setTripDistance] = useState('');
  const [tripPassengers, setTripPassengers] = useState([]);
  const [isDD, setIsDD] = useState(false);
  const [isRoundTrip, setIsRoundTrip] = useState(false);

  // Slot machine
  const [showSlotMachine, setShowSlotMachine] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [slotMachineSpinning, setSlotMachineSpinning] = useState(false);
  const [currentSlotName, setCurrentSlotName] = useState('');

  // Delete confirmation
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);

  // Stats card
  const [showStatsCard, setShowStatsCard] = useState(false);

  // Achievements
  const [achievements, setAchievements] = useState([]);
  const [dismissedAchievements, setDismissedAchievements] = useState([]);

  // Map state
  const [directions, setDirections] = useState(null);
  const [allTripDirections, setAllTripDirections] = useState([]);
  const [selectedTripForMap, setSelectedTripForMap] = useState('all'); // 'all' or trip id
  const mapRef = useRef(null);
  const fromAutocompleteRef = useRef(null);
  const toAutocompleteRef = useRef(null);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedGroupName = localStorage.getItem('shotgunCurrentGroupName');
    const groupsList = localStorage.getItem('shotgunGroupsList');

    if (groupsList) setSavedGroups(JSON.parse(groupsList));

    // If there's a current group, load from that group's data
    if (savedGroupName) {
      const groupData = localStorage.getItem(`shotgunGroup_${savedGroupName}`);
      console.log('🔍 Looking for group:', savedGroupName, 'Found:', !!groupData);
      if (groupData) {
        const parsed = JSON.parse(groupData);
        console.log('📂 Loaded group data:', savedGroupName, {
          membersCount: parsed.members?.length || 0,
          tripsCount: parsed.trips?.length || 0,
          memberNames: parsed.members?.map(m => m.name) || [],
          membersData: parsed.members || []
        });
        setMembers(parsed.members || []);
        setTrips(parsed.trips || []);
        setDefaultCity(parsed.defaultCity || null);
        setAchievements(parsed.achievements || []);
        setGroupName(savedGroupName);
        return; // Don't load from generic localStorage
      } else {
        console.log('⚠️ Group data not found for:', savedGroupName);
      }
    }

    // Otherwise, load from generic localStorage (for backward compatibility)
    const savedMembers = localStorage.getItem('shotgunMembers');
    const savedTrips = localStorage.getItem('shotgunTrips');
    const savedCity = localStorage.getItem('shotgunCity');
    const savedAchievements = localStorage.getItem('shotgunAchievements');

    if (savedMembers) {
      const members = JSON.parse(savedMembers);
      setMembers(members);
      console.log('📂 Loaded generic data:', { membersCount: members.length, membersWithPoints: members.filter(m => m.points > 0).length });
    }
    if (savedTrips) setTrips(JSON.parse(savedTrips));
    if (savedCity) setDefaultCity(JSON.parse(savedCity));
    if (savedAchievements) setAchievements(JSON.parse(savedAchievements));
  }, []);

  // Save to localStorage whenever data changes
  useEffect(() => {
    // Skip saving on initial mount (empty data)
    if (members.length === 0 && trips.length === 0 && !defaultCity) {
      console.log('⏭️ Skipping save - no data yet');
      return;
    }

    // Save to generic localStorage (for backward compatibility and auto-save)
    localStorage.setItem('shotgunMembers', JSON.stringify(members));
    localStorage.setItem('shotgunTrips', JSON.stringify(trips));
    localStorage.setItem('shotgunAchievements', JSON.stringify(achievements));
    if (defaultCity) {
      localStorage.setItem('shotgunCity', JSON.stringify(defaultCity));
    }

    // Also update the current group if one is loaded
    if (groupName) {
      const groupData = {
        name: groupName,
        members,
        trips,
        defaultCity,
        achievements,
        timestamp: new Date().toISOString()
      };
      localStorage.setItem(`shotgunGroup_${groupName}`, JSON.stringify(groupData));
      console.log('💾 Saved group data:', groupName, {
        membersCount: members.length,
        tripsCount: trips.length,
        memberNames: members.map(m => m.name),
        membersWithPoints: members.filter(m => m.points > 0).map(m => ({ name: m.name, points: m.points }))
      });
    } else {
      console.log('💾 Saved generic data:', {
        membersCount: members.length,
        tripsCount: trips.length,
        memberNames: members.map(m => m.name)
      });
    }
  }, [members, trips, defaultCity, achievements, groupName]);

  // Auto-dismiss achievements after 5 seconds
  useEffect(() => {
    const undismissedAchievements = achievements.filter(a => !dismissedAchievements.includes(a.id));

    if (undismissedAchievements.length > 0) {
      const timers = undismissedAchievements.map(achievement =>
        setTimeout(() => {
          setDismissedAchievements(prev => [...prev, achievement.id]);
        }, 5000)
      );

      return () => {
        timers.forEach(timer => clearTimeout(timer));
      };
    }
  }, [achievements, dismissedAchievements]);

  // Calculate route when from/to addresses change
  useEffect(() => {
    if (tripFrom && tripTo && window.google) {
      const directionsService = new window.google.maps.DirectionsService();

      directionsService.route(
        {
          origin: tripFrom,
          destination: tripTo,
          travelMode: window.google.maps.TravelMode.DRIVING,
        },
        (result, status) => {
          if (status === 'OK') {
            setDirections(result);
            const distanceInMiles = (result.routes[0].legs[0].distance.value / 1609.34).toFixed(1);
            setTripDistance(distanceInMiles);
          }
        }
      );
    }
  }, [tripFrom, tripTo]);

  // Load trip routes for map visualization based on selected filter
  useEffect(() => {
    if (trips.length > 0 && window.google) {
      const directionsService = new window.google.maps.DirectionsService();
      const loadedDirections = [];

      // Determine which trips to load
      const tripsToLoad = selectedTripForMap === 'all'
        ? trips.slice(0, 10)
        : trips.filter(t => t.id === parseInt(selectedTripForMap));

      tripsToLoad.forEach((trip) => {
        if (trip.from && trip.to) {
          directionsService.route(
            {
              origin: trip.from,
              destination: trip.to,
              travelMode: window.google.maps.TravelMode.DRIVING,
            },
            (result, status) => {
              if (status === 'OK') {
                loadedDirections.push({
                  id: trip.id,
                  directions: result,
                  driver: trip.driver,
                  from: trip.from,
                  to: trip.to,
                  distance: trip.distance,
                });
                setAllTripDirections([...loadedDirections]);
              }
            }
          );
        }
      });
    } else {
      setAllTripDirections([]);
    }
  }, [trips, selectedTripForMap]);

  // Auto-fit map bounds when viewing a single trip
  useEffect(() => {
    if (selectedTripForMap !== 'all' && allTripDirections.length > 0 && mapRef.current) {
      const bounds = new window.google.maps.LatLngBounds();
      allTripDirections[0].directions.routes[0].overview_path.forEach(point => {
        bounds.extend(point);
      });
      mapRef.current.fitBounds(bounds);
    }
  }, [allTripDirections, selectedTripForMap]);

  // Add member
  const addMember = (e) => {
    e.preventDefault();
    if (!newMemberName.trim()) return;

    const newMember = {
      id: Date.now(),
      name: newMemberName.trim(),
      vehicleType: newMemberVehicle,
      points: 0,
      tripCount: 0,
      milesDriven: 0,
      ddCount: 0,
    };

    setMembers([...members, newMember]);
    setNewMemberName('');
    setNewMemberVehicle('gas');
  };

  // Remove member
  const removeMember = (id) => {
    setMembers(members.filter(m => m.id !== id));
  };

  // Toggle passenger
  const togglePassenger = (memberId) => {
    if (tripPassengers.includes(memberId)) {
      setTripPassengers(tripPassengers.filter(id => id !== memberId));
    } else {
      setTripPassengers([...tripPassengers, memberId]);
    }
  };

  // Save current group
  const saveGroup = (name) => {
    if (!name.trim()) return;

    const groupData = {
      name: name.trim(),
      members,
      trips,
      defaultCity,
      achievements,
      timestamp: new Date().toISOString()
    };

    console.log('Saving group:', name.trim(), groupData);

    // Save to localStorage with group name as key
    localStorage.setItem(`shotgunGroup_${name.trim()}`, JSON.stringify(groupData));

    // Update groups list
    const updatedGroups = savedGroups.filter(g => g !== name.trim());
    updatedGroups.unshift(name.trim());
    setSavedGroups(updatedGroups);
    localStorage.setItem('shotgunGroupsList', JSON.stringify(updatedGroups));

    // Set current group name
    setGroupName(name.trim());
    localStorage.setItem('shotgunCurrentGroupName', name.trim());

    // Also update the regular localStorage immediately
    localStorage.setItem('shotgunMembers', JSON.stringify(members));
    localStorage.setItem('shotgunTrips', JSON.stringify(trips));
    localStorage.setItem('shotgunCity', JSON.stringify(defaultCity));
    localStorage.setItem('shotgunAchievements', JSON.stringify(achievements));

    setShowSaveGroupModal(false);
  };

  // Load a saved group
  const loadGroup = (name) => {
    const groupData = localStorage.getItem(`shotgunGroup_${name}`);
    console.log('🔄 Loading group:', name, 'Data exists:', !!groupData);

    if (groupData) {
      const parsed = JSON.parse(groupData);
      console.log('📂 Parsed group data:', {
        name: parsed.name,
        membersCount: parsed.members?.length || 0,
        tripsCount: parsed.trips?.length || 0,
        memberNames: parsed.members?.map(m => m.name) || [],
        fullMembersData: parsed.members
      });

      setMembers(parsed.members || []);
      setTrips(parsed.trips || []);
      setDefaultCity(parsed.defaultCity || null);
      setAchievements(parsed.achievements || []);
      setGroupName(name);
      localStorage.setItem('shotgunCurrentGroupName', name);

      // Also update the regular localStorage for auto-save
      localStorage.setItem('shotgunMembers', JSON.stringify(parsed.members || []));
      localStorage.setItem('shotgunTrips', JSON.stringify(parsed.trips || []));
      localStorage.setItem('shotgunCity', JSON.stringify(parsed.defaultCity || null));
      localStorage.setItem('shotgunAchievements', JSON.stringify(parsed.achievements || []));

      // Automatically go to dashboard
      setCurrentView('dashboard');
    } else {
      console.error('❌ No group data found for:', name);
    }
  };

  // Delete a saved group
  const deleteGroup = (name) => {
    // Remove from localStorage
    localStorage.removeItem(`shotgunGroup_${name}`);

    // Update groups list
    const updatedGroups = savedGroups.filter(g => g !== name);
    setSavedGroups(updatedGroups);
    localStorage.setItem('shotgunGroupsList', JSON.stringify(updatedGroups));

    // If we're deleting the current group, clear the current group name
    if (groupName === name) {
      setGroupName('');
      localStorage.removeItem('shotgunCurrentGroupName');
    }

    setGroupToDelete(null);
  };

  // Calculate points
  const calculatePoints = (distance, isDD) => {
    // Base points: Driver gains points based on distance
    // Formula: distance × 2 (base multiplier) + small flat bonus
    let driverPoints = distance * 2;

    // Small distance bonus: Add 10% flat bonus (not compounding)
    // This keeps it more linear while still rewarding longer trips slightly
    driverPoints = driverPoints + (distance * 0.1);

    // DD bonus: 30% more points for designated driver (reduced from 50%)
    if (isDD) {
      driverPoints = driverPoints * 1.3;
    }

    // Passenger penalty: Each passenger loses some points (but less than driver gains)
    // This encourages rotation while keeping it fair
    const passengerPoints = -(distance * 0.5);

    console.log('Points calculation:', { distance, isDD, driverPoints, passengerPoints });

    return { driverPoints, passengerPoints };
  };

  // Check for achievements
  const checkAchievements = (member, tripCount, totalMiles, ddCount) => {
    const newAchievements = [];

    // First trip
    if (tripCount === 1) {
      newAchievements.push({
        id: `${member.id}-first-trip-${Date.now()}`,
        name: '🚗 First Ride',
        description: 'Completed your first trip!',
        memberName: member.name,
      });
    }

    // Marathon driver
    if (tripCount === 10) {
      newAchievements.push({
        id: `${member.id}-marathon-${Date.now()}`,
        name: '🏆 Marathon Driver',
        description: 'Completed 10 trips!',
        memberName: member.name,
      });
    }

    // Road warrior
    if (totalMiles >= 100) {
      newAchievements.push({
        id: `${member.id}-warrior-${Date.now()}`,
        name: '⚔️ Road Warrior',
        description: 'Drove 100+ miles!',
        memberName: member.name,
      });
    }

    // DD Hero
    if (ddCount === 5) {
      newAchievements.push({
        id: `${member.id}-dd-hero-${Date.now()}`,
        name: '🍺 DD Hero',
        description: 'Designated Driver 5 times!',
        memberName: member.name,
      });
    }

    if (newAchievements.length > 0) {
      setAchievements([...achievements, ...newAchievements]);
    }
  };

  // Log trip
  const logTrip = (e) => {
    e.preventDefault();
    if (!tripDriver || !tripFrom || !tripTo || !tripDistance || tripPassengers.length === 0) return;

    const baseDistance = parseFloat(tripDistance);
    const distance = isRoundTrip ? baseDistance * 2 : baseDistance;
    const driverMember = members.find(m => m.id === parseInt(tripDriver));
    const passengerMembers = members.filter(m => tripPassengers.includes(m.id));

    const { driverPoints, passengerPoints } = calculatePoints(distance, isDD);

    // If editing, first reverse the old trip's points
    let membersToUpdate = [...members];
    if (editingTrip) {
      membersToUpdate = membersToUpdate.map(member => {
        if (member.id === editingTrip.driverId) {
          // Reverse old driver points and stats
          return {
            ...member,
            points: Math.max(0, member.points - (editingTrip.driverPoints || 0)),
            tripCount: Math.max(0, member.tripCount - 1),
            milesDriven: Math.max(0, member.milesDriven - editingTrip.distance),
            ddCount: editingTrip.isDD ? Math.max(0, member.ddCount - 1) : member.ddCount,
          };
        } else if (editingTrip.passengerIds && editingTrip.passengerIds.includes(member.id)) {
          // Reverse old passenger penalty
          return {
            ...member,
            points: member.points - (editingTrip.passengerPoints || 0), // Remove negative = add back
          };
        }
        return member;
      });
    }

    // Update members with new trip data
    const updatedMembers = membersToUpdate.map(member => {
      if (member.id === parseInt(tripDriver)) {
        // Driver gains points
        const newTripCount = editingTrip ? member.tripCount + 1 : member.tripCount + 1;
        const newMilesDriven = member.milesDriven + distance;
        const newDDCount = isDD ? member.ddCount + 1 : member.ddCount;

        // Check achievements (only for new trips)
        if (!editingTrip) {
          setTimeout(() => checkAchievements(member, newTripCount, newMilesDriven, newDDCount), 500);
        }

        return {
          ...member,
          points: member.points + driverPoints,
          tripCount: newTripCount,
          milesDriven: newMilesDriven,
          ddCount: newDDCount,
        };
      } else if (tripPassengers.includes(member.id)) {
        // Passengers lose points
        return {
          ...member,
          points: Math.max(0, member.points + passengerPoints), // Don't go below 0
        };
      }
      return member;
    });

    // Create trip record
    const newTrip = {
      id: editingTrip ? editingTrip.id : Date.now(),
      driver: driverMember.name,
      driverId: driverMember.id,
      from: tripFrom,
      to: tripTo,
      distance,
      baseDistance: baseDistance,
      passengers: passengerMembers.map(m => m.name).join(', '),
      passengerIds: tripPassengers,
      passengerCount: tripPassengers.length,
      isDD,
      isRoundTrip,
      driverPoints,
      passengerPoints,
      timestamp: editingTrip ? editingTrip.timestamp : new Date().toISOString(),
    };

    if (editingTrip) {
      // Update existing trip
      setTrips(trips.map(t => t.id === editingTrip.id ? newTrip : t));
    } else {
      // Add new trip
      setTrips([newTrip, ...trips]);
    }

    setMembers(updatedMembers);
    resetTripForm();
  };

  // Edit trip
  const editTrip = (trip) => {
    setEditingTrip(trip);
    setTripDriver(trip.driverId.toString());
    setTripFrom(trip.from);
    setTripTo(trip.to);
    setTripDistance((trip.baseDistance || trip.distance).toString());
    setTripPassengers(trip.passengerIds);
    setIsDD(trip.isDD);
    setIsRoundTrip(trip.isRoundTrip || false);
    setShowTripModal(true);
  };

  // Delete trip
  const deleteTrip = (tripId) => {
    const trip = trips.find(t => t.id === tripId);
    if (!trip) return;

    // Reverse the points
    const updatedMembers = members.map(member => {
      if (member.id === trip.driverId) {
        // Reverse driver points
        return {
          ...member,
          points: Math.max(0, member.points - (trip.driverPoints || 0)),
          tripCount: Math.max(0, member.tripCount - 1),
          milesDriven: Math.max(0, member.milesDriven - trip.distance),
          ddCount: trip.isDD ? Math.max(0, member.ddCount - 1) : member.ddCount,
        };
      } else if (trip.passengerIds && trip.passengerIds.includes(member.id)) {
        // Reverse passenger penalty (they get points back)
        return {
          ...member,
          points: member.points - (trip.passengerPoints || 0), // Remove negative points = add back
        };
      }
      return member;
    });

    setMembers(updatedMembers);
    setTrips(trips.filter(t => t.id !== tripId));
    setShowDeleteConfirm(null);
  };

  // Reset trip form
  const resetTripForm = () => {
    setShowTripModal(false);
    setEditingTrip(null);
    setTripDriver('');
    setTripFrom('');
    setTripTo('');
    setTripDistance('');
    setTripPassengers([]);
    setIsDD(false);
    setIsRoundTrip(false);
    setDirections(null);
  };

  // Calculate next driver (slot machine)
  const calculateNextDriver = () => {
    if (members.length === 0) return;

    setShowSlotMachine(true);
    setSlotMachineSpinning(true);

    // Spin animation
    let spinCount = 0;
    const spinInterval = setInterval(() => {
      const randomMember = members[Math.floor(Math.random() * members.length)];
      setCurrentSlotName(randomMember.name);
      spinCount++;

      if (spinCount >= 20) {
        clearInterval(spinInterval);

        // Calculate actual winner
        const sortedByPoints = [...members].sort((a, b) => a.points - b.points);
        const lowestPoints = sortedByPoints[0].points;
        const tied = sortedByPoints.filter(m => m.points === lowestPoints);
        const winner = tied.reduce((min, member) =>
          member.ddCount < min.ddCount ? member : min
        , tied[0]);

        setCurrentSlotName(winner.name);
        setSelectedDriver(winner);
        setSlotMachineSpinning(false);
      }
    }, 100);
  };

  // Export to CSV
  const exportToCSV = () => {
    const headers = ['Date', 'Driver', 'From', 'To', 'Distance (mi)', 'Passengers', 'DD', 'Driver Points', 'Passenger Points'];
    const rows = trips.map(trip => [
      new Date(trip.timestamp).toLocaleDateString(),
      trip.driver,
      trip.from,
      trip.to,
      trip.distance,
      trip.passengers,
      trip.isDD ? 'Yes' : 'No',
      (trip.driverPoints || trip.points || 0).toFixed(1),
      (trip.passengerPoints || 0).toFixed(1),
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `shotgun-trips-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  // Get group stats
  const getGroupStats = () => {
    const totalMiles = trips.reduce((sum, trip) => sum + trip.distance, 0);
    const totalTrips = trips.length;
    const totalDDTrips = trips.filter(t => t.isDD).length;
    const avgTripDistance = totalTrips > 0 ? (totalMiles / totalTrips).toFixed(1) : 0;

    // Environmental impact (rough estimates)
    const co2SavedKg = (totalMiles * 0.4).toFixed(1); // ~0.4 kg CO2 per mile saved
    const moneySaved = (totalMiles * 0.58).toFixed(2); // ~$0.58 per mile (IRS rate)

    // Most frequent route
    const routeCounts = {};
    trips.forEach(trip => {
      const route = `${trip.from} → ${trip.to}`;
      routeCounts[route] = (routeCounts[route] || 0) + 1;
    });
    const mostFrequentRoute = Object.keys(routeCounts).length > 0
      ? Object.entries(routeCounts).sort((a, b) => b[1] - a[1])[0][0]
      : 'N/A';

    return {
      totalMiles: totalMiles.toFixed(1),
      totalTrips,
      totalDDTrips,
      avgTripDistance,
      co2SavedKg,
      moneySaved,
      mostFrequentRoute,
    };
  };

  // Reset all data
  const resetAllData = () => {
    if (window.confirm('Are you sure you want to reset all data? This cannot be undone!')) {
      setMembers([]);
      setTrips([]);
      setAchievements([]);
      setDismissedAchievements([]);
      setDefaultCity(null);
      localStorage.clear();
    }
  };

  // Map center
  const mapCenter = defaultCity || { lat: 47.6062, lng: -122.3321 }; // Default to Seattle

  if (loadError) return <div className="p-8 text-center">Error loading maps</div>;
  if (!isLoaded) return <div className="p-8 text-center">Loading maps...</div>;

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

          .mono-font-small {
            font-family: 'IBM Plex Mono', 'Courier New', monospace;
            line-height: 1.7;
            font-size: 0.875rem;
          }

          .future-font {
            font-family: 'Orbitron', sans-serif;
            letter-spacing: 0.05em;
          }

          .future-font-display {
            font-family: 'Orbitron', sans-serif;
            font-weight: 900;
            letter-spacing: 0.08em;
          }

          .future-font-heading {
            font-family: 'Orbitron', sans-serif;
            font-weight: 700;
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

          /* Animated grid background */
          .terminal-grid {
            background-image:
              linear-gradient(rgba(61, 64, 91, 0.03) 2px, transparent 2px),
              linear-gradient(90deg, rgba(61, 64, 91, 0.03) 2px, transparent 2px);
            background-size: 50px 50px;
            animation: gridScroll 20s linear infinite;
          }

          @keyframes gridScroll {
            0% { background-position: 0 0; }
            100% { background-position: 50px 50px; }
          }

          .burnt-orange {
            color: #E07A5F;
          }

          .deep-forest {
            color: #3D405B;
          }

          .dark-mode-bg .deep-forest {
            color: #FFFFFF;
          }

          .dark-mode-bg .text-gray-500,
          .dark-mode-bg .text-gray-600 {
            color: #FFFFFF !important;
          }

          .soft-gold {
            color: #F4A261;
          }

          /* Mesh Gradient Background */
          .mesh-gradient {
            background:
              radial-gradient(at 20% 30%, rgba(224, 122, 95, 0.15) 0px, transparent 50%),
              radial-gradient(at 80% 70%, rgba(244, 162, 97, 0.12) 0px, transparent 50%),
              radial-gradient(at 50% 50%, rgba(61, 64, 91, 0.08) 0px, transparent 50%);
          }

          /* Button Animations - ENHANCED PUNK STYLE */
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

          .pixel-button-secondary {
            background: linear-gradient(135deg, #3D405B 0%, #2A2C3E 100%);
            border: 5px solid #E07A5F;
            box-shadow:
              6px 6px 0px #E07A5F,
              0 0 25px rgba(224, 122, 95, 0.4),
              inset 0 1px 3px rgba(255, 255, 255, 0.2);
            transition: all 0.15s cubic-bezier(0.4, 0, 0.2, 1);
            cursor: pointer;
            text-transform: uppercase;
            letter-spacing: 3px;
            position: relative;
            overflow: hidden;
          }

          .pixel-button-secondary::after {
            content: '';
            position: absolute;
            top: 50%;
            left: 50%;
            width: 0;
            height: 0;
            background: radial-gradient(circle, rgba(255, 255, 255, 0.3) 0%, transparent 70%);
            transform: translate(-50%, -50%);
            transition: width 0.6s, height 0.6s;
            border-radius: 50%;
          }

          .pixel-button-secondary:hover::after {
            width: 300px;
            height: 300px;
          }

          .pixel-button-secondary:hover {
            transform: translateY(-4px) translateX(-2px);
            box-shadow:
              10px 10px 0px #E07A5F,
              0 0 40px rgba(224, 122, 95, 0.7),
              inset 0 1px 3px rgba(255, 255, 255, 0.3);
            filter: brightness(1.2);
          }

          .pixel-button-secondary:active {
            transform: translateY(3px) translateX(3px);
            box-shadow:
              3px 3px 0px #E07A5F,
              0 0 15px rgba(224, 122, 95, 0.5);
          }

          /* Card Pop-in Animation */
          @keyframes popIn {
            0% {
              opacity: 0;
              transform: scale(0.8) translateY(20px);
            }
            60% {
              transform: scale(1.05) translateY(-5px);
            }
            100% {
              opacity: 1;
              transform: scale(1) translateY(0);
            }
          }

          .pop-in {
            animation: popIn 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
          }

          /* Progress Bar Animation */
          .progress-fill {
            transition: width 1.5s cubic-bezier(0.4, 0, 0.2, 1);
          }

          /* Modal Slide Up */
          @keyframes slideUp {
            from {
              opacity: 0;
              transform: translateY(100px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          .slide-up {
            animation: slideUp 0.3s ease-out;
          }

          /* Slot Machine Spin */
          @keyframes slotSpin {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
          }

          .slot-spinning {
            animation: slotSpin 0.1s linear infinite;
          }

          /* NEO-BRUTALISM HARD SHADOWS - ENHANCED */
          .shadow-retro {
            box-shadow:
              8px 8px 0px 0px #3D405B,
              0 0 20px rgba(0, 0, 0, 0.3),
              inset 0 1px 0 rgba(255, 255, 255, 0.4);
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          }

          .shadow-retro:hover {
            box-shadow:
              12px 12px 0px 0px #3D405B,
              0 0 35px rgba(0, 0, 0, 0.4),
              inset 0 1px 0 rgba(255, 255, 255, 0.5);
            transform: translateY(-2px);
          }

          .shadow-retro-active {
            box-shadow: 4px 4px 0px 0px #3D405B;
            transform: translate(4px, 4px);
          }

          .shadow-retro-lg {
            box-shadow:
              12px 12px 0px 0px #3D405B,
              0 0 40px rgba(0, 0, 0, 0.5),
              inset 0 2px 0 rgba(255, 255, 255, 0.3),
              inset 0 -2px 20px rgba(0, 0, 0, 0.1);
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          }

          .shadow-retro-lg:hover {
            box-shadow:
              16px 16px 0px 0px #3D405B,
              0 0 60px rgba(0, 0, 0, 0.6),
              inset 0 2px 0 rgba(255, 255, 255, 0.4),
              inset 0 -2px 20px rgba(0, 0, 0, 0.15);
            transform: translateY(-3px);
          }

          .shadow-retro-orange {
            box-shadow:
              8px 8px 0px 0px #E07A5F,
              0 0 30px rgba(224, 122, 95, 0.5),
              inset 0 1px 0 rgba(255, 255, 255, 0.3);
          }

          .shadow-retro-teal {
            box-shadow:
              8px 8px 0px 0px #2A9D8F,
              0 0 30px rgba(42, 157, 143, 0.5),
              inset 0 1px 0 rgba(255, 255, 255, 0.3);
          }

          /* PIXELATED ICONS */
          .pixel-icon {
            stroke-width: 4px;
            stroke-linecap: square;
            stroke-linejoin: miter;
            image-rendering: pixelated;
            image-rendering: -moz-crisp-edges;
            image-rendering: crisp-edges;
            filter: contrast(1.2) brightness(1.1);
            transform: scale(0.95);
          }

          /* TERMINAL INPUT STYLES - Enhanced */
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

          .dark-mode-bg .retro-input {
            background: #4B5563;
            border-color: #6B7280;
            color: #FFFFFF;
            box-shadow: none;
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

          .dark-mode-bg .retro-input:focus {
            background: #374151;
            color: #FFFFFF;
            border-color: #FF6B4A;
            box-shadow: 0 0 20px rgba(255, 107, 74, 0.4);
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

          .dark-mode-bg .retro-input::placeholder {
            color: rgba(255, 255, 255, 0.5);
          }

          /* PAPER GRAIN TEXTURE */
          .paper-grain {
            background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.05'/%3E%3C/svg%3E");
          }


          /* NEON TITLE - Glow on Hover Only */
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

          /* NEON GLOW EFFECTS */
          .neon-orange {
            text-shadow:
              0 0 5px #E07A5F,
              0 0 10px #E07A5F,
              0 0 20px #E07A5F,
              0 0 40px #E07A5F;
            animation: neonPulse 2s infinite alternate;
          }

          .neon-teal {
            text-shadow:
              0 0 5px #2A9D8F,
              0 0 10px #2A9D8F,
              0 0 20px #2A9D8F,
              0 0 40px #2A9D8F;
            animation: neonPulse 2s infinite alternate;
          }

          @keyframes neonPulse {
            0% {
              filter: brightness(1) saturate(1);
            }
            100% {
              filter: brightness(1.2) saturate(1.3);
            }
          }

          /* AGGRESSIVE BORDERS */
          .punk-border {
            border-width: 5px;
            border-style: solid;
            position: relative;
          }

          /* TOOLTIP */
          .tooltip {
            position: relative;
            display: inline-block;
            cursor: help;
          }

          .tooltip .tooltiptext {
            visibility: hidden;
            width: 280px;
            background: linear-gradient(135deg, #3D405B 0%, #2A2C3E 100%);
            color: #fff;
            text-align: left;
            border: 3px solid #E07A5F;
            box-shadow: 4px 4px 0px 0px #E07A5F;
            padding: 12px;
            position: absolute;
            z-index: 1000;
            top: -10px;
            right: 105%;
            opacity: 0;
            transition: opacity 0.3s, visibility 0.3s;
            font-size: 11px;
            line-height: 1.4;
          }

          .tooltip:hover .tooltiptext {
            visibility: visible;
            opacity: 1;
          }

          .tooltip .tooltiptext::after {
            content: '';
            position: absolute;
            top: 20px;
            left: 100%;
            border-width: 8px;
            border-style: solid;
            border-color: transparent transparent transparent #E07A5F;
          }

          /* Badge Styles */
          .badge {
            display: inline-flex;
            align-items: center;
            gap: 4px;
            padding: 2px 8px;
            border-radius: 4px;
            font-size: 10px;
            font-weight: bold;
            border: 1px solid currentColor;
          }

          /* Car Slider Styles - Gamified with Tick Marks */
          .car-slider {
            position: relative;
            height: 50px;
            background:
              linear-gradient(135deg, #f5f5f5 0%, #e8e8e8 100%),
              repeating-linear-gradient(
                90deg,
                transparent 0%,
                transparent 9%,
                rgba(255, 255, 255, 0.8) 9%,
                rgba(255, 255, 255, 0.8) 10%
              );
            border-radius: 25px;
            border: 4px solid #3D405B;
            overflow: visible;
            box-shadow:
              inset 0 3px 6px rgba(0,0,0,0.15),
              inset 0 -1px 2px rgba(255,255,255,0.8),
              0 2px 8px rgba(0,0,0,0.2);
          }

          .car-icon-wrapper {
            position: absolute;
            top: 50%;
            transform: translateY(-50%) scale(1.4);
            transition: left 1.2s cubic-bezier(0.4, 0, 0.2, 1);
            filter:
              drop-shadow(3px 3px 5px rgba(0,0,0,0.4))
              drop-shadow(0 0 15px rgba(255, 107, 74, 0.6));
            animation: carBounce 2s ease-in-out infinite;
            z-index: 10;
          }

          @keyframes carBounce {
            0%, 100% { transform: translateY(-50%) scale(1.4); }
            50% { transform: translateY(-55%) scale(1.5); }
          }

          .car-track-fill {
            position: absolute;
            top: 0;
            left: 0;
            height: 100%;
            background:
              linear-gradient(90deg,
                #FF6B4A 0%,
                #E85D3C 25%,
                #F4A261 50%,
                #E85D3C 75%,
                #FF6B4A 100%
              );
            background-size: 200% 100%;
            animation: trackShimmer 3s linear infinite;
            transition: width 1.2s cubic-bezier(0.4, 0, 0.2, 1);
            opacity: 0.4;
            box-shadow: 0 0 20px rgba(255, 107, 74, 0.5);
          }

          @keyframes trackShimmer {
            0% { background-position: 200% 0; }
            100% { background-position: 0 0; }
          }

          /* GLITCH EFFECT */
          .glitch {
            position: relative;
          }

          .glitch::before,
          .glitch::after {
            content: attr(data-text);
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            opacity: 0;
          }

          .glitch:hover::before {
            animation: glitch-1 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94) both infinite;
            color: #FF6B4A;
            z-index: -1;
          }

          .glitch:hover::after {
            animation: glitch-2 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94) reverse both infinite;
            color: #2A9D8F;
            z-index: -2;
          }

          @keyframes glitch-1 {
            0% {
              transform: translate(0);
              opacity: 0;
            }
            20% {
              transform: translate(-2px, 2px);
              opacity: 0.8;
            }
            40% {
              transform: translate(-2px, -2px);
              opacity: 0;
            }
            60% {
              transform: translate(2px, 2px);
              opacity: 0.8;
            }
            80% {
              transform: translate(2px, -2px);
              opacity: 0;
            }
            100% {
              transform: translate(0);
              opacity: 0;
            }
          }

          @keyframes glitch-2 {
            0% {
              transform: translate(0);
              opacity: 0;
            }
            20% {
              transform: translate(2px, -2px);
              opacity: 0.7;
            }
            40% {
              transform: translate(2px, 2px);
              opacity: 0;
            }
            60% {
              transform: translate(-2px, -2px);
              opacity: 0.7;
            }
            80% {
              transform: translate(-2px, 2px);
              opacity: 0;
            }
            100% {
              transform: translate(0);
              opacity: 0;
            }
          }

          /* PULSE GLOW */
          .pulse-glow {
            animation: pulseGlow 2s ease-in-out infinite;
          }

          @keyframes pulseGlow {
            0%, 100% {
              box-shadow:
                6px 6px 0px #3D405B,
                0 0 20px rgba(255, 107, 74, 0.5);
            }
            50% {
              box-shadow:
                6px 6px 0px #3D405B,
                0 0 40px rgba(255, 107, 74, 0.8),
                0 0 60px rgba(255, 107, 74, 0.4);
            }
          }

          /* CARD FLOAT */
          .card-float {
            animation: cardFloat 6s ease-in-out infinite;
          }

          @keyframes cardFloat {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
          }

          /* SHINE EFFECT */
          .shine-effect {
            position: relative;
            overflow: hidden;
          }

          .shine-effect::after {
            content: '';
            position: absolute;
            top: -50%;
            left: -50%;
            width: 200%;
            height: 200%;
            background: linear-gradient(
              45deg,
              transparent 30%,
              rgba(255, 255, 255, 0.1) 50%,
              transparent 70%
            );
            transform: rotate(45deg);
            animation: shine 3s ease-in-out infinite;
          }

          @keyframes shine {
            0% { transform: translateX(-100%) translateY(-100%) rotate(45deg); }
            100% { transform: translateX(100%) translateY(100%) rotate(45deg); }
          }

          /* DARK MODE ENHANCEMENTS */
          .dark-mode-bg {
            background:
              linear-gradient(135deg, #1a1d2e 0%, #16213e 50%, #0f1419 100%),
              radial-gradient(at 20% 30%, rgba(42, 157, 143, 0.15) 0px, transparent 50%),
              radial-gradient(at 80% 70%, rgba(224, 122, 95, 0.1) 0px, transparent 50%);
            position: relative;
          }

          .dark-mode-bg::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseDark'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.7' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseDark)' opacity='0.08'/%3E%3C/svg%3E");
            pointer-events: none;
            z-index: 0;
          }


          /* STAGGERED CARD ANIMATIONS */
          .stagger-1 {
            animation: slideInUp 0.5s ease-out 0.1s both;
          }

          .stagger-2 {
            animation: slideInUp 0.5s ease-out 0.2s both;
          }

          .stagger-3 {
            animation: slideInUp 0.5s ease-out 0.3s both;
          }

          .stagger-4 {
            animation: slideInUp 0.5s ease-out 0.4s both;
          }

          @keyframes slideInUp {
            from {
              opacity: 0;
              transform: translateY(30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          /* FOCUS STATES FOR ACCESSIBILITY */
          button:focus-visible,
          input:focus-visible,
          select:focus-visible {
            outline: 3px solid #FF6B4A;
            outline-offset: 3px;
          }

          a:focus-visible {
            outline: 3px solid #2A9D8F;
            outline-offset: 3px;
            border-radius: 2px;
          }

          /* ENHANCED BUTTON ACTIVE STATE */
          button:active {
            transform: scale(0.98) translateY(2px);
          }

          /* TRIP CARD HOVER INSET SHADOW */
          .trip-card-hover:hover {
            box-shadow:
              8px 8px 0px 0px #3D405B,
              inset 0 3px 8px rgba(0, 0, 0, 0.15),
              0 0 25px rgba(0, 0, 0, 0.3);
          }

          /* PULSING GLOW FOR ACTIVE ELEMENTS */
          .active-driver-glow {
            position: relative;
          }

          .active-driver-glow::before {
            content: '';
            position: absolute;
            inset: -4px;
            background: radial-gradient(circle at center, rgba(255, 107, 74, 0.4) 0%, transparent 70%);
            border-radius: inherit;
            animation: activePulse 2s ease-in-out infinite;
            z-index: -1;
            pointer-events: none;
          }

          @keyframes activePulse {
            0%, 100% {
              opacity: 0.6;
              transform: scale(1);
            }
            50% {
              opacity: 1;
              transform: scale(1.05);
            }
          }

          /* BUTTON PULSE ANIMATION */
          .button-pulse {
            animation: buttonPulse 2s ease-in-out infinite;
          }

          @keyframes buttonPulse {
            0%, 100% {
              transform: scale(1);
              box-shadow: 6px 6px 0px #3D405B, 0 0 20px rgba(255, 107, 74, 0.4);
            }
            50% {
              transform: scale(1.02);
              box-shadow: 8px 8px 0px #3D405B, 0 0 30px rgba(255, 107, 74, 0.6);
            }
          }

          /* LOADING SKELETON */
          .skeleton {
            background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
            background-size: 200% 100%;
            animation: skeletonLoading 1.5s ease-in-out infinite;
            border-radius: 4px;
          }

          @keyframes skeletonLoading {
            0% { background-position: 200% 0; }
            100% { background-position: -200% 0; }
          }
        `}
      </style>

      {/* LOBBY */}
      {currentView === 'lobby' && (
        <div className={`mono-font transition-colors duration-300 ${darkMode ? 'dark-mode-bg text-white' : 'warm-cream-bg'}`}>
          <div className="min-h-screen flex items-center justify-center p-4">
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

              {/* Setup Card */}
              <div className={`rounded-lg punk-border shadow-retro-lg p-8 mb-6 card-float shine-effect ${
                darkMode ? 'bg-gray-800 border-gray-600' : 'bg-gradient-to-br from-white to-[#FDF8F3] border-[#3D405B]'
              }`}>
                <h2 className="pixel-font text-4xl deep-forest mb-6" style={{
                  textShadow: '2px 2px 0px rgba(224, 122, 95, 0.2)'
                }}>CREATE YOUR CREW</h2>

                {/* Add Member Form */}
                <form onSubmit={addMember} className="mb-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-bold deep-forest mb-2">
                        NAME
                      </label>
                      <input
                        type="text"
                        value={newMemberName}
                        onChange={(e) => setNewMemberName(e.target.value)}
                        className="retro-input w-full px-4 py-2 rounded"
                        placeholder="Enter name..."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold deep-forest mb-2">
                        CAR TYPE
                      </label>
                      <select
                        value={newMemberVehicle}
                        onChange={(e) => setNewMemberVehicle(e.target.value)}
                        className="retro-input w-full px-4 py-2 rounded text-[#3D405B] font-bold"
                      >
                        <option value="gas">⛽ Gas</option>
                        <option value="electric">⚡ Electric</option>
                      </select>
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="pixel-button w-full py-3 rounded-lg text-white pixel-font text-2xl"
                  >
                    ADD MEMBER
                  </button>
                </form>

                {/* Member List */}
                <div className="mb-6">
                  <h3 className="text-sm font-bold deep-forest mb-3 uppercase">Crew Members</h3>
                  <div className={`space-y-2 max-h-64 overflow-y-auto p-4 border-4 rounded ${
                    darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-[#3D405B]'
                  }`} style={{
                    boxShadow: darkMode ? 'none' : '4px 4px 0px 0px #3D405B, inset 0 2px 4px rgba(0, 0, 0, 0.05)'
                  }}>
                    {members.length === 0 ? (
                      <p className="text-center text-gray-500 italic py-8">No members yet. Add some above!</p>
                    ) : (
                      members.map((member, index) => (
                        <div
                          key={member.id}
                          className={`flex items-center justify-between p-3 rounded border-2 group ${
                            darkMode ? 'bg-gray-600 border-gray-500' : 'bg-[#FDF8F3] border-[#3D405B]'
                          }`}
                          style={{ animationDelay: `${index * 0.1}s` }}
                        >
                          <div className="flex items-center gap-3">
                            <div className="relative">
                              {member.vehicleType === 'gas' ? (
                                <Fuel size={24} className="pixel-icon text-[#E07A5F] group-hover:scale-110 transition-transform" />
                              ) : (
                                <Zap size={24} className="pixel-icon text-yellow-500 group-hover:scale-110 transition-transform" />
                              )}
                              <div className="absolute inset-0 bg-current opacity-0 group-hover:opacity-20 blur-lg transition-opacity"></div>
                            </div>
                            <span className="font-bold deep-forest group-hover:text-[#FF6B4A] transition-colors">{member.name}</span>
                          </div>
                          <button
                            onClick={() => removeMember(member.id)}
                            className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded transition-all hover:scale-110"
                            aria-label={`Remove ${member.name} from crew`}
                          >
                            <UserMinus size={18} className="pixel-icon" />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* City Selection */}
                <div className="mb-6">
                  <h3 className="text-sm font-bold deep-forest mb-3 uppercase">Select Default City</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {predefinedCities.map(city => (
                      <button
                        key={city.name}
                        onClick={() => setDefaultCity(city)}
                        className={`p-3 rounded-lg border-2 transition-all font-bold ${
                          defaultCity?.name === city.name
                            ? 'bg-[#E07A5F] text-white border-[#3D405B]'
                            : darkMode
                              ? 'bg-gray-700 border-gray-600 hover:bg-gray-600 text-white'
                              : 'bg-white border-[#3D405B] hover:bg-[#FDF8F3] text-[#3D405B]'
                        }`}
                      >
                        {city.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Group Name Display */}
                {groupName && (
                  <div className="mb-4 text-center">
                    <p className="mono-font text-sm text-gray-600">
                      Current Group: <span className="font-bold text-[#FF6B4A]">{groupName}</span>
                    </p>
                  </div>
                )}

                {/* Save & Launch Buttons */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <button
                    onClick={() => setShowSaveGroupModal(true)}
                    disabled={members.length === 0}
                    className="pixel-button-secondary py-4 rounded-lg text-white pixel-font text-xl"
                  >
                    💾 SAVE GROUP
                  </button>
                  <button
                    onClick={() => setCurrentView('dashboard')}
                    disabled={members.length === 0 || !defaultCity}
                    className="pixel-button py-4 rounded-lg text-white pixel-font text-xl"
                  >
                    🚀 LAUNCH
                  </button>
                </div>
                {!defaultCity && (
                  <p className="text-center text-red-500 text-sm">
                    Please select a default city to continue
                  </p>
                )}

                {/* Saved Groups List */}
                {savedGroups.length > 0 && (
                  <div className="mt-6">
                    <h3 className="text-sm font-bold deep-forest mb-3 uppercase">Saved Groups</h3>
                    <div className={`space-y-2 max-h-40 overflow-y-auto p-4 border-4 rounded ${
                      darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-[#3D405B]'
                    }`} style={{
                      boxShadow: darkMode ? 'none' : '4px 4px 0px 0px #3D405B, inset 0 2px 4px rgba(0, 0, 0, 0.05)'
                    }}>
                      {savedGroups.map((group) => (
                        <div
                          key={group}
                          className={`flex items-center justify-between p-3 rounded border-2 transition-all ${
                            groupName === group
                              ? 'bg-[#FF6B4A] border-[#3D405B]'
                              : darkMode
                                ? 'bg-gray-600 border-gray-500 hover:border-gray-400'
                                : 'bg-[#FDF8F3] border-[#3D405B] hover:border-[#FF6B4A]'
                          }`}
                        >
                          <button
                            onClick={() => loadGroup(group)}
                            className={`flex-1 text-left mono-font font-bold ${
                              groupName === group ? 'text-white' : darkMode ? 'text-white' : 'text-[#3D405B]'
                            }`}
                          >
                            {group}
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setGroupToDelete(group);
                            }}
                            className={`ml-2 p-2 rounded transition-all hover:scale-110 ${
                              groupName === group
                                ? 'text-white hover:bg-red-600'
                                : 'text-red-500 hover:bg-red-50'
                            }`}
                            aria-label={`Delete group ${group}`}
                          >
                            <X size={16} className="pixel-icon" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DASHBOARD */}
      {currentView === 'dashboard' && (
        <div className={`mono-font transition-colors duration-300 ${darkMode ? 'dark-mode-bg text-white' : 'warm-cream-bg'}`}>
          <div className="min-h-screen p-4 md:p-8">
            <div className="max-w-7xl mx-auto">
              {/* Header */}
              <div className="flex items-center justify-between mb-8">
                <h1 className="pixel-font text-5xl md:text-7xl neon-title glitch" data-text="SHOTGUN.AI" style={{
                  letterSpacing: '0.1em'
                }}>
                  SHOTGUN.AI
                </h1>
                <div className="flex items-center gap-2">
                  <div className="tooltip">
                    <button
                      className={`p-3 border-4 border-[#3D405B] shadow-retro transition-all ${
                        darkMode ? 'bg-green-900 text-green-300' : 'bg-green-100 text-green-700'
                      }`}
                    >
                      <Check size={20} className="pixel-icon" />
                    </button>
                    <span className="tooltiptext">
                      <strong>Auto-Save Active</strong><br/>
                      Your group data, trips, and stats are automatically saved to your browser. They'll be here next time you visit!
                    </span>
                  </div>
                  <button
                    onClick={() => setDarkMode(!darkMode)}
                    className={`p-3 border-4 border-[#3D405B] shadow-retro transition-all ${
                      darkMode ? 'bg-gray-800 text-yellow-400' : 'bg-white text-gray-700'
                    }`}
                    aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
                  >
                    {darkMode ? <Sun size={20} className="pixel-icon" /> : <Moon size={20} className="pixel-icon" />}
                  </button>
                  <button
                    onClick={() => setCurrentView('lobby')}
                    className="p-3 border-4 border-[#3D405B] bg-white text-[#3D405B] shadow-retro transition-all"
                    aria-label="Go to settings"
                  >
                    <Settings size={20} className="pixel-icon" />
                  </button>
                </div>
              </div>

              {/* Main Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                {/* Leaderboard Card */}
                <div className={`rounded-lg punk-border shadow-retro-lg overflow-hidden flex flex-col stagger-1 ${
                  darkMode ? 'bg-gray-800 border-gray-600' : 'bg-white border-[#3D405B]'
                }`}>
                  <div className="bg-gradient-to-r from-[#E07A5F] to-[#F4A261] p-4 border-b-4 border-[#3D405B]">
                    <div className="flex items-center justify-between">
                      <h2 className="pixel-font text-3xl text-white flex items-center gap-2">
                        <Crown className="pixel-icon" />
                        LEADERBOARD
                      </h2>
                      <div className="tooltip">
                        <AlertCircle size={20} className="pixel-icon text-white cursor-help" />
                        <span className="tooltiptext">
                          <strong>How Points Work:</strong><br/>
                          • Driver: Gains 2.1× distance<br/>
                          • DD Bonus: +30% points<br/>
                          • Passengers: Lose 0.5× distance<br/>
                          • Lower points = drive next!<br/>
                          <br/>
                          <em>Example: 10mi trip</em><br/>
                          Driver: +21 pts | DD: +27 pts | Passengers: -5 pts each
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 flex-1">
                    {members.length === 0 ? (
                      <p className={`text-center py-8 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        No members yet
                      </p>
                    ) : (
                      <div className="space-y-4">
                        {[...members]
                          .sort((a, b) => b.points - a.points)
                          .map((member, index) => {
                            const maxPoints = Math.max(...members.map(m => m.points), 1);
                            const percentage = (member.points / maxPoints) * 100;

                            return (
                              <div key={member.id} className="space-y-2">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-3">
                                    <span className="text-2xl font-bold deep-forest">
                                      {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
                                    </span>
                                    <div>
                                      <div className="flex items-center gap-2">
                                        <span className="font-bold deep-forest">{member.name}</span>
                                        {member.vehicleType === 'gas' ? (
                                          <Fuel size={18} className="pixel-icon text-[#E07A5F]" />
                                        ) : (
                                          <Zap size={18} className="pixel-icon text-yellow-500" />
                                        )}
                                        {member.ddCount > 0 && (
                                          <div className="flex items-center gap-0.5">
                                            {Array.from({ length: Math.min(member.ddCount, 5) }).map((_, i) => (
                                              <PixelBeer key={i} className="inline-block" />
                                            ))}
                                          </div>
                                        )}
                                      </div>
                                      <div className="text-xs text-gray-500">
                                        {member.tripCount} trips • {member.milesDriven.toFixed(1)} mi
                                      </div>
                                    </div>
                                  </div>
                                  <div className="text-right">
                                    <div className="font-bold text-lg soft-gold">{member.points.toFixed(1)}</div>
                                    <div className="text-xs text-gray-500">points</div>
                                  </div>
                                </div>

                                {/* Progress Bar */}
                                <div className="car-slider">
                                  <div className="car-track-fill" style={{ width: `${percentage}%` }} />
                                  <div
                                    className="car-icon-wrapper"
                                    style={{ left: `${Math.max(percentage - 5, 0)}%` }}
                                  >
                                    {member.vehicleType === 'gas' ? (
                                      <PixelGasCar />
                                    ) : (
                                      <PixelElectricCar />
                                    )}
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                      </div>
                    )}
                  </div>

                  {/* Group Stats Button */}
                  <div className="p-4 border-t-4 border-[#3D405B]">
                    <button
                      onClick={() => setShowStatsCard(true)}
                      disabled={trips.length === 0}
                      className="pixel-button-secondary w-full py-3 text-white pixel-font text-lg rounded-lg flex items-center justify-center gap-3 transition-all"
                      style={{
                        boxShadow: '6px 6px 0px #3D405B'
                      }}
                    >
                      <BarChart3 size={20} className="pixel-icon" />
                      📊 GROUP STATS
                    </button>
                  </div>

                </div>

                {/* Trip History Card */}
                <div className={`rounded-lg punk-border shadow-retro-lg overflow-hidden flex flex-col stagger-2 ${
                  darkMode ? 'bg-gray-800 border-gray-600' : 'bg-gradient-to-br from-white to-[#FDF8F3] border-[#3D405B]'
                }`}>
                  <div className="bg-gradient-to-r from-[#2A9D8F] to-[#238276] p-4 border-b-4 border-[#3D405B]">
                    <div className="flex items-center justify-between">
                      <h2 className="pixel-font text-3xl text-white flex items-center gap-2">
                        <History className="pixel-icon" />
                        TRIP HISTORY
                      </h2>
                      <button
                        onClick={() => setShowTripModal(true)}
                        className="bg-white text-[#2A9D8F] px-4 py-2 rounded-lg font-bold border-2 border-[#3D405B] hover:bg-[#FDF8F3] transition-all flex items-center gap-2"
                      >
                        <Plus size={18} className="pixel-icon" />
                        NEW
                      </button>
                    </div>
                  </div>

                  <div className="p-6 flex-1 overflow-hidden">
                    <div className="space-y-3 max-h-[500px] overflow-y-auto">
                      {trips.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-16 px-4">
                          <div className="text-center mb-8">
                            <p className={`pixel-font text-4xl mb-3 ${darkMode ? 'text-white' : ''}`} style={{
                              color: darkMode ? '#FFFFFF' : '#3D405B',
                              textShadow: darkMode ? '2px 2px 0px rgba(42, 157, 143, 0.3)' : '2px 2px 0px rgba(224, 122, 95, 0.2)'
                            }}>
                              NO TRIPS YET!
                            </p>
                            <p className={`mono-font text-sm mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                              Time to hit the road 🚗💨
                            </p>
                            <p className={`mono-font text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                              Start tracking your carpools and earn points!
                            </p>
                          </div>
                          <button
                            onClick={() => setShowTripModal(true)}
                            className="pixel-button button-pulse px-8 py-4 text-white pixel-font text-2xl rounded-lg flex items-center gap-3"
                          >
                            <Plus size={28} className="pixel-icon" />
                            LOG FIRST TRIP
                          </button>
                        </div>
                      ) : (
                        trips.map((trip, index) => (
                          <div
                            key={trip.id}
                            className={`p-4 rounded-lg border-4 group ${
                              darkMode
                                ? 'bg-gray-800 border-gray-600 shadow-retro-teal'
                                : 'bg-white border-[#3D405B] shadow-retro'
                            }`}
                            style={{ animationDelay: `${index * 0.05}s` }}
                          >
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="font-bold deep-forest group-hover:text-[#FF6B4A] transition-colors">{trip.driver}</span>
                                  {trip.isDD && (
                                    <span className="badge bg-purple-100 text-purple-700 border-purple-300 group-hover:scale-110 transition-transform">
                                      🍺 DD
                                    </span>
                                  )}
                                  {trip.isRoundTrip && (
                                    <span className="badge bg-blue-100 text-blue-700 border-blue-300 group-hover:scale-110 transition-transform">
                                      🔄 Round Trip
                                    </span>
                                  )}
                                </div>
                                <div className={`text-xs mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                  <div className="flex items-center gap-1">
                                    <MapPin size={12} className="pixel-icon" />
                                    {trip.from}
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Navigation size={12} className="pixel-icon" />
                                    {trip.to}
                                  </div>
                                </div>
                                <div className="text-xs text-gray-500">
                                  {trip.distance} mi • {trip.passengerCount} passenger{trip.passengerCount !== 1 ? 's' : ''} • +{(trip.driverPoints || trip.points || 0).toFixed(1)} pts (driver)
                                </div>
                              </div>
                              <div className="flex items-center gap-1">
                                <button
                                  onClick={() => editTrip(trip)}
                                  className="p-2 text-blue-500 hover:bg-blue-50 rounded transition-all hover:scale-110 border-2 border-transparent hover:border-blue-300"
                                  aria-label="Edit trip"
                                >
                                  <Edit2 size={14} className="pixel-icon" />
                                </button>
                                <button
                                  onClick={() => setShowDeleteConfirm(trip.id)}
                                  className="p-2 text-red-500 hover:bg-red-50 rounded transition-all hover:scale-110 border-2 border-transparent hover:border-red-300"
                                  aria-label="Delete trip"
                                >
                                  <Trash2 size={14} className="pixel-icon" />
                                </button>
                              </div>
                            </div>
                            <div className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                              {new Date(trip.timestamp).toLocaleString()}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Export Data Button - Sticky at Bottom */}
                  <div className={`p-4 border-t-2 border-[#3D405B] ${
                    darkMode ? 'bg-gray-900' : 'bg-[#FDF8F3]'
                  }`}>
                    <button
                      onClick={exportToCSV}
                      disabled={trips.length === 0}
                      className="pixel-button-secondary w-full py-3 text-white pixel-font text-lg rounded-lg flex items-center justify-center gap-3 transition-all"
                      style={{
                        boxShadow: '6px 6px 0px #3D405B'
                      }}
                    >
                      <Download size={20} className="pixel-icon" />
                      EXPORT CSV
                    </button>
                  </div>
                </div>
              </div>

              {/* Next Driver - Full Width Button */}
              <div className="mb-6">
                <button
                  onClick={calculateNextDriver}
                  disabled={members.length === 0}
                  className="pixel-button w-full py-6 text-white pixel-font text-3xl rounded-lg flex items-center justify-center gap-3"
                >
                  🎰 WHO DRIVES NEXT?
                </button>
              </div>

              {/* Map Card */}
              <div className={`rounded-lg punk-border shadow-retro-lg overflow-hidden ${
                darkMode
                  ? 'bg-gray-800 border-gray-600'
                  : 'bg-gradient-to-br from-white to-[#FDF8F3] border-[#3D405B]'
              }`}>
                <div className={`p-4 border-b-4 border-[#3D405B] ${
                  darkMode
                    ? 'bg-gradient-to-r from-gray-700 to-gray-800'
                    : 'bg-gradient-to-r from-[#3D405B] to-[#2A2C3E]'
                }`}>
                  <h2 className={`pixel-font text-3xl flex items-center gap-2 ${
                    darkMode ? 'text-[#2A9D8F] neon-teal' : 'text-[#2A9D8F]'
                  }`}>
                    <MapPin className="pixel-icon" />
                    TRIP MAP
                  </h2>
                </div>

                <div className="p-6">
                  {/* Trip History Selector */}
                  {trips.length > 0 && (
                    <div className="mb-4">
                      <label className="block text-xs font-bold deep-forest mb-2 mono-font uppercase">
                        Select Trip to View
                      </label>
                      <select
                        value={selectedTripForMap}
                        onChange={(e) => setSelectedTripForMap(e.target.value)}
                        className={`retro-input w-full px-3 py-2 rounded text-sm font-bold ${
                          darkMode ? 'bg-gray-800 text-white border-gray-600' : 'text-[#3D405B]'
                        }`}
                      >
                        <option value="all">🗺️ All Trips (Last 10)</option>
                        {trips.map((trip) => (
                          <option key={trip.id} value={trip.id}>
                            {new Date(trip.timestamp).toLocaleDateString()} - {trip.driver}: {trip.from.split(',')[0]} → {trip.to.split(',')[0]} ({trip.distance} mi)
                          </option>
                        ))}
                      </select>

                      {/* Selected Trip Info */}
                      {selectedTripForMap !== 'all' && (() => {
                        const selectedTrip = trips.find(t => t.id === parseInt(selectedTripForMap));
                        return selectedTrip ? (
                          <div className={`mt-3 p-3 rounded border-2 text-xs ${
                            darkMode
                              ? 'bg-gray-800 border-gray-600 text-gray-300'
                              : 'bg-[#FDF8F3] border-[#3D405B] text-[#3D405B]'
                          }`}>
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-bold">{selectedTrip.driver}</span>
                              <span className="text-[#E07A5F] font-bold">{selectedTrip.distance} mi</span>
                            </div>
                            <div className="text-[10px] opacity-75">
                              From: {selectedTrip.from}
                            </div>
                            <div className="text-[10px] opacity-75">
                              To: {selectedTrip.to}
                            </div>
                            {selectedTrip.isDD && (
                              <div className="mt-1">
                                <span className="badge bg-purple-100 text-purple-700 border-purple-300 text-[10px]">
                                  🍺 DD
                                </span>
                              </div>
                            )}
                          </div>
                        ) : null;
                      })()}
                    </div>
                  )}

                  <div className="rounded-lg overflow-hidden border-4 border-[#3D405B]" style={{ height: '400px' }}>
                    <GoogleMap
                      mapContainerStyle={{ width: '100%', height: '100%' }}
                      center={mapCenter}
                      zoom={12}
                      onLoad={(map) => mapRef.current = map}
                      options={{
                        styles: mapStyles,
                        disableDefaultUI: true,
                        zoomControl: true,
                        mapTypeControl: false,
                        streetViewControl: false,
                        fullscreenControl: false,
                      }}
                    >
                      {allTripDirections.map((tripDir, index) => (
                        <DirectionsRenderer
                          key={tripDir.id}
                          directions={tripDir.directions}
                          options={{
                            polylineOptions: {
                              strokeColor: selectedTripForMap === 'all'
                                ? ['#E07A5F', '#F4A261', '#2A9D8F', '#3D405B'][index % 4]
                                : '#E07A5F',
                              strokeWeight: selectedTripForMap === 'all' ? 4 : 6,
                              strokeOpacity: selectedTripForMap === 'all' ? 0.7 : 0.9,
                            },
                            suppressMarkers: false,
                          }}
                        />
                      ))}
                    </GoogleMap>
                  </div>
                </div>
              </div>

              {/* Reset Button */}
              <div className="mt-6 mb-24 text-center">
                <button
                  onClick={resetAllData}
                  className="text-red-500 hover:text-red-700 text-sm flex items-center gap-2 mx-auto"
                >
                  <RotateCcw size={14} className="pixel-icon" />
                  Reset All Data
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* LOG/EDIT TRIP MODAL */}
      {showTripModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50">
          <div className="bg-gradient-to-br from-white to-[#FDF8F3] rounded-lg border-4 border-[#2A9D8F] max-w-2xl w-full slide-up shadow-retro-lg max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-[#2A9D8F] to-[#238276] p-4 rounded-t-lg border-b-4 border-[#3D405B] flex items-center justify-between sticky top-0 z-10">
              <h2 className="pixel-font text-3xl text-white">
                {editingTrip ? 'EDIT TRIP' : 'LOG NEW TRIP'}
              </h2>
              <button onClick={resetTripForm} className="text-white hover:text-gray-200" aria-label="Close modal">
                <X size={24} className="pixel-icon" />
              </button>
            </div>

            <form onSubmit={logTrip} className="p-6 space-y-4">
              {/* Driver Selection */}
              <div>
                <label className="block text-sm font-bold deep-forest mb-2 mono-font">WHO DROVE?</label>
                <select
                  value={tripDriver}
                  onChange={(e) => setTripDriver(e.target.value)}
                  className="retro-input w-full px-4 py-2 rounded text-[#3D405B] font-bold"
                  required
                >
                  <option value="">-- Select Driver --</option>
                  {members.map(member => (
                    <option key={member.id} value={member.id}>
                      {member.name} ({member.vehicleType === 'gas' ? '⛽ Gas' : '⚡ Electric'})
                    </option>
                  ))}
                </select>
              </div>

              {/* From Location */}
              <div>
                <label className="block text-sm font-bold deep-forest mb-2 mono-font">FROM</label>
                <Autocomplete
                  onLoad={(autocomplete) => (fromAutocompleteRef.current = autocomplete)}
                  onPlaceChanged={() => {
                    const place = fromAutocompleteRef.current.getPlace();
                    if (place.formatted_address) {
                      setTripFrom(place.formatted_address);
                    }
                  }}
                >
                  <input
                    type="text"
                    value={tripFrom}
                    onChange={(e) => setTripFrom(e.target.value)}
                    className="retro-input w-full px-4 py-2 rounded"
                    placeholder="Enter starting location..."
                    required
                  />
                </Autocomplete>
              </div>

              {/* To Location */}
              <div>
                <label className="block text-sm font-bold deep-forest mb-2 mono-font">TO</label>
                <Autocomplete
                  onLoad={(autocomplete) => (toAutocompleteRef.current = autocomplete)}
                  onPlaceChanged={() => {
                    const place = toAutocompleteRef.current.getPlace();
                    if (place.formatted_address) {
                      setTripTo(place.formatted_address);
                    }
                  }}
                >
                  <input
                    type="text"
                    value={tripTo}
                    onChange={(e) => setTripTo(e.target.value)}
                    className="retro-input w-full px-4 py-2 rounded"
                    placeholder="Enter destination..."
                    required
                  />
                </Autocomplete>
              </div>

              {/* Distance (auto-calculated) */}
              <div>
                <label className="block text-sm font-bold deep-forest mb-2 mono-font">DISTANCE (MILES)</label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  value={tripDistance}
                  onChange={(e) => setTripDistance(e.target.value)}
                  className="retro-input w-full px-4 py-2 rounded"
                  placeholder="Auto-calculated..."
                  required
                />
              </div>

              {/* Map Preview */}
              {directions && (
                <div className="rounded-lg overflow-hidden border-4 border-[#3D405B]" style={{ height: '250px' }}>
                  <GoogleMap
                    mapContainerStyle={{ width: '100%', height: '100%' }}
                    center={mapCenter}
                    zoom={12}
                    options={{
                      styles: mapStyles,
                      disableDefaultUI: true,
                      zoomControl: false,
                      mapTypeControl: false,
                      streetViewControl: false,
                      fullscreenControl: false,
                    }}
                  >
                    <DirectionsRenderer
                      directions={directions}
                      options={{
                        polylineOptions: {
                          strokeColor: '#E07A5F',
                          strokeWeight: 5,
                        },
                      }}
                    />
                  </GoogleMap>
                </div>
              )}

              {/* Passengers */}
              <div>
                <label className="block text-sm font-bold deep-forest mb-2 mono-font">PASSENGERS</label>
                <div className="border-4 border-[#3D405B] rounded-lg p-4 bg-[#FDF8F3] space-y-2 max-h-40 overflow-y-auto">
                  {members.filter(m => m.id !== parseInt(tripDriver)).length === 0 ? (
                    <p className="text-center text-gray-500 text-sm mono-font italic">Select a driver first</p>
                  ) : (
                    members
                      .filter(m => m.id !== parseInt(tripDriver))
                      .map(member => (
                        <label
                          key={member.id}
                          className="flex items-center gap-3 p-2 hover:bg-white rounded cursor-pointer transition-all"
                        >
                          <input
                            type="checkbox"
                            checked={tripPassengers.includes(member.id)}
                            onChange={() => togglePassenger(member.id)}
                            className="w-5 h-5 cursor-pointer"
                          />
                          <span className="font-bold deep-forest mono-font">{member.name}</span>
                          {member.vehicleType === 'gas' ? (
                            <Fuel size={18} className="pixel-icon text-[#E07A5F]" />
                          ) : (
                            <Zap size={18} className="pixel-icon text-yellow-500" />
                          )}
                        </label>
                      ))
                  )}
                </div>
              </div>

              {/* DD and Round Trip Toggles */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {/* DD Checkbox */}
                <div className="flex items-center gap-3 p-4 bg-purple-50 border-2 border-purple-300 rounded-lg">
                  <input
                    type="checkbox"
                    id="dd-toggle"
                    checked={isDD}
                    onChange={(e) => setIsDD(e.target.checked)}
                    className="w-5 h-5 cursor-pointer"
                  />
                  <label
                    htmlFor="dd-toggle"
                    className="font-bold deep-forest cursor-pointer flex items-center gap-2 mono-font text-sm"
                  >
                    Designated Driver
                    <Beer className="text-[#E07A5F] pixel-icon" size={18} />
                  </label>
                </div>

                {/* Round Trip Toggle */}
                <div className="flex items-center gap-3 p-4 bg-blue-50 border-2 border-blue-300 rounded-lg">
                  <input
                    type="checkbox"
                    id="roundtrip-toggle"
                    checked={isRoundTrip}
                    onChange={(e) => setIsRoundTrip(e.target.checked)}
                    className="w-5 h-5 cursor-pointer"
                  />
                  <label
                    htmlFor="roundtrip-toggle"
                    className="font-bold deep-forest cursor-pointer flex items-center gap-2 mono-font text-sm"
                  >
                    Round Trip (2x)
                    <RotateCcw className="text-[#2A9D8F] pixel-icon" size={18} />
                  </label>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="pixel-button flex-1 py-3 rounded-lg text-white pixel-font text-2xl"
                  disabled={!tripDriver || !tripFrom || !tripTo || !tripDistance || tripPassengers.length === 0}
                >
                  {editingTrip ? 'UPDATE' : 'SAVE'}
                </button>
                <button
                  type="button"
                  onClick={resetTripForm}
                  className="pixel-button-secondary flex-1 py-3 rounded-lg text-white pixel-font text-2xl"
                >
                  CANCEL
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SLOT MACHINE MODAL */}
      {showSlotMachine && (
        <div className="fixed inset-0 bg-black bg-opacity-80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-gradient-to-br from-white to-[#FDF8F3] rounded-lg border-4 border-[#F4A261] max-w-md w-full slide-up shine-effect" style={{
            boxShadow: '12px 12px 0px #F4A261, 0 0 60px rgba(244, 162, 97, 0.8)'
          }}>
            <div className="bg-gradient-to-r from-[#3D405B] to-[#2A2C3E] p-4 rounded-t-lg border-b-4 border-[#F4A261]">
              <h2 className="pixel-font text-3xl text-[#F4A261] text-center glitch" data-text="🎰 COMPUTING..." style={{
                textShadow: '0 0 20px rgba(244, 162, 97, 0.8)'
              }}>
                🎰 COMPUTING...
              </h2>
            </div>

            <div className="p-8 text-center">
              <div className={`bg-gradient-to-br from-[#FF6B4A] to-[#F4A261] p-8 rounded-lg border-4 border-[#3D405B] mb-6 ${slotMachineSpinning ? 'slot-spinning' : ''}`} style={{
                boxShadow: slotMachineSpinning
                  ? '6px 6px 0px #3D405B, 0 0 40px rgba(255, 107, 74, 0.8)'
                  : '6px 6px 0px #3D405B, 0 0 60px rgba(255, 107, 74, 1), 0 0 100px rgba(244, 162, 97, 0.6)'
              }}>
                <p className="pixel-font text-5xl text-white mb-2" style={{
                  textShadow: '3px 3px 0px rgba(0, 0, 0, 0.3), 0 0 20px rgba(255, 255, 255, 0.8)'
                }}>
                  {currentSlotName || '???'}
                </p>
                <p className="text-white text-sm future-font font-bold tracking-wider">
                  {slotMachineSpinning ? 'CALCULATING...' : 'SELECTED!'}
                </p>
              </div>

              {!slotMachineSpinning && selectedDriver && (
                <div className="space-y-4">
                  <p className="text-sm deep-forest">
                    Based on points ({selectedDriver.points.toFixed(1)} pts)
                    and DD count ({selectedDriver.ddCount} 🍺)
                  </p>

                  <button
                    onClick={() => {
                      setShowSlotMachine(false);
                      setSelectedDriver(null);
                    }}
                    className="pixel-button w-full py-3 rounded-lg text-white pixel-font text-2xl"
                  >
                    GOT IT!
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION DIALOG */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50">
          <div className="bg-gradient-to-br from-white to-[#FDF8F3] rounded-lg border-4 border-red-500 max-w-sm w-full slide-up shadow-retro-lg">
            <div className="bg-gradient-to-r from-red-500 to-red-600 p-4 rounded-t-lg border-b-4 border-[#3D405B]">
              <h2 className="pixel-font text-2xl text-white flex items-center gap-2">
                <AlertCircle className="pixel-icon" />
                CONFIRM DELETE
              </h2>
            </div>

            <div className="p-6 space-y-4">
              <p className="text-gray-700">
                Are you sure you want to delete this trip? Points will be reversed.
              </p>

              <div className="flex gap-3">
                <button
                  onClick={() => deleteTrip(showDeleteConfirm)}
                  className="flex-1 py-2 bg-red-500 text-white rounded hover:bg-red-600 font-bold"
                >
                  DELETE
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(null)}
                  className="flex-1 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 font-bold"
                >
                  CANCEL
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SAVE GROUP MODAL */}
      {showSaveGroupModal && (
        <div className="fixed inset-0 bg-black bg-opacity-80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-gradient-to-br from-white to-[#FDF8F3] rounded-lg border-4 border-[#3D405B] max-w-md w-full slide-up" style={{
            boxShadow: '12px 12px 0px #3D405B, 0 0 60px rgba(61, 64, 91, 0.8)'
          }}>
            <div className="bg-gradient-to-r from-[#3D405B] to-[#2A2C3E] p-4 rounded-t-lg border-b-4 border-[#FF6B4A]">
              <h2 className="pixel-font text-3xl text-[#FF6B4A] text-center" style={{
                textShadow: '2px 2px 0px rgba(0, 0, 0, 0.3)'
              }}>
                💾 SAVE GROUP
              </h2>
            </div>

            <div className="p-6">
              <p className="mono-font text-sm text-gray-600 mb-4 text-center">
                Give your carpool group a name to save all members, trips, and stats!
              </p>

              <form onSubmit={(e) => {
                e.preventDefault();
                const nameInput = e.target.groupNameInput.value;
                if (nameInput.trim()) {
                  saveGroup(nameInput);
                }
              }}>
                <input
                  id="groupNameInput"
                  type="text"
                  defaultValue={groupName}
                  placeholder="e.g., Work Crew, Weekend Warriors..."
                  className="retro-input w-full px-4 py-3 rounded mb-4 mono-font"
                  required
                  autoFocus
                />

                <div className="flex gap-3">
                  <button
                    type="submit"
                    className="pixel-button flex-1 py-3 rounded-lg text-white pixel-font text-xl"
                  >
                    SAVE
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowSaveGroupModal(false)}
                    className="pixel-button-secondary flex-1 py-3 rounded-lg text-white pixel-font text-xl"
                  >
                    CANCEL
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* DELETE GROUP CONFIRMATION */}
      {groupToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-gradient-to-br from-white to-[#FDF8F3] rounded-lg border-4 border-red-500 max-w-md w-full slide-up" style={{
            boxShadow: '12px 12px 0px red, 0 0 60px rgba(239, 68, 68, 0.8)'
          }}>
            <div className="bg-gradient-to-r from-red-600 to-red-700 p-4 rounded-t-lg border-b-4 border-red-800">
              <h2 className="pixel-font text-3xl text-white text-center" style={{
                textShadow: '2px 2px 0px rgba(0, 0, 0, 0.3)'
              }}>
                ⚠️ DELETE GROUP?
              </h2>
            </div>

            <div className="p-6">
              <p className="mono-font text-center text-gray-700 mb-2">
                Are you sure you want to delete
              </p>
              <p className="pixel-font text-2xl text-center text-[#FF6B4A] mb-4">
                "{groupToDelete}"
              </p>
              <p className="mono-font text-sm text-center text-gray-600 mb-6">
                All members, trips, and stats will be permanently deleted!
              </p>

              <div className="flex gap-3">
                <button
                  onClick={() => deleteGroup(groupToDelete)}
                  className="flex-1 py-3 bg-red-500 text-white rounded-lg font-bold pixel-font text-xl hover:bg-red-600 transition-all border-4 border-[#3D405B]"
                  style={{
                    boxShadow: '4px 4px 0px #3D405B'
                  }}
                >
                  DELETE
                </button>
                <button
                  onClick={() => setGroupToDelete(null)}
                  className="pixel-button-secondary flex-1 py-3 rounded-lg text-white pixel-font text-xl"
                >
                  CANCEL
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* GROUP STATISTICS MODAL */}
      {showStatsCard && trips.length > 0 && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50">
          <div className="bg-gradient-to-br from-white to-[#FDF8F3] rounded-lg border-4 border-[#2A9D8F] max-w-lg w-full slide-up shadow-retro-lg">
            <div className="bg-gradient-to-r from-[#2A9D8F] to-[#238276] p-4 rounded-t-lg border-b-4 border-[#3D405B] flex items-center justify-between">
              <h2 className="pixel-font text-3xl text-white flex items-center gap-2">
                <BarChart3 className="pixel-icon" />
                GROUP STATS
              </h2>
              <button onClick={() => setShowStatsCard(false)} className="text-white hover:text-gray-200" aria-label="Close stats">
                <X size={24} className="pixel-icon" />
              </button>
            </div>

            {(() => {
              const stats = getGroupStats();
              return (
                <div className="p-6 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-[#FDF8F3] p-4 rounded-lg border-2 border-[#3D405B]">
                      <p className="text-xs text-gray-500 mb-1">TOTAL MILES</p>
                      <p className="text-2xl font-bold deep-forest">{stats.totalMiles}</p>
                    </div>
                    <div className="bg-[#FDF8F3] p-4 rounded-lg border-2 border-[#3D405B]">
                      <p className="text-xs text-gray-500 mb-1">TOTAL TRIPS</p>
                      <p className="text-2xl font-bold deep-forest">{stats.totalTrips}</p>
                    </div>
                    <div className="bg-[#FDF8F3] p-4 rounded-lg border-2 border-[#3D405B]">
                      <p className="text-xs text-gray-500 mb-1">DD TRIPS</p>
                      <p className="text-2xl font-bold deep-forest">{stats.totalDDTrips} 🍺</p>
                    </div>
                    <div className="bg-[#FDF8F3] p-4 rounded-lg border-2 border-[#3D405B]">
                      <p className="text-xs text-gray-500 mb-1">AVG DISTANCE</p>
                      <p className="text-2xl font-bold deep-forest">{stats.avgTripDistance} mi</p>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg border-2 border-green-300">
                    <p className="text-sm font-bold text-green-800 mb-2">🌍 ENVIRONMENTAL IMPACT</p>
                    <p className="text-xs text-green-700">
                      CO₂ Saved: <span className="font-bold">{stats.co2SavedKg} kg</span>
                    </p>
                    <p className="text-xs text-green-700">
                      Money Saved: <span className="font-bold">${stats.moneySaved}</span>
                    </p>
                  </div>

                  <div className="bg-[#FDF8F3] p-4 rounded-lg border-2 border-[#3D405B]">
                    <p className="text-xs text-gray-500 mb-1">MOST FREQUENT ROUTE</p>
                    <p className="text-sm font-bold deep-forest">{stats.mostFrequentRoute}</p>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}

      {/* ACHIEVEMENTS NOTIFICATION - Only show on dashboard */}
      {currentView === 'dashboard' && achievements
        .filter(a => !dismissedAchievements.includes(a.id))
        .slice(-3)
        .reverse()
        .map((achievement, index) => (
          <div
            key={achievement.id}
            className="fixed right-4 bg-gradient-to-r from-[#F4A261] to-[#E07A5F] text-white p-4 rounded-lg border-4 border-[#3D405B] shadow-retro-lg slide-up max-w-sm z-50"
            style={{ top: `${80 + index * 100}px` }}
          >
            <button
              onClick={() => setDismissedAchievements([...dismissedAchievements, achievement.id])}
              className="absolute top-2 right-2 hover:bg-white hover:bg-opacity-20 rounded-full p-1 transition-colors"
              title="Dismiss"
            >
              <X size={16} className="pixel-icon" />
            </button>
            <div className="flex items-center gap-3 pr-6">
              <Award size={32} className="text-white flex-shrink-0 pixel-icon" />
              <div>
                <p className="font-bold pixel-font text-lg">{achievement.name}</p>
                <p className="text-sm">{achievement.memberName}</p>
                <p className="text-xs opacity-90">{achievement.description}</p>
              </div>
            </div>
          </div>
        ))}
    </>
  );
};

export default ShotgunAI;
