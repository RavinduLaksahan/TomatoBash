import { useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import axios from 'axios';
import { IoHome } from "react-icons/io5";
import { MdIntegrationInstructions } from "react-icons/md";
import { MdLeaderboard } from "react-icons/md";
import { FaUser } from "react-icons/fa";
import { Link } from 'react-router-dom';
import {Score} from "../Class/Score.js"
import zeroImage from '../assets/0.png';
import oneImage from '../assets/1.png';
import twoImage from '../assets/2.png';
import threeImage from '../assets/3.png';
import fourImage from '../assets/4.png';
import fiveImage from '../assets/5.png';
import sixImage from '../assets/6.png';
import sevenImage from '../assets/7.png';
import eightImage from '../assets/8.png';
import nineImage from '../assets/9.png';

const score = new Score();

const Gamepage = () => {
  const location = useLocation();
  const [question, setQuestion] = useState('');
  const [solution, setSolution] = useState('');
  const [timeLeft, setTimeLeft] = useState(30);
  const [showModal, setShowModal] = useState(false);
  const [lives, setLives] = useState(3); 
  const [showLoseModal, setShowLoseModal] = useState(false);

  // Function to fetch question and solution from the API
    const fetchQuestionAndSolution = async () => {
      try {
        const url = 'https://marcconrad.com/uob/tomato/api.php';
        const outParam = 'json';
        const base64Param = 'no';

        const response = await axios.get(url, {
          params: { out: outParam, base64Param: base64Param },
        });

        if (response.data && response.data.question) {
          setQuestion(response.data.question);
          setSolution(response.data.solution);
          console.log(response.data.solution);
        } else {
          throw new Error('Question or solution not found in API response');
        }
      } catch (error) {
        console.error('Error fetching question and solution:', error);
      }
    };

    useEffect(() => {
      fetchQuestionAndSolution();
      score.resetScore();
    }, []);

    // useEffect hook to manage countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prevTimeLeft => prevTimeLeft - 1);
    }, 1000);

    if (timeLeft === 0) {
      clearInterval(timer);
      setShowModal(true);
    }

    return () => clearInterval(timer);
  }, [timeLeft]);

  const closeModal = () => {
    setShowModal(false);
    setShowLoseModal(false);
    setQuestion("");
    setTimeLeft(30); 
    setLives(3);
    score.resetScore();
    fetchQuestionAndSolution();
  };

  const saveScoreToDatabase = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('Token not found');
      return;
    }
  
    try {
      // Fetch user's data from the server
      const response = await axios.get('http://localhost:3001/api/current-score', {
        headers: {
          Authorization: `${token}`,
        },
      });
  
      // Extract the stored high score from the response
      const currentScore = response.data.score;
  
      // Get the current score from the score instance
      const newScore = score.getScore();
  
      // Check if the new score is greater than the current score
      if (newScore > currentScore) {
        // If the new score is higher, save it to the database
        await axios.post(
          'http://localhost:3001/api/save-score',
          { score: newScore },
          {
            headers: {
              Authorization: `${token}`,
            },
          }
        );
        console.log('New high score saved successfully!');
      } else {
        console.log('Current score is not higher than the stored high score. High score remains unchanged.');
      }
    } catch (error) {
      console.error('Error saving high score:', error);
    }
  };
  
  

//Function to handle answer click events
  const handleAnswerClick = (answer) => {
    if (answer === solution) {
      alert('Correct!');
      score.increaseScore();
      setTimeLeft(30);
      fetchQuestionAndSolution();
      saveScoreToDatabase(score + 1);
    } else {
      alert('Wrong!');
      setLives(prevLives => prevLives - 1);

      if (lives - 1 === 0) {
        setShowLoseModal(true); // Show losing modal
      }
    }
  };

  return (
    
    <div className="bg-red-200 min-h-screen">
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
      
      <div className="flex justify-center mt-8">
  <div className="p-4 flex flex-col justify-between items-center text-2xl font-bold text-gray-800 bg-white bg-opacity-80 rounded-md">
    <div> Time Left: {timeLeft} s </div>
  </div>
</div>


      {showModal && (
       <div className="fixed top-0 left-0 right-0 bottom-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
         <div className="bg-white rounded-lg shadow-xl p-6 flex flex-col items-center">
          <h2 className="text-3xl font-bold mb-4 ">🍅<span className='gradient-text'>Game Over!</span>🍅</h2>
        <p className="text-lg mb-4 font-bold">Your time is up!</p>
      <button onClick={closeModal} className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 focus:outline-none focus:bg-blue-600">
        Restart </button>
         </div>
       </div>
        )}
        {showLoseModal && (
        <div className="fixed top-0 left-0 right-0 bottom-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 flex flex-col items-center">
            <h2 className="text-3xl font-bold mb-4 ">🍅<span className='gradient-text'>Game Over!</span>🍅</h2>
            <p className="text-lg mb-4 font-bold">You ran out of lives!</p>
            <button onClick={closeModal} className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 focus:outline-none focus:bg-blue-600">
              Restart
            </button>
          </div>
        </div>
      )}
      <div className="flex justify-center items-center h-full mt-8">
         <img src={question} alt="Question?" style={{ border: '5px solid black' }} />
      </div>
      
      <div className="p-4 flex flex-col justify-between items-center text-2xl font-bold text-gray-800">
      
        <div className="flex mb-4"> Lives Left: 
          {[...Array(3)].map((_, index) => (
            index < lives && <span key={index} role="img" aria-label="Heart"> ❤️</span>
          ))}
        </div>
        <div className="p-4 flex flex-col justify-between items-center text-2xl font-bold text-gray-800 bg-white bg-opacity-80 rounded-md"> Score: {score.getScore()} </div>
      </div>
      
      <div className="flex justify-center mt-4">
            <img
              src={zeroImage}
              alt="Number 0"
              onClick={() => handleAnswerClick(0)}
              className="w-20 h-20 m-2 cursor-pointer"
            />
            <img
              src={oneImage}
              alt="Number 1"
              onClick={() => handleAnswerClick(1)}
              className="w-20 h-20 m-2 cursor-pointer"
            /><img
            src={twoImage}
            alt="Number 2"
            onClick={() => handleAnswerClick(2)}
            className="w-20 h-20 m-2 cursor-pointer"
          /><img
              src={threeImage}
              alt="Number 3"
              onClick={() => handleAnswerClick(3)}
              className="w-20 h-20 m-2 cursor-pointer"
            />
            <img
              src={fourImage}
              alt="Number 4"
              onClick={() => handleAnswerClick(4)}
              className="w-20 h-20 m-2 cursor-pointer"
            />
            <img
              src={fiveImage}
              alt="Number 5"
              onClick={() => handleAnswerClick(5)}
              className="w-20 h-20 m-2 cursor-pointer"
            />
            <img
              src={sixImage}
              alt="Number 6"
              onClick={() => handleAnswerClick(6)}
              className="w-20 h-20 m-2 cursor-pointer"
            />
            <img
              src={sevenImage}
              alt="Number 7"
              onClick={() => handleAnswerClick(7)}
              className="w-20 h-20 m-2 cursor-pointer"
            />
            <img
              src={eightImage}
              alt="Number 8"
              onClick={() => handleAnswerClick(8)}
              className="w-20 h-20 m-2 cursor-pointer"
            />
            <img
              src={nineImage}
              alt="Number 9"
              onClick={() => handleAnswerClick(9)}
              className="w-20 h-20 m-2 cursor-pointer"
            />
        </div>
    </div>
  );
};

export default Gamepage;
