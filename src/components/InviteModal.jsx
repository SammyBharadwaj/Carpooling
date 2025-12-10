import { useState, useEffect } from 'react';
import { X, Check, UserPlus, Copy, Link as LinkIcon } from 'lucide-react';
import { inviteService } from '../services/firestoreService';

const InviteModal = ({ isOpen, onClose, groupId, groupName, currentMembers, onMemberAdded, inviterEmail }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [inviteLink, setInviteLink] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isOpen && !inviteLink) {
      generateInviteLink();
    }
  }, [isOpen]);

  const generateInviteLink = async () => {
    try {
      setLoading(true);
      setError('');

      // Create invite link
      const inviteId = await inviteService.createInvite(
        groupId,
        groupName,
        inviterEmail || 'someone',
        'link',
        {} // No member data needed for link invites
      );

      // Generate the invite URL
      const inviteUrl = `${window.location.origin}/invite/${inviteId}`;
      setInviteLink(inviteUrl);

    } catch (err) {
      console.error('Error generating invite link:', err);
      setError('Failed to generate invite link. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(inviteLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleClose = () => {
    setError('');
    setInviteLink('');
    setCopied(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="punk-border shadow-retro-lg p-3 sm:p-5 md:p-6 bg-gradient-to-br from-white to-[#FDF8F3] border-[#3D405B] rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <h2 className="pixel-font text-xl sm:text-2xl md:text-3xl deep-forest" style={{
            textShadow: '2px 2px 0px rgba(224, 122, 95, 0.2)'
          }}>
            ADD MEMBER
          </h2>
          <button
            onClick={handleClose}
            className="p-1.5 sm:p-2 hover:bg-gray-100 rounded transition-colors"
            aria-label="Close"
          >
            <X size={20} className="deep-forest sm:w-6 sm:h-6" />
          </button>
        </div>

        {/* Info Message */}
        <div className="mb-4 sm:mb-5 p-3 sm:p-4 bg-blue-50 border-2 border-blue-500 rounded">
          <p className="text-blue-600 text-xs sm:text-sm mono-font">
            💡 Copy this invite link and share it with anyone you want to add to your crew. When they click it and sign in with Google, they'll instantly join!
          </p>
        </div>

        {loading ? (
          // Loading State
          <div className="text-center py-8 sm:py-12">
            <div className="inline-block animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-4 border-[#FF6B4A] border-t-transparent mb-3 sm:mb-4"></div>
            <p className="mono-font text-xs sm:text-sm deep-forest">Generating invite link...</p>
          </div>
        ) : error ? (
          // Error State
          <div>
            <div className="mb-4 sm:mb-5 p-3 sm:p-4 bg-red-50 border-2 border-red-500 rounded">
              <p className="text-red-600 text-xs sm:text-sm font-bold mono-font">{error}</p>
            </div>
            <button
              onClick={generateInviteLink}
              className="pixel-button w-full py-2 sm:py-3 rounded-lg text-white pixel-font text-base sm:text-lg md:text-xl mb-2 sm:mb-3"
            >
              TRY AGAIN
            </button>
            <button
              onClick={handleClose}
              className="pixel-button-secondary w-full py-2 sm:py-3 rounded-lg text-white pixel-font text-base sm:text-lg md:text-xl"
            >
              CLOSE
            </button>
          </div>
        ) : inviteLink ? (
          // Show Invite Link
          <div>
            <div className="mb-4 sm:mb-5 p-4 sm:p-5 bg-green-50 border-2 border-green-500 rounded text-center">
              <div className="flex justify-center mb-3 sm:mb-4">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-green-500 rounded-full flex items-center justify-center">
                  <LinkIcon size={24} className="text-white sm:w-8 sm:h-8" />
                </div>
              </div>
              <p className="text-green-600 font-bold mono-font text-sm sm:text-base md:text-lg mb-1 sm:mb-2">
                Invite Link Ready!
              </p>
              <p className="text-xs sm:text-sm mono-font deep-forest">
                Share this link with anyone to invite them to <strong>{groupName}</strong>
              </p>
            </div>

            {/* Invite Link Section */}
            <div className="mb-4 sm:mb-5 p-3 sm:p-4 bg-blue-50 border-2 border-blue-500 rounded">
              <div className="flex items-center gap-2 mb-2 sm:mb-3">
                <LinkIcon size={16} className="text-blue-600 sm:w-5 sm:h-5" />
                <p className="text-blue-600 font-bold mono-font text-xs sm:text-sm">
                  Your Invite Link:
                </p>
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inviteLink}
                  readOnly
                  className="flex-1 px-2 sm:px-3 py-1.5 sm:py-2 bg-white border-2 border-blue-300 rounded mono-font text-xs"
                  onClick={(e) => e.target.select()}
                />
                <button
                  onClick={handleCopyLink}
                  className="px-3 sm:px-4 py-1.5 sm:py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-bold mono-font text-xs sm:text-sm transition-colors flex items-center gap-1 sm:gap-2"
                >
                  <Copy size={14} className="sm:w-4 sm:h-4" />
                  {copied ? 'COPIED!' : 'COPY'}
                </button>
              </div>
            </div>

            <button
              onClick={handleClose}
              className="pixel-button w-full py-2 sm:py-3 rounded-lg text-white pixel-font text-base sm:text-lg md:text-xl"
            >
              DONE
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default InviteModal;
