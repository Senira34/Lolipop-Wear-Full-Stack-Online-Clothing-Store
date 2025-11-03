
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { updateUserProfile, getUserProfile } from '../services/api';
import '../App.css';

const MyProfile = () => {
  const { user, updateUser, isAdmin } = useAuth();
  const { success, error } = useNotification();
  
  // State for loading and modal
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  
  // Profile data state
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });

  // Form state for editing
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });

  // Load user profile data
  useEffect(() => {
    const loadProfile = async () => {
      if (user?._id) {
        try {
          const data = await getUserProfile(user._id);
          const profileInfo = {
            name: data.name || '',
            email: data.email || '',
            phone: data.phone || '',
            // Get the default address or first address
            address: data.address && data.address.length > 0 
              ? `${data.address[0].street || ''}, ${data.address[0].city || ''}, ${data.address[0].state || ''} ${data.address[0].zipCode || ''}`.trim()
              : ''
          };
          setProfileData(profileInfo);
          setFormData(profileInfo);
        } catch (err) {
          console.error('Error loading profile:', err);
        }
      }
    };
    loadProfile();
  }, [user]);

  const handleEditClick = () => {
    setFormData({
      name: profileData.name,
      email: profileData.email,
      phone: profileData.phone,
      address: profileData.address
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setFormData({
      name: profileData.name,
      email: profileData.email,
      phone: profileData.phone,
      address: profileData.address
    });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    
    if (!user?._id) {
      error('User not authenticated');
      return;
    }

    setLoading(true);
    try {
      // Prepare update data
      const updateData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone
      };

      // Update user profile in backend
      const updatedUser = await updateUserProfile(user._id, updateData);
      
      // Update local state
      setProfileData({
        name: updatedUser.name,
        email: updatedUser.email,
        phone: formData.phone,
        address: formData.address
      });

      // Update auth context with new user data
      updateUser({
        name: updatedUser.name,
        email: updatedUser.email
      });

      success('Profile updated successfully!');
      setShowModal(false);
    } catch (err) {
      console.error('Error updating profile:', err);
      error(err.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md text-center">
          <h2 className="text-2xl font-bold mb-4 text-indigo-700">My Profile</h2>
          <p className="text-gray-500">Please log in to view your profile.</p>
        </div>
      </div>
    );
  }

  const joinDate = user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Not available';

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] py-8">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
        {/* Profile Header */}
        <div className="flex flex-col items-center mb-6">
          <div className="size-20 rounded-full bg-indigo-100 flex items-center justify-center mb-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="7" r="4" />
              <path d="M5.5 21v-2a4.5 4.5 0 0 1 4.5-4.5h4a4.5 4.5 0 0 1 4.5 4.5v2" />
            </svg>
          </div>
          <span className="text-lg font-semibold text-gray-900">{profileData.name || user.name}</span>
          <span className="text-sm text-gray-500">{profileData.email || user.email}</span>
          <span className={`mt-2 px-3 py-1 rounded-full text-xs font-medium ${isAdmin() ? 'bg-purple-600 text-white' : 'bg-indigo-600 text-white'}`}>
            {isAdmin() ? 'Admin' : 'User'}
          </span>
          <button 
            className="mt-4 px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600 transition disabled:opacity-50" 
            onClick={handleEditClick}
            disabled={loading}
          >
            Edit Profile
          </button>
        </div>
        {/* Profile Details */}
        <div className="space-y-2 mb-6">
          <h3 className="text-indigo-700 font-semibold mb-2">Profile Details</h3>
          <div className="flex items-center justify-between">
            <span className="text-gray-600 font-medium">Name:</span>
            <span className="text-gray-900">{profileData.name || 'Not provided'}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600 font-medium">Email:</span>
            <span className="text-gray-900">{profileData.email || 'Not provided'}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600 font-medium">Role:</span>
            <span className="text-gray-900">{isAdmin() ? 'Admin' : 'User'}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600 font-medium">Phone:</span>
            <span className="text-gray-900">{profileData.phone || 'Not provided'}</span>
          </div>
          <div className="flex items-start justify-between">
            <span className="text-gray-600 font-medium">Address:</span>
            <span className="text-gray-900 text-right max-w-[60%]">{profileData.address || 'Not provided'}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600 font-medium">Joined:</span>
            <span className="text-gray-900">{joinDate}</span>
          </div>
        </div>
        {/* Admin Controls */}
        {isAdmin() && (
          <div className="mt-6 p-4 bg-purple-50 rounded-lg border border-purple-200">
            <h3 className="text-purple-700 font-semibold mb-2">Admin Controls</h3>
            <p className="text-sm text-purple-600">Access admin dashboard and manage users, products, and orders.</p>
          </div>
        )}
        {/* Edit Profile Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 p-4">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg relative">
              <h2 className="text-xl font-bold mb-4 text-indigo-700">Edit Profile</h2>
              <form onSubmit={handleSave} className="space-y-4">
                <div>
                  <label className="block text-gray-700 mb-1 font-medium" htmlFor="name">Name</label>
                  <input 
                    type="text" 
                    id="name" 
                    name="name" 
                    value={formData.name} 
                    onChange={handleChange} 
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-1 font-medium" htmlFor="email">Email</label>
                  <input 
                    type="email" 
                    id="email" 
                    name="email" 
                    value={formData.email} 
                    onChange={handleChange} 
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-1 font-medium" htmlFor="phone">Phone</label>
                  <input 
                    type="tel" 
                    id="phone" 
                    name="phone" 
                    value={formData.phone} 
                    onChange={handleChange} 
                    placeholder="e.g., +1 234 567 8900"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-1 font-medium" htmlFor="address">Address</label>
                  <textarea 
                    id="address" 
                    name="address" 
                    value={formData.address} 
                    onChange={handleChange} 
                    rows="3"
                    placeholder="Street, City, State, ZIP"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div className="flex justify-end gap-2 mt-6">
                  <button 
                    type="button" 
                    onClick={handleCloseModal} 
                    className="px-5 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 transition font-medium"
                    disabled={loading}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="px-5 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={loading}
                  >
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
              <button 
                onClick={handleCloseModal} 
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl font-bold"
                disabled={loading}
              >
                &times;
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyProfile;
