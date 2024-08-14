import express from 'express';
import { signup, login, logout, getUserDetails } from '../controller/auth.controller.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', logout);
router.get('/:userId', getUserDetails);

export default router;
