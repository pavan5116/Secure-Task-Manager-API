import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { setTokenInMemory } from '../Api'; 

export default function Logout() {
  const navigate = useNavigate();

  useEffect(() => {
    const performLogout = () => {
      localStorage.removeItem("refresh");
      setTokenInMemory(null);
      navigate("/Login");
    };

    performLogout();
  }, [navigate]);

  return (
    <div>
      <h2>Logging out...</h2>
    </div>
  );
}