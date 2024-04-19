import { useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { IoHome } from "react-icons/io5";
import { MdIntegrationInstructions } from "react-icons/md";
import { MdLeaderboard } from "react-icons/md";
import { FaUser } from "react-icons/fa";
import { Link } from 'react-router-dom';
import axios from 'axios';
import leaderboard from "../assets/leaderboard.png";


const Leaderboard = () => {
  const location = useLocation();
  const [scores, setScores] = useState([]);

  useEffect(() => {
    const fetchScores = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/all-scores');
        setScores(response.data);
      } catch (error) {
        console.error('Error fetching scores:', error);
      }
    };

    fetchScores();
  }, []);
  
  return (
    <div className="relative" style={{ backgroundImage: `url(${leaderboard})`, backgroundSize: 'cover', backgroundPosition: 'center', minHeight: '100vh' }}>
      <nav className="bg-gradient-to-r from-green-800 to-orange-700 p-4 flex justify-between items-center">
      <div className="text-2xl">
          <Link to="/gamepage"> 🍅<span className="gradient-text">Tomato Bash</span>🍅</Link>
           </div>
          <div className="max-w-7xl flex justify-between">
          <NavLink exact to="/gamepage" className={`flex items-center text-white mr-4 hover:border-b-2 border-orange-600 ${location.pathname === '/gamepage' ? 'text-yellow-300' : ''}`} activeClassName="font-bold">
            <IoHome className="mr-2" /> Home
          </NavLink>
          <NavLink to="/instructions" className={`flex items-center text-white mr-4 hover:border-b-2 border-orange-600 ${location.pathname === '/instructions' ? 'text-yellow-300' : ''}`} activeClassName="font-bold">
            <MdIntegrationInstructions className="mr-2" /> Instructions
          </NavLink>
          
          <NavLink to="/leaderboard" className={`flex items-center text-white mr-4 hover:border-b-2 border-orange-600 ${location.pathname === '/leaderboard' ? 'text-yellow-300' : ''}`} activeClassName="font-bold">
            <MdLeaderboard className="mr-2" /> Leaderboard
          </NavLink>
          <NavLink to="/profile" className={`flex items-center text-white mr-4 hover:border-b-2 border-orange-600 ${location.pathname === '/profile' ? 'text-yellow-300' : ''}`} activeClassName="font-bold">
            <FaUser className="mr-2" /> Profile
          </NavLink>
        </div>
      </nav>
      <div className="max-w-lg mx-auto mt-20 bg-white bg-opacity-25 backdrop-blur-md backdrop-filter rounded-lg p-4 ">
       <div className="text-center mb-6">
          <h1 className="text-5xl font-bold gradient-text ">Leaderboard</h1>
        </div>
        <ol className="divide-y divide-gray-200">
          {scores.map((score, index) => (
            <li key={index} className="flex justify-between items-center py-4">
              <span className="flex items-center">
                {index === 0 && <span className="text-2xl font-semibold">🥇</span>}
                {index === 1 && <span className="text-xl font-semibold">🥈</span>}
                {index === 2 && <span className="text-lg font-semibold">🥉</span>}
                {index > 2 && <span className="text-lg font-semibold">{index + 1}.</span>}
                <span className={`ml-2 font-semibold text-lg ${index < 3 ? 'text-xl' : ''}`}>{score.name}</span>
              </span>
              <span className={`${index < 3 ? 'font-semibold text-lg' : 'text-lg'}`}>{score.score}</span>
            </li>
          ))}
        </ol>
      </div>


      </div>
  )
}

export default Leaderboard