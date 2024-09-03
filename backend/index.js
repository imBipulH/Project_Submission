const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const config = require('./config.json')
const Links = require('./models/links')
const jwt = require('jsonwebtoken')
const { authenticateToken } = require('./utilities')
const User = require('./models/user')

mongoose
  .connect(config.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))

const app = express()
app.use(express.json())
app.use(cors())

app.get('/', (req, res) => {
  const name = req.query.name || 'World'
  res.send(`Hello, ${name}!`)
})

// Register
app.post('/register', async (req, res) => {
  const { fullName, email, password } = req.body
  if (!fullName) {
    return res.status(400).json({ error: 'Fullname is required' })
  }
  if (!email) {
    return res.status(400).json({ error: 'Email is required' })
  }
  if (!password) {
    return res.status(400).json({ error: 'Password is required' })
  }

  const isUser = await User.findOne({ email })

  if (isUser) {
    return res.status(400).json({ error: 'Email is already exists' })
  }

  const user = new User({ fullName, email, password })
  await user.save()

  const accessToken = jwt.sign({ user }, 'secret-superstart', {
    expiresIn: '3600m'
  })

  return res.json({
    error: false,
    user,
    accessToken,
    message: 'User registered successfully'
  })
})

// Login
app.post('/login', async (req, res) => {
  const { email, password } = req.body

  if (!email) {
    return res.status(400).json({ error: 'Email is required' })
  }
  if (!password) {
    return res.status(400).json({ error: 'Password is required' })
  }

  const userInfo = await User.findOne({ email: email })

  if (!userInfo) {
    return res.status(400).json({ error: 'User not found' })
  }
  if (userInfo.password !== password) {
    return res.status(400).json({ error: 'Incorrect password' })
  }

  if (userInfo.email == email && userInfo.password == password) {
    const user = { user: userInfo }
    const accessToken = jwt.sign(user, 'secret-superstar', {
      expiresIn: '3600m'
    })

    res.json({
      error: false,
      user,
      accessToken,
      message: 'User logged in successfully'
    })
  } else {
    return res.status(401).json({ error: 'Invalid credentials' })
  }
})

// Get User
app.get('/get-user', authenticateToken, async (req, res) => {
  const { user } = req.user
  const isUser = await User.findOne({ _id: user._id })
  if (!isUser) return res.status(404).json({ error: 'User not found' })
  return res.json({
    user: {
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      createdOn: user.createdOn
    }
  })
})

// Get All Projects
app.get('/project-links', authenticateToken, async (req, res) => {
  try {
    const links = await Links.find({}).populate('user')
    res.json(links)
  } catch (error) {
    return res
      .status(400)
      .json({ message: 'Internal Server Error', error: error })
  }
})

// Upload Project
app.post('/upload-links', authenticateToken, async (req, res) => {
  const { githubLink, previewLink } = req.body
  const { user } = req.user
  if (!githubLink) {
    return res.status(400).json({ error: 'GitHub link is required' })
  }
  if (!previewLink) {
    return res.status(400).json({ error: 'Preview link is required' })
  }
  try {
    const links = new Links({
      user: user._id,
      githubLink,
      previewLink
    })
    await links.save()
    return res.json({
      error: false,
      links,
      message: 'Links uploaded successfully'
    })
  } catch (error) {
    return res
      .status(400)
      .json({ message: 'Internal Server Error', error: error })
  }
})

// Delte Project
app.delete('/delete/:linkid', authenticateToken, async (req, res) => {
  const { linkid } = req.params
  const { user } = req.user

  try {
    const link = await Links.findOne({ _id: linkid })

    if (user._id == link.user._id) {
      await Links.findByIdAndDelete(link)
      return res.json({
        error: false,
        message: 'Link deleted successfully'
      })
    }

    // if (!link) {
    //   return res.status(400).json({ message: 'Link not found' })
    // }
    // Delete the link from the database
    // await link.remove()
  } catch (error) {
    return res
      .status(400)
      .json({ message: 'Internal Server Error', error: error })
  }
})

app.listen('7000', () => {
  console.log('Server is running on port 7000')
})
