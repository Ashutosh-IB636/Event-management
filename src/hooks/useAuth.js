import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const useAuth = () => {
  const [role, setRole] = useState('employee');
  const navigate = useNavigate();

  const login = (userRole) => {
    setRole(userRole);
    if (userRole === 'admin') {
      navigate('/admin');
    } else {
      navigate('/employee');
    }
  };

  const logout = () => {
    setRole('employee');
    navigate('/');
  };

  return { role, login, logout };
};

export default useAuth;