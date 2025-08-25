import React from 'react';

const Profile = ({ name, zone }) => {
  return (
    <div className="profile-section" style={{ backgroundColor: '#f0f8ff', padding: 15, borderRadius: 8, marginBottom: 20 }}>
      <h3>👤 Profile</h3>
      <p><strong>Name:</strong> {name}</p>
      <p><strong>Zone:</strong> {zone}</p>
    </div>
  );
};

export default Profile;
