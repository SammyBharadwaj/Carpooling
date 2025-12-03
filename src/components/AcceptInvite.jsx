import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Users, Car, Check, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { inviteService, groupService } from '../services/firestoreService';

const AcceptInvite = () => {
  const { inviteId } = useParams();
  const navigate = useNavigate();
  const { user, signInWithGoogle } = useAuth();

  const [invite, setInvite] = useState(null);
  const [group, setGroup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [accepting, setAccepting] = useState(false);

  useEffect(() => {
    loadInviteData();
  }, [inviteId]);

  const loadInviteData = async () => {
    try {
      setLoading(true);
      setError('');

      // Get invite details
      const inviteData = await inviteService.getInvite(inviteId);

      if (!inviteData) {
        setError('This invite link is invalid or has expired.');
        return;
      }

      if (inviteData.used) {
        setError('This invite link has already been used.');
        return;
      }

      setInvite(inviteData);

      // Get group details
      const groupData = await groupService.getGroup(inviteData.groupId);
      if (groupData) {
        setGroup(groupData);
      }

    } catch (err) {
      console.error('Error loading invite:', err);
      setError('Failed to load invitation details.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async () => {
    try {
      await signInWithGoogle();
      // After sign in, user will be available and we can proceed
    } catch (err) {
      console.error('Sign in error:', err);
      setError('Failed to sign in. Please try again.');
    }
  };

  const handleAcceptInvite = async () => {
    if (!user || !invite) return;

    try {
      setAccepting(true);
      setError('');

      // Get member details from localStorage (set during invite creation)
      const memberDataStr = localStorage.getItem(`invite_${inviteId}`);
      const memberData = memberDataStr ? JSON.parse(memberDataStr) : {};

      // Add user to group
      await groupService.addMemberToGroup(invite.groupId, user.uid);

      // Update group with new member data
      const groupData = await groupService.getGroup(invite.groupId);
      const newMember = {
        userId: user.uid,
        email: user.email,
        name: user.displayName || memberData.name || user.email.split('@')[0],
        vehicleType: memberData.vehicleType || 'gas',
        points: 0,
        tripCount: 0,
        milesDriven: 0,
        ddCount: 0,
        status: 'active',
        joinedAt: new Date().toISOString()
      };

      const updatedMembers = [...(groupData.members || []), newMember];
      await groupService.updateGroup(invite.groupId, { members: updatedMembers });

      // Mark invite as used
      await inviteService.markInviteUsed(inviteId);

      // Clean up localStorage
      localStorage.removeItem(`invite_${inviteId}`);

      // Store the new groupId in user's active groups
      const activeGroupId = localStorage.getItem('activeGroupId');
      if (!activeGroupId) {
        localStorage.setItem('activeGroupId', invite.groupId);
      }

      // Redirect to dashboard
      navigate('/', { state: { joinedGroup: group.name } });

    } catch (err) {
      console.error('Error accepting invite:', err);
      setError('Failed to join the crew. Please try again.');
    } finally {
      setAccepting(false);
    }
  };

  const handleDecline = () => {
    navigate('/');
  };

  if (loading) {
    return (
      <div className="mono-font warm-cream-bg min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <div className="pixel-font text-4xl deep-forest mb-4">LOADING...</div>
          <p className="mono-font text-gray-600">Fetching invitation details</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mono-font warm-cream-bg min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="punk-border shadow-retro-lg p-8 bg-gradient-to-br from-white to-[#FDF8F3] border-[#3D405B] rounded-lg">
            <div className="text-center mb-6">
              <X size={48} className="mx-auto text-red-500 mb-4" />
              <h2 className="pixel-font text-3xl deep-forest mb-4">
                INVITE ERROR
              </h2>
              <p className="mono-font text-gray-600">{error}</p>
            </div>
            <button
              onClick={() => navigate('/')}
              className="pixel-button w-full py-3 rounded-lg text-white pixel-font text-xl"
            >
              GO TO HOME
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="mono-font warm-cream-bg min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <h1 className="pixel-font text-6xl font-bold mb-2 neon-title glitch" data-text="SHOTGUN.AI" style={{
              letterSpacing: '0.1em'
            }}>
              SHOTGUN.AI
            </h1>
            <p className="text-lg future-font uppercase tracking-wider" style={{
              color: '#FF6B4A',
              textShadow: '0 0 15px rgba(255, 107, 74, 0.8), 0 0 30px rgba(255, 107, 74, 0.4)',
              fontWeight: '700'
            }}>
              ⚡ Crew Invitation ⚡
            </p>
          </div>

          <div className="punk-border shadow-retro-lg p-8 bg-gradient-to-br from-white to-[#FDF8F3] border-[#3D405B] rounded-lg">
            <h2 className="pixel-font text-3xl deep-forest mb-4" style={{
              textShadow: '2px 2px 0px rgba(224, 122, 95, 0.2)'
            }}>
              SIGN IN REQUIRED
            </h2>
            <p className="mono-font text-gray-600 mb-6">
              You've been invited to join <strong>{group?.name || 'a crew'}</strong>!
              Please sign in with Google to accept the invitation.
            </p>
            <button
              onClick={handleSignIn}
              className="pixel-button w-full py-3 rounded-lg text-white pixel-font text-xl"
            >
              SIGN IN WITH GOOGLE
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mono-font warm-cream-bg min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="pixel-font text-6xl font-bold mb-2 neon-title glitch" data-text="SHOTGUN.AI" style={{
            letterSpacing: '0.1em'
          }}>
            SHOTGUN.AI
          </h1>
          <p className="text-lg future-font uppercase tracking-wider" style={{
            color: '#FF6B4A',
            textShadow: '0 0 15px rgba(255, 107, 74, 0.8), 0 0 30px rgba(255, 107, 74, 0.4)',
            fontWeight: '700'
          }}>
            ⚡ Join The Crew ⚡
          </p>
        </div>

        <div className="punk-border shadow-retro-lg p-8 bg-gradient-to-br from-white to-[#FDF8F3] border-[#3D405B] rounded-lg">
          <h2 className="pixel-font text-3xl deep-forest mb-6" style={{
            textShadow: '2px 2px 0px rgba(224, 122, 95, 0.2)'
          }}>
            CREW INVITATION
          </h2>

          {/* Invitation Details */}
          <div className="mb-6 p-4 bg-white border-4 border-[#3D405B] rounded" style={{
            boxShadow: '4px 4px 0px 0px #3D405B'
          }}>
            <div className="flex items-center gap-3 mb-3">
              <Users size={24} className="text-[#2A9D8F]" />
              <div>
                <p className="text-sm mono-font text-gray-600">Crew Name</p>
                <p className="pixel-font text-xl deep-forest">{group?.name || 'Loading...'}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 mb-3">
              <Mail size={24} className="text-[#E07A5F]" />
              <div>
                <p className="text-sm mono-font text-gray-600">Invited By</p>
                <p className="mono-font font-bold deep-forest">{invite?.inviterEmail}</p>
              </div>
            </div>

            {group?.members && group.members.length > 0 && (
              <div className="flex items-center gap-3">
                <Car size={24} className="text-[#F4A261]" />
                <div>
                  <p className="text-sm mono-font text-gray-600">Current Members</p>
                  <p className="mono-font font-bold deep-forest">{group.members.length} member{group.members.length !== 1 ? 's' : ''}</p>
                </div>
              </div>
            )}
          </div>

          <p className="mono-font text-sm text-gray-600 mb-6">
            By accepting, you'll join this crew and be able to track rides, share costs, and see everyone's points in real-time.
          </p>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border-2 border-red-500 rounded">
              <p className="text-red-600 text-sm font-bold mono-font">{error}</p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={handleDecline}
              disabled={accepting}
              className="pixel-button-secondary py-3 rounded-lg text-white pixel-font text-lg"
            >
              DECLINE
            </button>
            <button
              onClick={handleAcceptInvite}
              disabled={accepting}
              className="pixel-button py-3 rounded-lg text-white pixel-font text-lg"
            >
              {accepting ? 'JOINING...' : 'ACCEPT'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AcceptInvite;
