import { useContext, useState } from "react";
import { AuthContext } from "../../context/authContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import "./replyForm.css";

export const ReplyForm = ({ comment, hideReplyForm }) => {
  const [content, setContent] = useState("");

  const { currentUser } = useContext(AuthContext);
  const queryClient = useQueryClient();

  const username = currentUser.username;
  const capitalizedUsername = username[0].toUpperCase() + username.slice(1);

  const showSendButton = () => {
    if (content.length >= 1) {
      return (
        <button onClick={handleClick} className="send-reply">
          Send
        </button>
      );
    } else {
      return <button className="send-reply-placeholder">Send</button>;
    }
  };

  const addReply = useMutation(
    (newComment) => {
      return axios.post("https://virtual-vanguard-mmo-f84f119b0dd9.herokuapp.com/comments", newComment, {
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
      const parentId = comment.commentId;
      const articleId = comment.articleId;

      addReply.mutate({ userId, content, articleId, parentId });
      setContent("");
      hideReplyForm();
    } else {
      console.log("not logged in");
    }
  };

  return (
    <div className="reply-form-container">
      <p className="reply-form-username">{currentUser && capitalizedUsername}</p>
      <div className="write-reply">
        <input
          type="text"
          placeholder="Write a Reply"
          value={content}
          onChange={(event) => setContent(event.target.value)}
          className="reply-input"
        />
        <div className="reply-form-button-container">
          <button onClick={() => hideReplyForm()} className="cancel-reply">
            Cancel
          </button>
          {showSendButton()}
        </div>
      </div>
    </div>
  );
};
