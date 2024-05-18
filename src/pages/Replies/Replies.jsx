import { useContext } from "react";
import { AuthContext } from "../../context/authContext";
import axios from "axios";
import moment from "moment/moment";
import { useQuery } from "@tanstack/react-query";
import "./replies.css";

export const Replies = ({ comment, deleteComment }) => {
  const articleId = comment.articleId;
  const parentId = comment.commentId;

  const { currentUser } = useContext(AuthContext);

  const username = currentUser.username;
  const capitalizedUsername = username[0].toUpperCase() + username.slice(1);

  // 'articleId' and 'parentId' ensure each comment's replies are fetched separately
  const { data } = useQuery(["replies", articleId, parentId], () =>
    axios.get(`https://virtual-vanguard-mmo-f84f119b0dd9.herokuapp.com/comments/${articleId}/${parentId}`).then((res) => {
      const data = res.data.replies;

      return data;
    })
  );

  const handleDelete = (comment) => {
    const id = comment.commentId;
    const userId = currentUser.id;

    deleteComment.mutate({ id, userId });
  };

  const deleteButton = (comment) => {
    const userId = currentUser.id;
    if (userId && userId === comment.userId) {
      return (
        <button onClick={() => handleDelete(comment)} className="delete-reply">
          <i className="bx bx-trash" id="trash-icon"></i>{" "}Delete
        </button>
      );
    }
  };

  return (
    <div className="replies">
      {data &&
        data.map((reply, index) => (
          <div className="reply-container" key={index}>
            <img src={"/upload/" + currentUser.profilePic} alt="Default" className="replies-profile-pic" />
            <div className="reply" key={reply.createdAt}>
              <div className="reply-user-info">
                <p className="reply-username">{capitalizedUsername}</p>
                <span className="reply-date">{moment(reply.createdAt).fromNow()}</span>
              </div>
              <p className="reply-content">{reply.content}</p>
              {currentUser && deleteButton(reply)}
            </div>
          </div>
        ))}
    </div>
  );
};
