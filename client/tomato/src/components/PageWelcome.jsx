import  { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import welcomebg from "../assets/welcomebg.png";

const WelcomePage = () => {
  const [showButtons, setShowButtons] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowButtons(true);
    }, 3000);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100" 
    style={{
      backgroundImage:`url(${welcomebg})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    }}>
    <h1 className="text-8xl font-extrabold mb-8 gradient-text">WELCOME TO TOMATO BASH!</h1>
      {showButtons && (
        <div className="flex space-x-4">
        <Link to="/signin" className="text-2xl py-2 px-4 rounded-md  font-semibold gradient-text hover:bg-opacity-50 hover:border-red-600 hover:border-4 transition-all duration-300">Sign in</Link>
        <Link to="/signup" className="text-2xl py-2 px-4 rounded-md  font-semibold gradient-text hover:bg-opacity-50 hover:border-red-600 hover:border-4 transition-all duration-300">Sign up</Link>
      </div>
      
      )}
    </div>
  );
};

export default WelcomePage;
