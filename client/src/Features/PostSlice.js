import { createSlice , createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios"

const initialState = {
    status: null,
    posts: [],
    Comment: [],
    likes:[],
}

export const savePost = createAsyncThunk(
    "posts/savePost",
    async(postData)=>{
        try{
            const  response = await axios.post(`${process.env.REACT_APP_SERVER_URL}/savePost` ,
                {
                    postMsg : postData.postMsg,
                    email : postData.email,
                }
            )
            const post = response.data.post
            return { post }  //Return the new post to Redux
        }catch(error){
            console.log(error)
        }
        
    })

export const getPosts = createAsyncThunk("posts/getPosts", async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_SERVER_URL}/getPosts`);
      return response.data.posts
    } catch (error) {
      console.log(error);
    }
  });


export const likePost = createAsyncThunk("posts/likePost" , async (postData)=>{
  try{
     const { postId , userId } = postData
     const response = await axios.put(`${process.env.REACT_APP_SERVER_URL}/likePost` ,
      { postId, userId }
     )
     
     const post = response.data.post  

     return { post }
  }catch(error){
    console.log(error)
  }
})

const postSlice = createSlice({
    name: "posts",
    initialState: initialState,
    reducers:{},
    extraReducers:(builder) =>{
       builder
       .addCase(savePost.pending,(state)=> {
        state.status = "loading"
       })
       .addCase(savePost.fulfilled, (state ,action)=>{
        console.log(action.payload.post)
        state.status = "success"
        state.posts.unshift(action.payload.post)
       })
       .addCase(savePost.rejected, (state)=> {
        state.status = "failed"
       })

       //get posts
       .addCase(getPosts.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getPosts.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.posts = action.payload;
      })
      .addCase(getPosts.rejected, (state) => {
        state.status = "failed";
      })

      //likepost 
      .addCase(likePost.pending, (state) => {
        state.status = "loading";
      })
      .addCase(likePost.fulfilled, (state, action) => {
        state.status = "succeeded";

        const updatedPostIndex = state.posts.findIndex(
          (post) => post._id === action.payload.post._id   
        );

        if (updatedPostIndex !== -1) {
          state.posts[updatedPostIndex].likes = action.payload.post.likes;   
        }
      })
      .addCase(likePost.rejected, (state) => {
        state.status = "failed";
      })
    }
})

export default postSlice.reducer;
