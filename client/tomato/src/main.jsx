import React, { useContext } from "react";
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import PageWelcome from './components/PageWelcome';
import Signin from './components/Signin';
import Signup from './components/Signup';
import Instructions from './components/Instructions';
import Gamepage from './components/Gamepage';
import Leaderboard from './components/Leaderboard';
import { AuthContext, AuthProvider } from "./context/PrivateRoute.context.jsx";
import Profile from './components/Profile';
import { BrowserRouter as Router, Routes, Route , Navigate} from "react-router-dom";
import PropTypes from "prop-types";



const ProtectedRoute = ({ element }) => {
  const { user } = useContext(AuthContext);
  const isAuthenticated = !!user; // Check if user is authenticated

  if (!isAuthenticated && window.location.pathname !== "/signin") {
    // Redirect to sign-in page if not authenticated and not already on the sign-in page
    return <Navigate to="/signin" />;
  }

  return element;
};

ProtectedRoute.propTypes = {
  element: PropTypes.element.isRequired,
};

const routes = (
  <Routes>
    <Route path="/" element={<App />}>
      <Route path="/" element={<PageWelcome />} />
      <Route path="/signin" element={<Signin />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/instructions" element={<Instructions />} />
      <Route path="/gamepage" element={<ProtectedRoute element={<Gamepage />} />} />
      <Route
        path="/profile"
        element={<ProtectedRoute element={<Profile />} />}
      />
      <Route
        path="/leaderboard"
        element={<ProtectedRoute element={<Leaderboard />} />}
      />
      {/* <Route path="/guest" element={<GuestPage />} /> */}
    </Route>
  </Routes>
);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <AuthProvider>
      <Router>{routes}</Router>
    </AuthProvider>
  </React.StrictMode>
);

