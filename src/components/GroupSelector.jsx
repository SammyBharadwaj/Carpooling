import { useState, useEffect } from 'react';
import { Users, Plus, ChevronDown } from 'lucide-react';
import { groupService } from '../services/firestoreService';
import { useAuth } from '../contexts/AuthContext';

const GroupSelector = ({ currentGroupId, onGroupChange, onCreateNew }) => {
  const { user } = useAuth();
  const [groups, setGroups] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadUserGroups();
    }
  }, [user]);

  const loadUserGroups = async () => {
    try {
      setLoading(true);
      const userGroups = await groupService.getUserGroups(user.uid);
      setGroups(userGroups);
    } catch (error) {
      console.error('Error loading groups:', error);
    } finally {
      setLoading(false);
    }
  };

  const currentGroup = groups.find(g => g.id === currentGroupId);

  const handleSelectGroup = (group) => {
    onGroupChange(group);
    setIsOpen(false);
  };

  if (loading) {
    return (
      <div className="px-4 py-2 bg-white border-4 border-[#3D405B] rounded mono-font text-sm deep-forest">
        Loading crews...
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Current Group Display / Dropdown Trigger */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 bg-white border-4 border-[#3D405B] rounded-lg shadow-retro hover:shadow-retro-lg transition-all flex items-center justify-between group"
      >
        <div className="flex items-center gap-3">
          <Users size={20} className="text-[#2A9D8F]" />
          <div className="text-left">
            <p className="text-xs mono-font text-gray-600">Current Crew</p>
            <p className="pixel-font text-lg deep-forest">
              {currentGroup?.name || 'No Crew Selected'}
            </p>
          </div>
        </div>
        <ChevronDown
          size={20}
          className={`deep-forest transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* Dropdown */}
          <div className="absolute top-full left-0 right-0 mt-2 bg-white border-4 border-[#3D405B] rounded-lg shadow-retro-lg z-50 max-h-64 overflow-y-auto">
            {/* Group List */}
            {groups.length > 0 ? (
              <div className="py-2">
                {groups.map((group) => (
                  <button
                    key={group.id}
                    onClick={() => handleSelectGroup(group)}
                    className={`w-full px-4 py-3 text-left hover:bg-[#FDF8F3] transition-colors flex items-center justify-between ${
                      group.id === currentGroupId ? 'bg-[#FDF8F3]' : ''
                    }`}
                  >
                    <div>
                      <p className="pixel-font text-lg deep-forest">{group.name}</p>
                      <p className="text-xs mono-font text-gray-600">
                        {group.members?.length || 0} member{group.members?.length !== 1 ? 's' : ''}
                      </p>
                    </div>
                    {group.id === currentGroupId && (
                      <div className="w-2 h-2 rounded-full bg-[#2A9D8F]" />
                    )}
                  </button>
                ))}
              </div>
            ) : (
              <div className="px-4 py-6 text-center">
                <p className="mono-font text-sm text-gray-600">No crews yet</p>
              </div>
            )}

            {/* Create New Button */}
            <div className="border-t-4 border-[#3D405B] p-2">
              <button
                onClick={() => {
                  onCreateNew();
                  setIsOpen(false);
                }}
                className="w-full px-4 py-3 bg-gradient-to-r from-[#E07A5F] to-[#F4A261] rounded-lg text-white font-bold mono-font hover:from-[#FF6B4A] hover:to-[#E85D3C] transition-all flex items-center justify-center gap-2"
              >
                <Plus size={20} />
                CREATE NEW CREW
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default GroupSelector;
