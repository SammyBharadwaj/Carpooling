import { useState } from 'react';
import { X, Copy, Check, Mail } from 'lucide-react';
import { inviteService } from '../services/firestoreService';

const InviteModal = ({ isOpen, onClose, groupId, groupName, userEmail }) => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [vehicleType, setVehicleType] = useState('gas');
  const [inviteLink, setInviteLink] = useState('');
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerateInvite = async (e) => {
    e.preventDefault();
    setError('');

    // Validate email
    if (!email.trim() || !email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }

    try {
      setLoading(true);

      // Prepare member details
      const memberData = {
        email: email.trim(),
        name: name.trim() || email.split('@')[0],
        vehicleType
      };

      // Create invite in Firestore with member details
      const inviteId = await inviteService.createInvite(
        groupId,
        groupName,
        userEmail,
        'link',
        memberData
      );

      // Generate invite link
      const link = `${window.location.origin}/invite/${inviteId}`;
      setInviteLink(link);

    } catch (err) {
      console.error('Error generating invite:', err);
      setError('Failed to generate invite link. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(inviteLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClose = () => {
    setEmail('');
    setName('');
    setVehicleType('gas');
    setInviteLink('');
    setCopied(false);
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
            INVITE MEMBER
          </h2>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded transition-colors"
            aria-label="Close"
          >
            <X size={24} className="deep-forest" />
          </button>
        </div>

        {!inviteLink ? (
          // Invite Form
          <form onSubmit={handleGenerateInvite}>
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
              {loading ? 'GENERATING...' : 'GENERATE INVITE LINK'}
            </button>
          </form>
        ) : (
          // Invite Link Display
          <div>
            <div className="mb-4 p-4 bg-green-50 border-2 border-green-500 rounded">
              <div className="flex items-center gap-2 mb-2">
                <Check size={20} className="text-green-600" />
                <p className="text-green-600 font-bold mono-font">Invite Link Generated!</p>
              </div>
              <p className="text-sm mono-font deep-forest">
                Share this link with <strong>{email}</strong>
              </p>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-bold deep-forest mb-2 mono-font">
                INVITE LINK
              </label>
              <div className="retro-input w-full px-4 py-2 rounded mono-font break-all text-sm">
                {inviteLink}
              </div>
            </div>

            <button
              onClick={handleCopyLink}
              className={`pixel-button w-full py-3 rounded-lg text-white pixel-font text-xl mb-3 ${
                copied ? 'opacity-75' : ''
              }`}
            >
              {copied ? (
                <>
                  <Check size={20} className="inline mr-2" />
                  COPIED!
                </>
              ) : (
                <>
                  <Copy size={20} className="inline mr-2" />
                  COPY LINK
                </>
              )}
            </button>

            <button
              onClick={handleClose}
              className="pixel-button-secondary w-full py-3 rounded-lg text-white pixel-font text-xl"
            >
              DONE
            </button>

            <p className="text-xs mono-font text-gray-600 mt-4 text-center">
              💡 Send this link via text, email, or any messaging app
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default InviteModal;
