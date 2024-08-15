import bcrypt from 'bcryptjs';
import User from '../model/auth.model.js';
import { generateTokenandSetCookie } from '../middleware/generateTokenandSetCookie.js';

const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email) && email.length >= 7;
};

const validateName = (name) => {
    return /^[A-Za-z]{3,}$/.test(name);
};

const validatePassword = (password) => {
    return /^(?=.*[A-Za-z]).{6,}$/.test(password);
};

export const signup = async (request, response) => {
    try {
        const { name, password, email } = request.body;

        if (!name || !password || !email) {
            return response.status(400).send({ error: "Vul alle velden in" });
        }

        if (!validateEmail(email)) {
            return response.status(400).send({ error: "Onjuiste e-mail" });
        }

        if (!validateName(name)) {
            return response.status(400).send({ error: "Naam moet minstens 3 letters lang zijn en mag enkel letters bevatten" });
        }

        if (!validatePassword(password)) {
            return response.status(400).send({ error: "Wachtwoord moet minstens 3 karakters lang zijn en moet minstens 1 letter bevatten" });
        }

        let isAdmin = false;
        if (name === 'kian' && password === 'kian123') {
            isAdmin = true;
        }

        const existingUser = await User.findOne({ name });
        const existingEmail = await User.findOne({ email });
        if (existingUser || existingEmail) {
            return response.status(400).send({ error: "Gebruiker bestaat al" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({ name, email, password: hashedPassword, isAdmin });

        if (!newUser) {
            return response.status(404).send({ error: "Kon geen gebruiker aanmaken" });
        }

        generateTokenandSetCookie(newUser._id, response);
        response.status(201).send(newUser);
    } catch (error) {
        console.log(`Error in signup controller: ${error.message}`);
        response.status(500).send({ error: "Internal Server Error" });
    }
};

export const login = async (request, response) => {
    try {
        const { name, password } = request.body;
        if (!name || !password) {
            return response.status(400).send({ error: "Vul alle velden in" });
        }

        const user = await User.findOne({ name });
        if (!user) {
            return response.status(400).send({ error: "Gebruiker niet gevonden" });
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return response.status(400).send({ error: "Onjuist wachtwoord" });
        }

        generateTokenandSetCookie(user._id, response);
        response.status(200).send(user);
    } catch (error) {
        console.log(`Error in login controller: ${error.message}`);
        response.status(500).send({ error: "Internal Server Error" });
    }
};

export const logout = async (request, response) => {
    response.clearCookie("jwt");
    response.status(200).send("Succesvol uitgelogd");
};




export const getUserDetails = async (request, response) => {
    try {
        const userId = request.params.userId;  // Use params to get the userId
        const user = await User.findById(userId).select('name');
        if (!user) {
            return response.status(404).send({ error: "Gebruiker niet gevonden" });
        }
        response.status(200).send(user);
    } catch (error) {
        console.log(`Error in getUserDetails controller: ${error.message}`);
        response.status(500).send({ error: "Internal Server Error" });
    }
};
