import {
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  onSnapshot,
  arrayUnion,
  arrayRemove,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '../config/firebase';

/**
 * User Data Service
 */
export const userService = {
  // Create or update user profile
  async createUser(userId, userData) {
    try {
      const userRef = doc(db, 'users', userId);
      await setDoc(userRef, {
        ...userData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      }, { merge: true });
      console.log('✅ User created/updated:', userId);
    } catch (error) {
      console.error('❌ Error creating user:', error);
      throw error;
    }
  },

  // Get user data
  async getUser(userId) {
    try {
      const userRef = doc(db, 'users', userId);
      const userSnap = await getDoc(userRef);
      return userSnap.exists() ? userSnap.data() : null;
    } catch (error) {
      console.error('❌ Error getting user:', error);
      throw error;
    }
  }
};

/**
 * Group Data Service
 */
export const groupService = {
  // Create a new group
  async createGroup(userId, groupData) {
    try {
      const groupRef = doc(collection(db, 'groups'));
      const newGroup = {
        ...groupData,
        ownerId: userId,
        memberIds: [userId],
        members: groupData.members || [],
        trips: groupData.trips || [],
        achievements: groupData.achievements || [],
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      await setDoc(groupRef, newGroup);
      console.log('✅ Group created:', groupRef.id);
      return { id: groupRef.id, ...newGroup };
    } catch (error) {
      console.error('❌ Error creating group:', error);
      throw error;
    }
  },

  // Get a group by ID
  async getGroup(groupId) {
    try {
      const groupRef = doc(db, 'groups', groupId);
      const groupSnap = await getDoc(groupRef);

      if (groupSnap.exists()) {
        return { id: groupSnap.id, ...groupSnap.data() };
      }
      return null;
    } catch (error) {
      console.error('❌ Error getting group:', error);
      throw error;
    }
  },

  // Update group data
  async updateGroup(groupId, updates) {
    try {
      const groupRef = doc(db, 'groups', groupId);
      await updateDoc(groupRef, {
        ...updates,
        updatedAt: serverTimestamp()
      });
      console.log('✅ Group updated:', groupId);
    } catch (error) {
      console.error('❌ Error updating group:', error);
      throw error;
    }
  },

  // Delete a group
  async deleteGroup(groupId) {
    try {
      await deleteDoc(doc(db, 'groups', groupId));
      console.log('✅ Group deleted:', groupId);
    } catch (error) {
      console.error('❌ Error deleting group:', error);
      throw error;
    }
  },

  // Get all groups for a user
  async getUserGroups(userId) {
    try {
      const q = query(
        collection(db, 'groups'),
        where('memberIds', 'array-contains', userId)
      );

      const groups = [];
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        groups.push({ id: doc.id, ...doc.data() });
      });

      return groups;
    } catch (error) {
      console.error('❌ Error getting user groups:', error);
      throw error;
    }
  },

  // Subscribe to real-time group updates
  subscribeToGroup(groupId, callback) {
    const groupRef = doc(db, 'groups', groupId);
    return onSnapshot(groupRef, (doc) => {
      if (doc.exists()) {
        callback({ id: doc.id, ...doc.data() });
      } else {
        callback(null);
      }
    });
  },

  // Add member to group
  async addMemberToGroup(groupId, userId) {
    try {
      const groupRef = doc(db, 'groups', groupId);
      await updateDoc(groupRef, {
        memberIds: arrayUnion(userId),
        updatedAt: serverTimestamp()
      });
      console.log('✅ Member added to group:', userId);
    } catch (error) {
      console.error('❌ Error adding member:', error);
      throw error;
    }
  },

  // Remove member from group
  async removeMemberFromGroup(groupId, userId) {
    try {
      const groupRef = doc(db, 'groups', groupId);
      await updateDoc(groupRef, {
        memberIds: arrayRemove(userId),
        updatedAt: serverTimestamp()
      });
      console.log('✅ Member removed from group:', userId);
    } catch (error) {
      console.error('❌ Error removing member:', error);
      throw error;
    }
  }
};

/**
 * Invitation Service
 */
export const inviteService = {
  // Create an invitation
  async createInvite(groupId, groupName, inviterEmail, inviteType = 'link', memberData = {}) {
    try {
      const inviteRef = doc(collection(db, 'invites'));
      const invite = {
        groupId,
        groupName,
        inviterEmail,
        type: inviteType, // 'link' or 'email'
        memberData, // Store member details in Firestore, not localStorage
        used: false,
        createdAt: serverTimestamp(),
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
      };

      await setDoc(inviteRef, invite);
      console.log('✅ Invite created:', inviteRef.id);
      return inviteRef.id;
    } catch (error) {
      console.error('❌ Error creating invite:', error);
      throw error;
    }
  },

  // Get invite details
  async getInvite(inviteId) {
    try {
      const inviteRef = doc(db, 'invites', inviteId);
      const inviteSnap = await getDoc(inviteRef);

      if (inviteSnap.exists()) {
        const invite = inviteSnap.data();
        // Check if expired
        if (invite.expiresAt && invite.expiresAt.toDate() < new Date()) {
          return null;
        }
        return { id: inviteSnap.id, ...invite };
      }
      return null;
    } catch (error) {
      console.error('❌ Error getting invite:', error);
      throw error;
    }
  },

  // Mark invite as used
  async markInviteUsed(inviteId) {
    try {
      const inviteRef = doc(db, 'invites', inviteId);
      await updateDoc(inviteRef, {
        used: true,
        usedAt: serverTimestamp()
      });
      console.log('✅ Invite marked as used:', inviteId);
    } catch (error) {
      console.error('❌ Error marking invite as used:', error);
      throw error;
    }
  }
};

// Import getDocs
import { getDocs } from 'firebase/firestore';
