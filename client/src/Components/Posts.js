import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { getPosts } from "../Features/PostSlice";
import { useNavigate } from "react-router-dom";
import { FaThumbsUp } from "react-icons/fa6";
import { likePost } from "../Features/PostSlice";
import moment from "moment";


const Posts = () => {
  const { posts } = useSelector((state) => state.posts);
  const { user } = useSelector((state) => state.users)
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Load posts ONCE
  useEffect(() => {
    dispatch(getPosts());
  }, [dispatch]);

  const handleLikePost = (postId) => {
    const userId = user._id;
    dispatch(likePost({ postId, userId }));
  };

  return (
    <div className="postsContainer">
      <table className="table table-striped">
        <tbody>
          {posts?.map((post) => (
            <tr key={post._id}>
              <td>{post.email}</td>
              
              <td>
                <p>{moment(post.createdAt).fromNow()}</p>
                {post.postMsg}
                <p className="likes">
                  <a href="#" onClick={() => handleLikePost(post._id)}>
                    <FaThumbsUp />
                  </a>
                  ({post.likes?.count || 0})
                </p>
              </td>
              <td>{post.createdAt}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <h1>Display Posts</h1>
    </div>
  );
};


export default Posts;
