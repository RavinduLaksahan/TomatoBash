import { Link } from 'react-router-dom';
import instruct from "../assets/instruct.png";
import { FaArrowDownLong } from "react-icons/fa6";
import { FaArrowRight } from "react-icons/fa";

const Instructions = () => {

  

  return (
    <div className="flex items-center justify-center min-h-screen"
      style={{
        backgroundImage: `url(${instruct})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}>
      <div className="bg-gray-900 bg-opacity-50 p-8 rounded-lg shadow-lg">
        <h1 className="text-5xl font-bold mb-6 text-center text-white " >🍅<span className="gradient-text"> Welcome to Tomato Bash! </span>🍅</h1>
        
        <div className="bg-white bg-opacity-50 p-6 rounded-lg">
          <h2 className="text-3xl font-bold mb-4 text-gray-800 flex justify-center"><FaArrowDownLong className="mr-2"/> Instructions <FaArrowDownLong className="ml-2" /></h2>
          <ol className=" pl-6 text-lg text-gray-900 font-bold">
          <li className="mb-4">🔢 The game includes mathematical equations.</li>
            <li className="mb-4 ">🍅 Tomatoes in the equations represent missing numbers.</li>
            <li className="mb-4">👆 You must select the correct answer by choosing the numbered tomatoes from 1 to 10.</li>
            <li className="mb-4">⏳  You have a limited time of 30 seconds to solve each equation.</li>
            <li className="mb-4">❤ You start the game with 3 lives.</li>
            <li className="mb-4 ">💔 Choosing the wrong answer will result in losing a life. </li>
            <li className="mb-4">❌ The game ends if you lose all 3 lives or run out of time. </li>
          </ol>
          <div className="flex justify-center mt-8">
          <Link to="/gamepage" className="bg-orange-800 hover:bg-orange-600 text-white py-3 px-6 rounded-md flex items-center justify-center text-xl font-semibold transition-colors duration-300 shadow-md">
            Play Game <FaArrowRight className="ml-2" />
          </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Instructions;
