import { useContext, useState } from "react";
import { AuthContext } from "../../context/authContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import moment from "moment/moment";
import { Replies } from "../Replies/Replies";
import { ReplyForm } from "../ReplyForm/ReplyForm";
import "./comment.css";

export const Comment = ({ comment }) => {
  const [showReplies, setShowReplies] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const { currentUser } = useContext(AuthContext);
  const queryClient = useQueryClient();

  const username = comment.username;
  const capitalizedUsername = username[0].toUpperCase() + username.slice(1);

  const showReplyForm = () => setShowForm(true);
  const hideReplyForm = () => setShowForm(false);

  const toggleShowReplies = () => setShowReplies(true);
  const toggleHideReplies = () => setShowReplies(false);

  const deleteComment = useMutation(
    (deletedComment) => {
      return axios.delete(
        `https://virtual-vanguard-mmo-f84f119b0dd9.herokuapp.com/comments/${deletedComment.id}/${deletedComment.userId}`
      );
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["comments"]);
        queryClient.invalidateQueries(["replies"]);
      },
    }
  );

  const handleDelete = (comment) => {
    const id = comment.commentId;
    const userId = currentUser.id;

    deleteComment.mutate({ id, userId });
  };

  const deleteButton = (comment) => {
    const userId = currentUser.id;
    if (userId && userId === comment.userId) {
      return <button onClick={() => handleDelete(comment)} className="delete-button">
        <i className="bx bx-trash" id="trash-icon"></i>{" "}Delete
      </button>;
    }
  };

  const showRepliesButton = (comment) => {
    const replies = JSON.parse(comment.replies);

    if (replies != null) {
      const toggleArrow = function () {
        const toggleArrow = document.getElementById("reply-arrow");
      
        toggleArrow.classList.toggle("reply-arrow");
      };
      const numReplies = replies.length;
      const buttonText =
        numReplies > 1 ? `${numReplies} replies` : `1 reply`;

      const controlClick = showReplies
        ? () => toggleHideReplies()
        : () => toggleShowReplies();

      return (
        <div>
          <button onClick={() => {controlClick(); toggleArrow();}} className="show-replies-button">
          <i className="bx bx-chevron-down" id="reply-arrow"></i>
            {buttonText}
          </button>
        </div>
      );
    }
  };

  const replyButton = (comment) => {
    if (currentUser) {
      return (
        <div className="reply-button-container">
          <button onClick={() => showReplyForm(comment)} className="reply-button">
            <i className="bx bx-reply" id="reply-icon"></i>{" "}Reply
          </button>
        </div>
      );
    }
  };

  return (
    <>
      <div className="comment-container">
        <img
          src={"/upload/" + comment.profilePic}
          alt="Default"
          className="comment-profile-pic"
        />
        <div className="comment" key={comment.createdAt}>
          <div className="user-info">
            <p className="comment-username">{capitalizedUsername}</p>
            <p className="date">{moment(comment.createdAt).fromNow()}</p>
          </div>
          <p className="comment-content">{comment.content}</p>
          <div className="reply-delete-buttons-container">
            {currentUser && replyButton(comment)}
            {currentUser && deleteButton(comment)}
          </div>
          {showRepliesButton(comment)}
          {showForm ? (
            <ReplyForm comment={comment} hideReplyForm={hideReplyForm} />
          ) : null}
          {showReplies ? (
            <Replies comment={comment} deleteComment={deleteComment} />
          ) : null}
        </div>
      </div>
    </>
  );
};
