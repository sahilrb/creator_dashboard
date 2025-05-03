import { Router } from 'express';
import UserData from '../models/UserData.js'; // Import the User model

const router = Router();

// Fetch all users
router.get('/', async (req, res) => {
    try {
      const users = await UserData.find(); // Fetch all users
      res.json(users);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

// Fetch a single user by username
router.get('/:username', async (req, res) => {
    try {
      const user = await UserData.findOne({ username: req.params.username }); // Fetch user by username
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.json(user);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

// Update user data
router.put('/update/:username', async (req, res) => {
    const { credits, role, savedPosts } = req.body;
  
    try {
      const user = await UserData.findOneAndUpdate(
        { username: req.params.username },
        { $set: { credits, role, savedPosts } },
        { new: true } // Return the updated document
      );
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      res.json({ message: 'User updated successfully', user });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

export default router;