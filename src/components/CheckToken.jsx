import React, { useEffect } from 'react';

const CheckToken = () => {
  useEffect(() => {
    const token = localStorage.getItem('token'); // Check if token is in localStorage
    
    if (token) {
      console.log('Token is stored:', token);
      // You can also perform actions like setting state, checking authentication, etc.
    } else {
      console.log('Token is not found');
    }
  }, []);

  return (
    <div>
      <h1>Token Check</h1>
    </div>
  );
};

export default CheckToken;
