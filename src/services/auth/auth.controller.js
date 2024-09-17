import { User } from "../../database/schema/user.schema.js";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const signinkey = 'eis';
const expiryMinutes = 300;

const createUserHandler = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).send({ STATUS: 'failed', data: 'Incomplete Data' })
  }
  const userData = await User.findOne({ username })
  if (userData && userData._id) {
    return res.status(400).send({ STATUS: 'failed', data: 'User already exists' })
  }
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds)
  const result = await User.create({ username, password: hashedPassword });
  if (result._id) {
    res.status(200).send({ STATUS: 'OK', data: 'Account created successfully' })
  } else {
    res.status(401).send({ STATUS: 'failed', data: 'failed to create account' })
  }
}
const loginHandler = async (req, res) => {
  try {
    const username = req.body.username;
    const password = req.body.password;
    if (username && password) {
      const result = await User.findOne({username});
      if (result && result._id) {
        const decryptedPassword = await bcrypt.compare(password, result.password)
        if (decryptedPassword) {
          const token = jwt.sign({ userID: result._id,role:result.role }, signinkey, { expiresIn: expiryMinutes * 60 })
          res.status(200).send({ STATUS: 'OK', data: { token, userID: result._id, username: result.username,role:result.role } })
        } else {
          res.status(401).send({ STATUS: 'failed', data: 'Invalid Credentials' })
        }
      } else {
        res.status(401).send({ STATUS: 'failed', data: 'User not Found' })
      }
    } else {
      res.status(400).send({ STATUS: 'failed', data: 'username and password required' })
    }
  } catch (error) {
    return res.status(500).send({ STATUS: 'failed', data: `Error while logging in: ${error}` })
  }
}

const validateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    return res.send({ STATUS: 'failed', data: 'header not found' })
  }
  const token = authHeader?.split(" ")[1];
  jwt.verify(token, signinkey, expiryMinutes * 60, (err, payload) => {
    if (err) {
      res.send({ STATUS: "failed", data: 'authentication failed' })
    }
    req.user = {
      userID: payload.userID,
      role:payload.role
    }
  })
  next()
}

const getUserByLoggedInUserId = async (req, res) => {
  const userId = req.user.userID
  if (userId) {
    const result = await User.findById({_id:userId});
    if (result) {
      res.send({
        STATUS: 'OK', data: {
          _id: result._id,
          username: result.username,
          role: result.role
        }
      })
    } else {
      res.status(404).send({ STATUS: 'failed', data: 'user not found' })
    }
  } else {
    res.status(400).send({ STATUS: 'failed', data: 'bad request' });
  }
}

export const AuthController = {
  createUserHandler,
  loginHandler,
  validateToken,
  getUserByLoggedInUserId
}