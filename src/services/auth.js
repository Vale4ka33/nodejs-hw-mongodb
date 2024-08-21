import { UserCollection } from "../db/model/user.js";

export const registerUser = async(userData)=>{
    return await UserCollection.create(userData);
};