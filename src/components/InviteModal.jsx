import { useState } from 'react';
import { X, Check, UserPlus } from 'lucide-react';
import { groupService } from '../services/firestoreService';

const InviteModal = ({ isOpen, onClose, groupId, groupName, currentMembers, onMemberAdded }) => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [vehicleType, setVehicleType] = useState('gas');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAddMember = async (e) => {
    e.preventDefault();
    setError('');

    // Validate email
    if (!email.trim() || !email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }

    // Check if email already exists in group
    const emailLower = email.trim().toLowerCase();
    const memberExists = currentMembers.some(
      member => member.email?.toLowerCase() === emailLower
    );

    if (memberExists) {
      setError('This email is already in the crew');
      return;
    }

    try {
      setLoading(true);

      // Create new pending member
      const newMember = {
        id: Date.now(), // Unique ID for this member
        userId: null, // Will be set when they sign in
        email: emailLower,
        name: name.trim() || email.split('@')[0],
        vehicleType,
        points: 0,
        tripCount: 0,
        milesDriven: 0,
        ddCount: 0,
        status: 'pending', // pending until they sign in
        invitedAt: new Date().toISOString()
      };

      // Add member to group
      const updatedMembers = [...currentMembers, newMember];
      await groupService.updateGroup(groupId, { members: updatedMembers });

      // Show success
      setSuccess(true);
      if (onMemberAdded) onMemberAdded();

      // Auto-close after 2 seconds
      setTimeout(() => {
        handleClose();
      }, 2000);

    } catch (err) {
      console.error('Error adding member:', err);
      setError('Failed to add member. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setEmail('');
    setName('');
    setVehicleType('gas');
    setSuccess(false);
    setError('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="punk-border shadow-retro-lg p-8 bg-gradient-to-br from-white to-[#FDF8F3] border-[#3D405B] rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="pixel-font text-3xl deep-forest" style={{
            textShadow: '2px 2px 0px rgba(224, 122, 95, 0.2)'
          }}>
            ADD MEMBER
          </h2>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded transition-colors"
            aria-label="Close"
          >
            <X size={24} className="deep-forest" />
          </button>
        </div>

        {!success ? (
          // Add Member Form
          <form onSubmit={handleAddMember}>
            <div className="mb-4 p-3 bg-blue-50 border-2 border-blue-500 rounded">
              <p className="text-blue-600 text-sm mono-font">
                💡 Members will be added to your crew immediately. When they sign in with this email, they'll automatically get access!
              </p>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-bold deep-forest mb-2 mono-font">
                EMAIL ADDRESS *
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="retro-input w-full px-4 py-2 rounded mono-font"
                placeholder="friend@example.com"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-bold deep-forest mb-2 mono-font">
                NAME (OPTIONAL)
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="retro-input w-full px-4 py-2 rounded mono-font"
                placeholder="Auto-filled from email if empty"
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-bold deep-forest mb-2 mono-font">
                CAR TYPE
              </label>
              <select
                value={vehicleType}
                onChange={(e) => setVehicleType(e.target.value)}
                className="retro-input w-full px-4 py-2 rounded mono-font text-[#3D405B] font-bold"
              >
                <option value="gas">⛽ Gas</option>
                <option value="electric">⚡ Electric</option>
              </select>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border-2 border-red-500 rounded">
                <p className="text-red-600 text-sm font-bold mono-font">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="pixel-button w-full py-3 rounded-lg text-white pixel-font text-xl"
            >
              {loading ? 'ADDING...' : 'ADD MEMBER'}
            </button>
          </form>
        ) : (
          // Success Message
          <div>
            <div className="mb-6 p-6 bg-green-50 border-2 border-green-500 rounded text-center">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center">
                  <Check size={32} className="text-white" />
                </div>
              </div>
              <p className="text-green-600 font-bold mono-font text-lg mb-2">
                Member Added!
              </p>
              <p className="text-sm mono-font deep-forest">
                <strong>{email}</strong> has been added to {groupName}. They'll get access when they sign in!
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InviteModal;
