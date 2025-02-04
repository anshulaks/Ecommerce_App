import { comparePassword, hashPassword } from "./../helpers/authHelper.js";
import userModel from "../models/userModel.js"
import orderModel from "../models/orderModel.js"
import JWT from "jsonwebtoken";

export const registerController= async(req,res) =>{
    try{
        const {name, email, password, phone, address, answer}=req.body
        //validations
        if(!name){
            return res.send({message:'Name is Required'})
        }
        
        if(!email){
            return res.send({message:'email is Required'})
        }
        
        if(!password){
            return res.send({message:'password is Required'})
        }
        
        if(!phone){
            return res.send({message:'phone is Required'})
        }
        
        if(!address){
            return res.send({message:'Address is Required'})
        }
        if(!answer){
            return res.send({message:'Answer is Required'})
        }

        //existing user

        const existingUser = await userModel.findOne({email})
        if (existingUser){
            return res.status(200).send({
                success:false,
                message:'Already resgister please login'
            })
        }

        //register new User

        const hashedPassword= await hashPassword(password)
        //save
        const user= await new userModel({
            name,
            email,
            phone, 
            address,
            password: hashedPassword,
            answer
            }).save();
       
    
        
        res.status(201).send({
            success:true,
            message:'User registered successfully',
            user
        });
    }
    catch (error){
        console.error("Error during registration:", error); // Logs full error detail
        res.status(500).json({message:"Error registering user"})

    }
};
//POST LOGIN

export const loginController = async (req, res) => {
    try{
        const {email, password} = req.body
        //validation
        if(!email || !password){
            return res.status(404).send({
                success:false,
                message:'Invalid email or password'
            })
    }
    //check user
    const user= await userModel.findOne({email})
    if(!user){
        return res.status(404).json({
            success:false,
            message:'Email not registered'
        })
    }
    const match = await comparePassword(password, user.password)
    if(!match){
        return res.status(200).json({
            success:false,
            message:'Invalid password'
            })
        }



    const token = await JWT.sign({_id:user._id}, process.env.JWT_SECRET,{expiresIn:"7d"})
    res.status(200).send({
    success:true,
    message:'User logged in successfully',
    user:{
        _id:user._id,
        name:user.name,
        email:user.email,
        phone:user.phone,
        address:user.address,
        role:user.role,
        },
        token
        });
        }
    catch (error){
        console.log(error)
        res.status(500).json({
            success:false,
            message:'Error in login',
            error: error.message || error
        })
    }
};


//forgot controller
export const forgotPasswordController = async(req,res) =>{

    try{
        const {email, answer , newPassword} =req.body
        if(!email){
            res.status(400).send({message:'Email is required'})
        }
        if(!answer){
            res.status(400).send({message:'answer is required'})
        }
        if(!newPassword){
            res.status(400).send({message:'new passw is required'})
        }
        //check

        const user=await userModel.findOne({email, answer})
        
        //validation
        if(!user){
            return res.status(404).send({
                success:false,
                message:'User not found',
            })
        }
        const hashed = await hashPassword(newPassword);
        await userModel.findByIdAndUpdate(user._id, {password:hashed})
        res.status(200).send({
            success:true,
            message:'Password change success',
        });
    }
    catch(error){
        console.log(error)
        res.status(500).send({
            success:false,
            message:'something went wrong',
            error
        })

    }

}
// test controller

//test controller
export const testController = (req, res) => {
    try {
      res.send("Protected Routes");
    } catch (error) {
      console.log(error);
      res.send({ error });
    }
  };

//update prfole
export const updateProfileController = async (req, res) => {
    try {
      const { name, email, password, address, phone } = req.body;
      const user = await userModel.findById(req.user._id);
      //password
      if (password && password.length < 6) {
        return res.json({ error: "Passsword is required and 6 character long" });
      }
      const hashedPassword = password ? await hashPassword(password) : undefined;
      const updatedUser = await userModel.findByIdAndUpdate(
        req.user._id,
        {
          name: name || user.name,
          password: hashedPassword || user.password,
          phone: phone || user.phone,
          address: address || user.address,
        },
        { new: true }
      );
      res.status(200).send({
        success: true,
        message: "Profile Updated SUccessfully",
        updatedUser,
      });
    } catch (error) {
      console.log(error);
      res.status(400).send({
        success: false,
        message: "Error WHile Update profile",
        error,
      });
    }
  };

 //orders
 export const getOrdersController = async(req,res) =>{
    try{
        const orders = await orderModel.find({buyer:req.user._id}).populate("products","-photo").populate("buyer","name")
        res.json(orders)
    }
    catch(error){
        res.status(500).send({
            success:false,
            message:'Error while getting orders',
            error
        })
    }
 }
  //all orders
  export const getAllOrdersController = async(req,res) =>{
    try{
        const orders = await orderModel
        .find({})
        .populate("products","-photo")
        .populate("buyer","name")
        .sort("-createdAt"); // Sort by most recent orders (descending)
        console.log("Orders fetched:", orders);

        res.json(orders)
    }
    catch (error) {
        console.error("Error while getting orders:", error); // Log the actual error in the server
        res.status(500).json({
          success: false,
          message: "Error while getting orders",
          error: error.message || error, // Send the error message in the response
        });
      }
 }

 export const orderStatusController = async(req,res) =>{
    try{
        const { orderId } = req.params
        const { status } = req.body
        const orders = await orderModel.findByIdAndUpdate(orderId, {status},{new:true})
        res.json(orders)
    }
    catch(error){
        console.log(error)
        res.status(500).send({
            success:false,
            message:"error while updating order",
            error
        })
    }
 }