import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Users, Car, Check, X, Mail } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { inviteService, groupService } from '../services/firestoreService';
import TVWrapper from './TVWrapper';

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

  // Auto-accept invite when user is signed in
  useEffect(() => {
    if (user && invite && !accepting) {
      handleAcceptInvite();
    }
  }, [user, invite]);

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
    if (!user || !invite) {
      console.log('Missing user or invite:', { user: !!user, invite: !!invite });
      return;
    }

    try {
      setAccepting(true);
      setError('');

      console.log('Starting invite acceptance for group:', invite.groupId);

      // Get group data first to check if user is already a member
      const groupData = await groupService.getGroup(invite.groupId);

      if (!groupData) {
        console.error('Group not found:', invite.groupId);
        setError('This crew no longer exists.');
        setAccepting(false);
        return;
      }

      console.log('Group data loaded:', groupData.name);

      // Check if user is already in the group
      const isAlreadyMember = groupData.members?.some(
        member => member.userId === user.uid || member.email?.toLowerCase() === user.email.toLowerCase()
      );

      if (isAlreadyMember) {
        console.log('User already a member, redirecting to dashboard');
        // User is already in the group, just redirect to dashboard
        localStorage.setItem('activeGroupId', invite.groupId);
        navigate('/', { state: { joinedGroup: groupData?.name || 'your crew' } });
        return;
      }

      // Get member details from invite document (stored in Firestore)
      const memberData = invite.memberData || {};

      console.log('Adding user to group memberIds...');
      // Add user to group
      await groupService.addMemberToGroup(invite.groupId, user.uid);

      // Create new member object
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

      console.log('Adding member to group members array:', newMember);
      // Update group with new member data
      const updatedMembers = [...(groupData.members || []), newMember];
      await groupService.updateGroup(invite.groupId, { members: updatedMembers });

      console.log('Member added successfully!');

      // Store the new groupId in user's active groups
      const activeGroupId = localStorage.getItem('activeGroupId');
      if (!activeGroupId) {
        localStorage.setItem('activeGroupId', invite.groupId);
      }

      // Redirect to dashboard
      navigate('/', { state: { joinedGroup: groupData?.name || 'your crew' } });

    } catch (err) {
      console.error('Error accepting invite - Full error:', err);
      console.error('Error message:', err.message);
      console.error('Error code:', err.code);
      setError(`Failed to join the crew: ${err.message || 'Please try again.'}`);
    } finally {
      setAccepting(false);
    }
  };

  const handleDecline = () => {
    navigate('/');
  };

  if (loading) {
    return (
      <TVWrapper showThemeToggle={true} initialDarkMode={true}>
        {(isLightMode) => (
          <div className="mono-font text-center">
            <div className="pixel-font text-4xl mb-4" style={{
              color: '#FF6B4A',
              textShadow: '0 0 10px rgba(255, 107, 74, 0.6)'
            }}>LOADING...</div>
            <p className="mono-font" style={{ color: isLightMode ? '#3D405B' : '#FF8B6A' }}>Fetching invitation details</p>
          </div>
        )}
      </TVWrapper>
    );
  }

  if (error) {
    return (
      <TVWrapper showThemeToggle={true} initialDarkMode={true}>
        {(isLightMode) => (
          <div className="mono-font max-w-md w-full mx-auto">
            <div className="p-8 rounded-lg" style={{
              background: isLightMode ? 'rgba(255, 255, 255, 0.95)' : 'rgba(20, 20, 20, 0.8)',
              border: '3px solid #FF6B4A',
              boxShadow: '0 0 15px rgba(255, 107, 74, 0.3)'
            }}>
              <div className="text-center mb-6">
                <X size={48} className="mx-auto mb-4" style={{
                  color: '#ff4444',
                  filter: 'drop-shadow(0 0 10px rgba(255, 68, 68, 0.6))'
                }} />
                <h2 className="pixel-font text-3xl mb-4" style={{
                  color: '#FF6B4A',
                  textShadow: '0 0 10px rgba(255, 107, 74, 0.6)'
                }}>
                  INVITE ERROR
                </h2>
                <p className="mono-font" style={{ color: isLightMode ? '#3D405B' : '#FF8B6A' }}>{error}</p>
              </div>
              <button
                onClick={() => navigate('/')}
                className="pixel-button w-full py-3 rounded-lg text-white pixel-font text-xl"
              >
                GO TO HOME
              </button>
            </div>
          </div>
        )}
      </TVWrapper>
    );
  }

  if (!user) {
    return (
      <TVWrapper showThemeToggle={true} initialDarkMode={true}>
        {(isLightMode) => (
          <div className="mono-font max-w-md w-full mx-auto">
            <div className="text-center mb-8">
              <h1 className="pixel-font text-6xl font-bold mb-2 glitch" data-text="SHOTGUN.AI" style={{
                letterSpacing: '0.1em',
                color: '#FF6B4A',
                textShadow: '0 0 10px rgba(255, 107, 74, 0.8), 0 0 20px rgba(255, 107, 74, 0.6), 0 0 30px rgba(255, 107, 74, 0.4)'
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

            <div className="p-8 rounded-lg" style={{
              background: isLightMode ? 'rgba(255, 255, 255, 0.95)' : 'rgba(20, 20, 20, 0.8)',
              border: '3px solid #FF6B4A',
              boxShadow: '0 0 15px rgba(255, 107, 74, 0.3)'
            }}>
              <h2 className="pixel-font text-3xl mb-4" style={{
                color: '#FF6B4A',
                textShadow: '0 0 10px rgba(255, 107, 74, 0.6)'
              }}>
                SIGN IN REQUIRED
              </h2>
              <p className="mono-font mb-6" style={{ color: isLightMode ? '#3D405B' : '#FF8B6A' }}>
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
        )}
      </TVWrapper>
    );
  }

  return (
    <TVWrapper showThemeToggle={true} initialDarkMode={true}>
      {(isLightMode) => (
        <div className="mono-font max-w-md w-full mx-auto">
          <div className="text-center mb-8">
            <h1 className="pixel-font text-6xl font-bold mb-2 glitch" data-text="SHOTGUN.AI" style={{
              letterSpacing: '0.1em',
              color: '#FF6B4A',
              textShadow: '0 0 10px rgba(255, 107, 74, 0.8), 0 0 20px rgba(255, 107, 74, 0.6), 0 0 30px rgba(255, 107, 74, 0.4)'
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

          <div className="p-8 rounded-lg" style={{
            background: isLightMode ? 'rgba(255, 255, 255, 0.95)' : 'rgba(20, 20, 20, 0.8)',
            border: '3px solid #FF6B4A',
            boxShadow: '0 0 15px rgba(255, 107, 74, 0.3)'
          }}>
            <h2 className="pixel-font text-3xl mb-6" style={{
              color: '#FF6B4A',
              textShadow: '0 0 10px rgba(255, 107, 74, 0.6)'
            }}>
              CREW INVITATION
            </h2>

            {/* Invitation Details */}
            <div className="mb-6 p-4 rounded" style={{
              background: isLightMode ? 'rgba(245, 240, 230, 0.9)' : 'rgba(10, 10, 10, 0.8)',
              border: '2px solid #FF8B6A',
              boxShadow: '0 0 10px rgba(255, 107, 74, 0.2)'
            }}>
              <div className="flex items-center gap-3 mb-3">
                <Users size={24} style={{
                  color: '#FF8B6A',
                  filter: 'drop-shadow(0 0 5px rgba(255, 139, 106, 0.5))'
                }} />
                <div>
                  <p className="text-sm mono-font" style={{ color: isLightMode ? '#666' : '#888' }}>Crew Name</p>
                  <p className="pixel-font text-xl" style={{ color: isLightMode ? '#3D405B' : '#FFFFFF' }}>{group?.name || 'Loading...'}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 mb-3">
                <Mail size={24} style={{
                  color: '#FF6B4A',
                  filter: 'drop-shadow(0 0 5px rgba(255, 107, 74, 0.5))'
                }} />
                <div>
                  <p className="text-sm mono-font" style={{ color: isLightMode ? '#666' : '#888' }}>Invited By</p>
                  <p className="mono-font font-bold" style={{ color: isLightMode ? '#3D405B' : '#FFFFFF' }}>{invite?.inviterEmail}</p>
                </div>
              </div>

              {group?.members && group.members.length > 0 && (
                <div className="flex items-center gap-3">
                  <Car size={24} style={{
                    color: '#FFB088',
                    filter: 'drop-shadow(0 0 5px rgba(255, 176, 136, 0.5))'
                  }} />
                  <div>
                    <p className="text-sm mono-font" style={{ color: isLightMode ? '#666' : '#888' }}>Current Members</p>
                    <p className="mono-font font-bold" style={{ color: isLightMode ? '#3D405B' : '#FFFFFF' }}>{group.members.length} member{group.members.length !== 1 ? 's' : ''}</p>
                  </div>
                </div>
              )}
            </div>

            <p className="mono-font text-sm mb-6" style={{ color: isLightMode ? '#666' : '#AAA' }}>
              By accepting, you'll join this crew and be able to track rides, share costs, and see everyone's points in real-time.
            </p>

            {error && (
              <div className="mb-4 p-3 rounded" style={{
                background: 'rgba(239, 68, 68, 0.2)',
                border: '2px solid rgba(239, 68, 68, 0.6)'
              }}>
                <p className="text-sm font-bold mono-font" style={{
                  color: '#ff4444',
                  textShadow: '0 0 10px rgba(239, 68, 68, 0.8)'
                }}>{error}</p>
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
      )}
    </TVWrapper>
  );
};

export default AcceptInvite;
