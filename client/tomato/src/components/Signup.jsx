import { useState } from 'react';
import { Link } from 'react-router-dom';
import bg from "../assets/bg.jpeg";
import axios from 'axios';
import {useNavigate}from 'react-router-dom';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null); 
  const navigate = useNavigate();

  
  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };
 
  const validatePassword = (password) => {

    const regex = /^.{6,8}$/;
    return regex.test(password);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name) {
      setError('Please enter your name.');
      return;
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }
    if (!validatePassword(password)) {
      setError('Password should be 6-8 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }


    setLoading(true);

    try {
      // Make a POST request to the backend API
      const response = await axios.post('http://localhost:3001/api/signup', {
        name,
        email,
        password,
      });

      navigate("/signin");
      console.log(response.data); 
    } catch (error) {
      console.error(error.response.data);
      setError(error.response.data.message); 
    }

    setLoading(false);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{
        backgroundImage:`url(${bg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="max-w-md w-full">
        <div className="bg-white bg-opacity-80 p-8 rounded-lg shadow-md">
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">New User Sign Up</h2>
            <input type="hidden" name="remember" defaultValue="true" />
            <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="name" className="sr-only">Name</label>
                <input 
                  id="name" 
                  name="name" 
                  type="text" 
                  autoComplete="name" 
                  required 
                  className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm" 
                  placeholder="Name" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                />
              </div>
            </div>
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <label htmlFor="email-address" className="sr-only">Email address</label>
                <input 
                  id="email-address" 
                  name="email" 
                  type="email" 
                  autoComplete="email" 
                  required 
                  className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm" 
                  placeholder="Email address" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                />
              </div>
            </div>
            <div className="relative rounded-md shadow-sm -space-y-px">
              <div className="flex items-center">
                <label htmlFor="password" className="sr-only">Password</label>
                <input 
                  id="password" 
                  name="password" 
                  type={showPassword ? 'text' : 'password'} 
                  autoComplete="new-password" 
                  required 
                  className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm" 
                  placeholder="Password" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                />
                <button 
                  type="button" 
                  onClick={togglePasswordVisibility} 
                  className="absolute inset-y-0 right-0 flex items-center px-2"
                >
                  {showPassword ? (
                    <svg className="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.071 4.929a8 8 0 010 11.314M2.929 19.071a8 8 0 1011.314-11.314M15.536 15.536a4 4 0 01-5.656-5.656" />
                    </svg>
                  ) : (
                    <svg className="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.536 15.536a4 4 0 01-5.656-5.656" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2 2l20 20" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
            <div className="relative rounded-md shadow-sm -space-y-px">
              <div className="flex items-center">
                <label htmlFor="confirm-password" className="sr-only">Confirm Password</label>
                <input 
                  id="confirm-password" 
                  name="confirm-password" 
                  type={showConfirmPassword ? 'text' : 'password'} 
                  autoComplete="new-password" 
                  required 
                  className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm" 
                  placeholder="Confirm Password" 
                  value={confirmPassword} 
                  onChange={(e) => setConfirmPassword(e.target.value)} 
                />
                <button 
                  type="button" 
                  onClick={toggleConfirmPasswordVisibility} 
                  className="absolute inset-y-0 right-0 flex items-center px-2"
                >
                  {showConfirmPassword ? (
                    <svg className="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.071 4.929a8 8 0 010 11.314M2.929 19.071a8 8 0 1011.314-11.314M15.536 15.536a4 4 0 01-5.656-5.656" />
                    </svg>
                  ) : (
                    <svg className="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.536 15.536a4 4 0 01-5.656-5.656" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2 2l20 20" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>} {}
            <div>
              <button 
                type="submit" 
                disabled={loading} 
                className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${loading ? 'cursor-not-allowed opacity-50' : ''}`}
              >
                {loading ? 'Signing up...' : 'Sign up'} {}
              </button>
            </div>
            <div className="text-sm text-center"> 
              <p>Already have an account?  
              <Link className="font-medium text-indigo-600 hover:text-indigo-500" to="/signin"> Sign in</Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
