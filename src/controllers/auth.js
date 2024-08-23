import { loginUser, registerUser } from "../services/auth.js";

export const registerUserController = async (req, res) => {
    const user = {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    };
    
    const registeredUser = await registerUser(user);

    res.status(201).json({
        status:201,
        message: 'Successfully registed a user',
        data: registeredUser
    });
};

export const loginUserController = async (req, res)=>{
const {email, password} = req.body;

await loginUser(email, password);
};