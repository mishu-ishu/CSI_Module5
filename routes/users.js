const express = require('express')
const router = express.Router()
const User = require('../models/users')

router.get('/', async(req, res) => {
  try{
    const users = await User.find()
    res.json(users)
  } catch(err) {
    res.send('Error' + err)
  }
})

router.get('/:id', async(req, res) => {
  try{
    const users = await User.findById(req.params.id)
    res.json(users)
  } catch(err) {
    res.send('Error' + err)
  }
})

router.post('/', async(req, res) => {
  const user = new User({
    name: req.body.name,
    emailID: req.body.emailID,
    password: req.body.password
  })

  try{
    const u1 = await user.save()
    res.json(u1)
  } catch(err) {
    res.send('Error' + err)
  }
})

router.patch('/:id', async(req, res) => {
  const userId = req.params.id; // Extract userId from URL params
  const { name, emailID, password } = req.body; // Extract fields from req.body

  if (!name && !emailID && !password) {
    return res.status(400).json({ error: 'No valid fields to update' });
  }

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    let updates = {};
    let needsUpdate = false;

    if (name && name !== user.name) {
      updates.name = name;
      needsUpdate = true;
    }
    if (emailID && emailID !== user.emailID) {
      updates.emailID = emailID;
      needsUpdate = true;
    }
    if (password && !(await bcrypt.compare(password, user.password))) {
      updates.password = await bcrypt.hash(password, 10);
      needsUpdate = true;
    }

    if (!needsUpdate) {
      return res.status(200).json({ message: 'No changes detected, user data remains the same' });
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updates, { new: true });
    res.json({ message: 'User updated successfully', user: updatedUser });
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while updating the user' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id); // Use findByIdAndDelete to delete the user
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ message: 'User removed successfully' });
  } catch (err) {
    res.status(500).json({ error: 'An error occurred while deleting the user' });
  }
});

module.exports = router