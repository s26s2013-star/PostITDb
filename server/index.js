import express  from "express";
import mongoose from "mongoose";
import cors from "cors";
import UserModel from "./Models/UserModel.js";
import bcrypt from "bcrypt";
import PostModel from "./Models/PostModel.js";
import dotenv from "dotenv"
dotenv.config()
const app = express();
app.use(express.json());
app.use(cors());
// Database Connection
const conSt = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@postitcluster.lp3s7i6.mongodb.net/${process.env.DB_NAME}?appName=PostITCluster`;
mongoose.connect(conSt)
// register Route
app.post("/registerUser", async (req , res) => {
    try{
     const name = req.body.name
     const email = req.body.email 
     const password = req.body.password
     const pwdhash = await bcrypt.hash(password,10)

     const user = new UserModel({name :name  , email: email , password : pwdhash})
     await user.save()
     res.send({user:user , msg: "Added"})
    }catch(error){
      res.status(500).json({error : "An error occurred"})
    }
   } )

app.listen(process.env.PORT, () => {
    console.log("You are connected")
})
// Login Route
app.post("/login",async(req , res) =>{
  try{
    const {email , password} = req.body
    const user = await UserModel.findOne({email :email})
    //user not fount 
    if(!user){
      res.status(401).send({msg:"Invalid email !"})
    }else{
      const passMatch = await bcrypt.compare(password , user.password)
      // password does not match
      if(!passMatch){
        res.status(401).send({msg:"Invalid password !"})
      }else{
        res.status(200).send({user:user , msg:"Authentication is successfull"})
    }}
  }catch(error){
    res.status(500).send({msg:"An unexpected error occurred"})
  }
})

// Logout Route
app.post("/logout", async(req , res)=>{
  res.status(200).send({msg:"Logged out successfully"})
})
//GET API - getPost
app.get("/getPosts", async (req, res) => {
    try {
      // Fetch all posts from the "PostModel" collection, sorted by createdAt in descending order
      const posts = await PostModel.find({}).sort({ createdAt: -1 });
  
      const countPost = await PostModel.countDocuments({});
  
      res.send({ posts: posts, count: countPost });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "An error occurred" });
    }
  });
 //POST API - savePost
app.post("/savePost", async (req, res) => {
    try {
      const postMsg = req.body.postMsg;
      const email = req.body.email;
  
      const post = new PostModel({
        postMsg: postMsg,
        email: email,
      });
  
      await post.save();
      res.send({ post: post, msg: "Added." });
    } catch (error) {
      res.status(500).json({ error: "An error occurred" });
    }
  });
  //PUT API - likePost
app.put("/likePost", async (req, res) => {
    const {postId,userId} = req.body;
      try {
      //search the postId if it exists
      const postToUpdate = await PostModel.findOne({ _id: postId });
      if (!postToUpdate) {
        return res.status(404).json({ msg: "Post not found." });
      }
      //Search the user Id from the array of users who liked the post.
      const userIndex = postToUpdate.likes.users.indexOf(userId);
      //indexOf method returns the index of the first occurrence of a specified value in an array.
      //If the value is not found, it returns -1.
      //This code will toogle from like to unlike
      if (userIndex !== -1) {
        // User has already liked the post, so unlike it
        const udpatedPost = await PostModel.findOneAndUpdate(
          { _id: postId },
          {
            $inc: { "likes.count": -1 }, // Decrement the like count $inc and $pull are update operators
            $pull: { "likes.users": userId }, // Remove userId from the users array
          },
          { new: true } // Return the modified document
        );
          res.send({ post: udpatedPost, msg: "Post unliked." });
      } else {
        // User hasn't liked the post, so like it
        const updatedPost = await PostModel.findOneAndUpdate(
          { _id: postId },
          {
            $inc: { "likes.count": 1 }, // Increment the like count
            $addToSet: { "likes.users": userId }, // Add userId to the users array if not already present
          },
          { new: true } // Return the modified document
        );
          res.send({ post: updatedPost, msg: "Post liked." });
      }
    } catch (error) {
      console.error(error);
      res.status(500).send({ msg: "An error occurred" });
    }
  });


