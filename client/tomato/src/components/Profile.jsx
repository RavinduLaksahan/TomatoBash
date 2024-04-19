import { useEffect, useState, } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { IoHome } from "react-icons/io5";
import { MdIntegrationInstructions } from "react-icons/md";
import { MdLeaderboard } from "react-icons/md";
import { FaUser } from "react-icons/fa";
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from "react-router";

const Profile = () => {
  const location = useLocation();
  const [userData, setUserData] = useState(null);
  const [showPasswordFields, setShowPasswordFields] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const navigate = useNavigate();

  const validatePassword = (password) => {
    const regex = /^.{6,8}$/;
    return regex.test(password);
  };

  const handlePasswordUpdate = async () => {

    if (!oldPassword || !newPassword || !confirmPassword) {
      setErrorMessage('Please fill in all fields.');
      setSuccessMessage('');
      return;
    }
    if (!validatePassword(newPassword, confirmPassword)) {
      setErrorMessage('Password should be 6-8 characters.');
      return;
    }

    
  
    if (newPassword !== confirmPassword) {
      setErrorMessage('New password and confirm password do not match.');
      setSuccessMessage('');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('Token not found');
        return;
      }
      const validateResponse = await axios.post(
        'http://localhost:3001/api/validate-password',
        { oldPassword },
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );
  
      if (validateResponse.status !== 200) {
        setErrorMessage('Old password is incorrect.');
        setSuccessMessage('');
        return;
      }

      const response = await axios.post(
        'http://localhost:3001/api/update-password',
        {newPassword },
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );
      setOldPassword('');
    setNewPassword('');
    setConfirmPassword('');

      setSuccessMessage(response.data.message);
      setErrorMessage('');
      setShowPasswordFields(false);
    } catch (error) {
      console.error('Error updating password:', error);
      setErrorMessage('Failed to update password. Please try again.');
      setSuccessMessage('');
    }
  };

  const togglePasswordFields = () => {
    setShowPasswordFields(!showPasswordFields);
  };

  const handleLogout = () => {
    // clear token from local storage
    localStorage.removeItem('token');
    // Redirect to the welcome page
    navigate('/signin');
    
  };


  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('token');
    if (!token) {
      console.error('Token not found');
      return;
    }
      try {
        // Assuming you have an endpoint to fetch user data
        const response = await axios.get('http://localhost:3001/api/user-data', {
          headers: {
            Authorization: `${token}`,
          },
        });
        setUserData(response.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  const handleDeleteAccount = async () => {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            console.error('Token not found');
            return;
        }
        await axios.delete(
            'http://localhost:3001/api/delete-account',
            {
                headers: {
                    Authorization: `${token}`,
                },
            }
        );
        navigate('/signin');
    } catch (error) {
        console.error('Error deleting account:', error);
    }
};

  const confirmDeleteAccount = () => {
    // Show delete account confirmation modal
    setShowDeleteModal(true);
  };

  
  return (
    <div className="bg-red-200">
      <nav className="bg-gradient-to-r from-green-800 to-orange-700 p-4 flex justify-between items-center">
      <div className="text-2xl">
          <Link to="/gamepage"> 🍅<span className="gradient-text">Tomato Bash</span>🍅</Link>
           </div>
          <div className="max-w-7xl flex justify-between">
          <NavLink exact to="/gamepage" className={`flex items-center text-white mr-4 hover:border-b-2 border-orange-600 ${location.pathname === '/gamepage' ? 'text-yellow-500' : ''}`} activeClassName="font-bold">
            <IoHome className="mr-2" /> Home
          </NavLink>
          <NavLink to="/instructions" className={`flex items-center text-white mr-4 hover:border-b-2 border-orange-600 ${location.pathname === '/instructions' ? 'text-yellow-500' : ''}`} activeClassName="font-bold">
            <MdIntegrationInstructions className="mr-2" /> Instructions
          </NavLink>
          
          <NavLink to="/leaderboard" className={`flex items-center text-white mr-4 hover:border-b-2 border-orange-600 ${location.pathname === '/leaderboard' ? 'text-yellow-500' : ''}`} activeClassName="font-bold">
            <MdLeaderboard className="mr-2" /> Leaderboard
          </NavLink>
          <NavLink to="/profile" className={`flex items-center text-white mr-4 hover:border-b-2 border-orange-600 ${location.pathname === '/profile' ? 'text-yellow-500' : ''}`} activeClassName="font-bold">
            <FaUser className="mr-2" /> Profile
          </NavLink>
        </div>
        
      </nav>
      <div className="items-center h-screen">
  <div className="max-w-lg mx-auto mt-20 bg-white bg-opacity-25 backdrop-blur-md backdrop-filter rounded-lg p-10 ">
    <h1 className="text-5xl font-bold mb-8 flex justify-center gradient-text">Profile</h1>
    {userData ? (
      <div className="text-center mb-6" >
        <div className="mb-8 text-2xl">
          <span className="font-bold">Name:</span> {userData.name}
        </div>
        <div className="mb-8 text-2xl">
          <span className="font-bold">Email:</span> {userData.email}
        </div>
        <div className="mb-8 text-2xl">
          <span className="font-bold">Your High Score:</span> {userData.score}
        </div>
        {!showPasswordFields && (
          <div className="flex justify-center">
            <button onClick={togglePasswordFields} className="bg-blue-500 text-white px-4 py-2 rounded-md">
              Update Password
            </button>
          </div>
        )}
        {showPasswordFields && (
            <div className="flex justify-center">
              <div>
                <div className="mb-8">
                  <input
                    type="password"
                    placeholder="Old Password"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    className="border-gray-300 border-solid border p-2 rounded-md"
                  />
                </div>
                <div className="mb-8">
                  <input
                    type="password"
                    placeholder="New Password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="border-gray-300 border-solid border p-2 rounded-md"
                  />
                </div>
                <div className="mb-8">
                  <input
                    type="password"
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="border-gray-300 border-solid border p-2 rounded-md"
                  />
                </div>
                <div className="mb-8 flex flex-col items-center">
                {successMessage && <p className="text-green-500">{successMessage}</p>}
                  {errorMessage && <p className="text-red-500">{errorMessage}</p>}
                  <button onClick={handlePasswordUpdate} className="bg-blue-500 text-white px-4 py-2 rounded-md">
                    Update
                  </button>
                  
                </div>
                
            </div>
            </div>
          )}
      

      </div>
    ) : (
      <div>Loading...</div>
    )}
    <div className="mt-4 flex justify-center">
            <button onClick={() => setShowLogoutModal(true)} className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 focus:outline-none focus:bg-blue-600">
              Logout
            </button>
          </div>

    <div className="mt-4 flex justify-center">
            <button onClick={confirmDeleteAccount} className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 focus:outline-none focus:bg-blue-600 mr-2">
              Delete Account
            </button>
         </div>
          
       </div>
       {showLogoutModal && (
            <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center">
              <div className="bg-white p-6 rounded-md shadow-lg">
              <h2 className="text-3xl font-bold mb-4 flex justify-center">🍅<span className="gradient-text ">Quiting?</span>🍅</h2>
                <p className="text-lg mb-4 font-bold">Are you sure you want to logout ?</p>
                <div className="flex justify-center">
                  <button onClick={handleLogout} className="bg-red-500 text-white  hover:bg-orange-600 focus:outline-none focus:bg-blue-600 px-4 py-2 rounded-md mr-2">
                    Yes
                  </button>
                  <button onClick={() => setShowLogoutModal(false)} className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md">
                    No
                  </button>
                </div>
              </div>
            </div>
          )}
          {showDeleteModal && (
  <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center">
    <div className="bg-white p-6 rounded-md shadow-lg">
      <h2 className="text-3xl font-bold mb-4 flex justify-center">🍅<span className="gradient-text">Delete Account</span>🍅</h2>
      <p className="text-lg mb-4 font-bold">Are you sure you want to delete your account?</p>
      <div className="flex justify-center">
        <button onClick={handleDeleteAccount} className="bg-red-500 text-white hover:bg-orange-600 focus:outline-none focus:bg-blue-600 px-4 py-2 rounded-md mr-2">
          Yes
        </button>
        <button onClick={() => setShowDeleteModal(false)} className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md">
          No
        </button>
      </div>
    </div>
  </div>
)}
          
      </div>


      </div>
  )
}

export default Profile