
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import '../App.css';

const MyProfile = () => {
  const { user, isAdmin } = useAuth();
  // Example extra fields; replace with actual user data if available
  const address = user?.address || 'Not provided';
  const phone = user?.phone || 'Not provided';
  const joinDate = user?.joinDate ? new Date(user.joinDate).toLocaleDateString() : 'Not available';
  // Example recent orders; replace with actual data fetch if needed
  const recentOrders = user?.orders || [];

  // Modal state and form state
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    address: user?.address || '',
    phone: user?.phone || ''
  });

  const handleEditClick = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleSave = (e) => {
    e.preventDefault();
    // Here you would send formData to backend
    setShowModal(false);
    // Optionally show a notification
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

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
        {/* Profile Header */}
        <div className="flex flex-col items-center mb-6">
          <div className="size-20 rounded-full bg-indigo-100 flex items-center justify-center mb-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="7" r="4" />
              <path d="M5.5 21v-2a4.5 4.5 0 0 1 4.5-4.5h4a4.5 4.5 0 0 1 4.5 4.5v2" />
            </svg>
          </div>
          <span className="text-lg font-semibold text-gray-900">{user.name}</span>
          <span className="text-sm text-gray-500">{user.email}</span>
          <span className={`mt-2 px-3 py-1 rounded-full text-xs font-medium ${isAdmin() ? 'bg-purple-600 text-white' : 'bg-indigo-600 text-white'}`}>
            {isAdmin() ? 'Admin' : 'User'}
          </span>
          <button className="mt-4 px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600 transition" onClick={handleEditClick}>Edit Profile</button>
        </div>
        {/* Profile Details */}
        <div className="space-y-2 mb-6">
          <h3 className="text-indigo-700 font-semibold mb-2">Profile Details</h3>
          <div className="flex items-center justify-between">
            <span className="text-gray-600 font-medium">Name:</span>
            <span className="text-gray-900">{user.name}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600 font-medium">Email:</span>
            <span className="text-gray-900">{user.email}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600 font-medium">Role:</span>
            <span className="text-gray-900">{isAdmin() ? 'Admin' : 'User'}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600 font-medium">Address:</span>
            <span className="text-gray-900">{address}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600 font-medium">Phone:</span>
            <span className="text-gray-900">{phone}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600 font-medium">Joined:</span>
            <span className="text-gray-900">{joinDate}</span>
          </div>
        </div>
        {/* Recent Orders Section */}
        <div className="mb-6">
          <h3 className="text-indigo-700 font-semibold mb-2">Recent Orders</h3>
          {recentOrders.length > 0 ? (
            <ul className="divide-y divide-gray-200">
              {recentOrders.slice(0, 3).map((order, idx) => (
                <li key={order.id || idx} className="py-2 flex justify-between items-center">
                  <span className="text-gray-700">Order #{order.id || idx + 1}</span>
                  <span className="text-gray-500">{order.date ? new Date(order.date).toLocaleDateString() : 'N/A'}</span>
                  <span className="text-green-600 font-medium">{order.status || 'Completed'}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No recent orders found.</p>
          )}
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
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm relative">
              <h2 className="text-xl font-bold mb-4 text-indigo-700">Edit Profile</h2>
              <form onSubmit={handleSave} className="space-y-4">
                <div>
                  <label className="block text-gray-700 mb-1" htmlFor="name">Name</label>
                  <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} className="w-full border rounded px-3 py-2" />
                </div>
                <div>
                  <label className="block text-gray-700 mb-1" htmlFor="email">Email</label>
                  <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} className="w-full border rounded px-3 py-2" />
                </div>
                <div>
                  <label className="block text-gray-700 mb-1" htmlFor="address">Address</label>
                  <input type="text" id="address" name="address" value={formData.address} onChange={handleChange} className="w-full border rounded px-3 py-2" />
                </div>
                <div>
                  <label className="block text-gray-700 mb-1" htmlFor="phone">Phone</label>
                  <input type="text" id="phone" name="phone" value={formData.phone} onChange={handleChange} className="w-full border rounded px-3 py-2" />
                </div>
                <div className="flex justify-end gap-2 mt-4">
                  <button type="button" onClick={handleCloseModal} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">Cancel</button>
                  <button type="submit" className="px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600">Save</button>
                </div>
              </form>
              <button onClick={handleCloseModal} className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 text-xl">&times;</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyProfile;
