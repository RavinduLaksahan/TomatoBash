require("dotenv").config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const User = require('./models/users');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const secretToken = process.env.TOKEN

const app = express();

app.use(express.json());
app.use(cors({
  origin: ["http://localhost:5173"],
  credentials: true
}));
app.use(cookieParser());


// Connect to MongoDB Atlas
mongoose.connect('mongodb+srv://ravindu:ravindu00@tomato-mern.ijbwruj.mongodb.net/?retryWrites=true&w=majority&appName=Tomato-MERN', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Sign-up route
app.post('/api/signup', async (req, res) => {
  const {name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Please provide name, email and password.' });
  }

  try {
    // Hash the password before saving it to the database
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      score:0
    });

    await newUser.save();

    res.status(201).json({ message: 'User created successfully!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

// Sign-in route
app.post('/api/signin', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Please provide both email and password.' });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials. User not found.' });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid credentials. Password is incorrect.' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id:user._id, email },
      secretToken, 
      {
        expiresIn: '2h'
      }
    );

    user.token = token;

    res.status(200).json({
      success: true,
      token,
      user
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error.' });
  }
}); 

// Route to save the score
app.post('/api/save-score', async (req, res) => {
  const { score } = req.body;

 
  const token = req.headers.authorization;
  
  try {
    
    const decodedToken = jwt.verify(token, secretToken);
    const userId = decodedToken.id;

   
    const user = await User.findById(userId);

    
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    
    user.score = score;

    
    await user.save();

    
    res.status(200).json({ message: 'Score saved successfully!' });
  } catch (error) {
    console.error(error);
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token has expired.' });
    }
    
    res.status(500).json({ message: 'Internal server error.' });
  }
});

// Fetch current score API endpoint
app.get('/api/current-score', async (req, res) => {
  const token = req.headers.authorization;
  
  try {
    const decodedToken = jwt.verify(token, secretToken);
    const userId = decodedToken.id;
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
    
    const score = user.score;
    res.status(200).json({ score: score });
  } catch (error) {
    console.error(error);
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token has expired.' });
    }
    
    res.status(500).json({ message: 'Internal server error.' });
  }
});

// Define a route to fetch all scores
app.get('/api/all-scores', async (req, res) => {
  try {
    // Fetch all scores from the database
    const scores = await User.find({}, { _id: 0, name: 1, score: 1 }).sort({ score: -1 }); // Include username and score fields, sort scores in descending order
    if (!scores) {
      return res.status(404).json({ message: 'Scores not found.' });
    }
    res.json(scores); // Send scores array directly without wrapping it in an object
  } catch (error) {
    console.error('Error fetching scores:', error);
    res.sendStatus(500);
  }
});

app.get('/api/user-data', async (req, res) => {
  const token = req.headers.authorization;
  
  try {
    const decodedToken = jwt.verify(token, secretToken);
    const userId = decodedToken.id;
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
    
    // Extract user data
    const userData = {
      name: user.name,
      email: user.email,
      score: user.score
    };
    
    res.status(200).json(userData);
  } catch (error) {
    console.error(error);
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token has expired.' });
    }
    
    res.status(500).json({ message: 'Internal server error.' });
  }
});
app.post('/api/validate-password', async (req, res) => {
  const { oldPassword } = req.body;
  const token = req.headers.authorization;

  try {
    const decodedToken = jwt.verify(token, secretToken);
    const userId = decodedToken.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const isValidPassword = await bcrypt.compare(oldPassword, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Old password is incorrect.' });
    }

    res.status(200).json({ message: 'Old password is correct.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

// Route to update password
app.post('/api/update-password', async (req, res) => {
  const { newPassword } = req.body;
  const token = req.headers.authorization;

  try {
    const decodedToken = jwt.verify(token, secretToken);
    const userId = decodedToken.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Hash the new password before saving it to the database
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: 'Password updated successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});
app.delete('/api/delete-account', async (req, res) => {
  const token = req.headers.authorization;

  try {
    // Verify the token to get the user's ID
    const decodedToken = jwt.verify(token, secretToken);
    const userId = decodedToken.id;

    // Find the user by ID
    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Respond with success message
    return res.status(200).json({ message: 'Account deleted successfully.' });
  } catch (error) {
    console.error('Error deleting account:', error);
    return res.status(500).json({ message: 'Internal server error.' });
  }
});



const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
