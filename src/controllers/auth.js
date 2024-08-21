import { registerUser } from "../services/auth.js";

export const registerUserController = async (req, res) => {
    const user = {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    };
    
    await registerUser(user);

    res.status(201).json({
        status:201,
        message: 'Successfully registed a user',
        data: user
    });
};
