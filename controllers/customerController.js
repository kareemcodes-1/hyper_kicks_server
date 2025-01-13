import expressAsyncHandler from "express-async-handler";
import {Customer} from "../models/Customer.js";
// import User from "../models/User.js";

const getAllCustomers = expressAsyncHandler(async (req, res) => {
    try {
        const customers = await Customer.find();
        res.status(200).json(customers);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});

export {getAllCustomers};