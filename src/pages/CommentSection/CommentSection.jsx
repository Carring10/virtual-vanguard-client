import { useContext, useState } from "react";
import { AuthContext } from "../../context/authContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Login } from "../Login/Login";
import axios from "axios";
import { Comment } from "../Comment/Comment";
import "./commentSection.css";

export const CommentSection = ({ articleId }) => {
  const [content, setContent] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const onClose = () => setIsOpen(false);

  const { currentUser } = useContext(AuthContext);
  const queryClient = useQueryClient();

  const { data } = useQuery(["comments"], () =>
    axios.get(`http://localhost:8800/comments/${articleId}`).then((res) => {
      const data = res.data.comments;
      return data;
    })
  );

  // Mutation used to make changes to the server, provide data as 'newComment'
  const addComment = useMutation(
    (newComment) => {
      return axios.post("http://localhost:8800/comments", newComment, {
        withCredentials: true,
      });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["comments"]);
      },
    }
  );

  const handleClick = async (event) => {
    event.preventDefault();
    if (currentUser) {
      const userId = currentUser.id;

      addComment.mutate({ userId, content, articleId });
      setContent("");
    } else {
      console.log("not logged in");
    }
  };

  const showSendButton = () => {
    if (content.length >= 1) {
      return (
        <button onClick={handleClick} className="send-comment">
          Send
        </button>
      );
    } else {
      return <button className="send-placeholder">Send</button>;
    }
  };

  const loginToComment = () => {
    if (currentUser) {
      const username = currentUser.username;
      const capitalizedUsername = username[0].toUpperCase() + username.slice(1);

      return (
        <div className="writeComment">
          <p className="comment-username">{currentUser && capitalizedUsername}</p>

          <div className="input-send-container">
            <textarea
              type="text"
              placeholder="Write a comment"
              value={content}
              onChange={(event) => setContent(event.target.value)}
              className="comment-input"
            />
            {showSendButton()}
          </div>
        </div>
      );
    } else {
      return (
        <button className="comment-sign-in-button" onClick={() => setIsOpen(true)}>
          Sign in to comment
        </button>
      );
    }
  };

  return (
    <div className="comment-section">
      {loginToComment()}
      <Login open={isOpen} onClose={onClose} />
      {data && data.map((comment, index) => <Comment comment={comment} key={index} />)}
    </div>
  );
};
