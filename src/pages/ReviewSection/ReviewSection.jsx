import { useContext, useState } from "react";
import { AuthContext } from "../../context/authContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Login } from "../Login/Login";
import { Review } from "../Review/Review";
import axios from "axios";
import "./reviewSection.css";

export const ReviewSection = ({ gameId }) => {
  const [content, setContent] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [recommended, setRecommended] = useState(null);

  const onClose = () => setIsOpen(false);
  const recommend = () => setRecommended(true);
  const notRecommended = () => setRecommended(false);

  const { currentUser } = useContext(AuthContext);
  const queryClient = useQueryClient();

  const { data } = useQuery(
    ["reviews"],
    () =>
      axios.get(`http://localhost:8800/reviews/${gameId}`).then((res) => {
        const data = res.data.reviews;
        console.log(data);
        return data;
      }),
    {
      enabled: !!gameId,
    }
  );

  const addReview = useMutation(
    (newReview) => {
      return axios.post("http://localhost:8800/reviews", newReview, {
        withCredentials: true,
      });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["reviews"]);
      },
    }
  );

  const handleClick = () => {
    if (currentUser) {
      const userId = currentUser.id;

      addReview.mutate({ userId, content, gameId, recommended });
      setContent("");
    } else {
      console.log("not logged in");
    }
  };

  const showSendButton = () => {
    const isButtonActive =
      content.length >= 1 &&
      (document.getElementById("no").checked || document.getElementById("yes").checked);

    return (
      <button
        onClick={isButtonActive ? handleClick : undefined}
        className={isButtonActive ? "send-comment" : "send-placeholder"}
      >
        Send
      </button>
    );
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
              placeholder="Write a review"
              value={content}
              onChange={(event) => setContent(event.target.value)}
              className="comment-input"
            />
            <div className="recommend-container">
              <div className="user-recommendation">
                <p>Would you recommend this game?</p>
                <input
                  type="radio"
                  value="yes"
                  onClick={recommend}
                  name="recommend"
                  id="yes"
                  className="radio-button"
                />
                <label>Yes</label>
                <input
                  type="radio"
                  value="no"
                  onClick={notRecommended}
                  name="recommend"
                  id="no"
                  className="radio-button"
                />
                <label>No</label>
              </div>
              {showSendButton()}
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <button className="comment-sign-in-button" onClick={() => setIsOpen(true)}>
          Sign in to leave a review
        </button>
      );
    }
  };

  const recommendedStats = () => {
    const recommendedReviews = data.filter((review) => review.recommended === "true");
    const percentage = (recommendedReviews.length / data.length) * 100;

    return (
      <>
        <div className="recommend-progress-container">
          <p>
            <span className="percentage">{percentage.toFixed(0)}%</span> of reviewers
            recommend this game.
          </p>
          <i className="bx bx-happy-beaming" id="happy"></i>
          <progress
            className="recommend-progress-bar"
            max="100"
            value={percentage}
          ></progress>
          <i className="bx bx-angry" id="mad"></i>
        </div>
      </>
    );
  };

  return (
    <div className="review-section">
      <h2 className="review-header">Reviews</h2>
      {data && recommendedStats()}
      {loginToComment()}
      <Login open={isOpen} onClose={onClose} />
      {data && data.map((review, index) => <Review review={review} key={index} />)}
    </div>
  );
};
