import { useContext, useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AuthContext } from "../../context/authContext";
import { useLocation } from "react-router-dom";
import { Navbar } from "../Navbar/Navbar";
import { Popup } from "../Popup/Popup";
import { ReviewSection } from "../ReviewSection/ReviewSection";
import { Link } from "react-router-dom";
import axios from "axios";
import DOMPurify from "dompurify";
import "./game.css";

export const Game = () => {
  const [game, setGame] = useState({
    title: "",
    thumbnail: "",
    developer: "",
    publisher: "",
    release_date: "",
    screenshots: [],
    description: "",
    minimum_system_requirements: [],
  });

  const [userGames, setUserGames] = useState([]);

  const apiId = game.id;
  const gameTitle = game.title;
  const gameImg = game.thumbnail;
  const gameGenre = game.genre;
  const gameUrl = game.game_url;

  const [isPopupVisible, setIsPopupVisible] = useState(false);

  const [bookmark, setBookmark] = useState(true);
  const popupMessage = bookmark ? "Game removed!" : "Game saved!";

  const toggleBookmark = () => setBookmark(false);
  const toggleRemoveBookmark = () => setBookmark(true);

  const { currentUser } = useContext(AuthContext);

  const location = useLocation();
  const gameId = location.state;

  const sanitizedData = () => ({
    __html: DOMPurify.sanitize(game.description),
  });

  useEffect(() => {
    const isGameSaved = () => {
      for (let savedGame = 0; savedGame < userGames.length; savedGame++) {
        const savedGameId = userGames[savedGame].apiId;

        if (savedGameId === game.id) {
          toggleBookmark();
        }
      }
    };
    isGameSaved();
  }, [game.id, userGames]);

  useEffect(() => {
    const api = "https://www.mmobomb.com/api1/game?id=" + gameId;

    const fetchGame = async () => {
      try {
        const response = await axios.get(api);
        setGame(response.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchGame();
  }, [gameId]);

  useEffect(() => {
    if (currentUser) {
      const getUserGames = "https://virtual-vanguard-mmo-f84f119b0dd9.herokuapp.com/games/getGames/" + currentUser.username;

      const fetchUserGames = async () => {
        try {
          const response = await axios.get(getUserGames);
          setUserGames(response.data.games);
        } catch (err) {
          console.log(err);
        }
      };
      fetchUserGames();
    }
  }, [currentUser]);

  const queryClient = useQueryClient();

  const saveGame = useMutation(
    (data) => {
      return axios.post("https://virtual-vanguard-mmo-f84f119b0dd9.herokuapp.com/games", data);
    },
    {
      onSuccess: () => {
        // Invalidate and refetch
        queryClient.invalidateQueries(["games"]);
      },
    }
  );

  const deleteGame = useMutation(
    (deletedData) => {
      console.log("deletedData", deletedData);
      return axios.delete("https://virtual-vanguard-mmo-f84f119b0dd9.herokuapp.com/games/delete", { data: deletedData });
    },
    {
      onSuccess: () => {
        // Invalidate and refetch
        queryClient.invalidateQueries(["game"]);
      },
    }
  );

  const handleSave = (event) => {
    event.preventDefault();
    const user = currentUser.username;

    saveGame.mutate({ user, apiId, gameTitle, gameImg, gameGenre, gameUrl });
    setIsPopupVisible(true);
  };

  const handleDelete = (event) => {
    event.preventDefault();
    const user = currentUser.username;
    const apiId = game.id;

    deleteGame.mutate({ user, apiId });
    setIsPopupVisible(true);
  };

  const saveIcon = () => {
    const iconClass = bookmark ? "bx bx-bookmark-plus" : "bx bx-bookmark-minus";

    return <i className={iconClass} id="bookmark"></i>;
  };

  const buttonText = () => {
    const text = bookmark ? "SAVE TO LIBRARY" : "REMOVE FROM LIBRARY";

    return <span>{text}</span>;
  };

  const clickHandler = bookmark
    ? (event) => {
        handleSave(event);
        toggleBookmark();
      }
    : (event) => {
        handleDelete(event);
        toggleRemoveBookmark();
      };

  const handleClosePopup = () => {
    setTimeout(() => {
      setIsPopupVisible(false);
    }, 500);
  };

  return (
    <>
      <Navbar />
      <Link to="/discover" className="back-button">
        &#8592; Back
      </Link>
      <div className="game-container">
        <div className="game-title-container">
          <h1 className="game-title">{game.title}</h1>
          {isPopupVisible && <Popup message={popupMessage} onClose={handleClosePopup} />}
        </div>
        <div className="game-contents-container">
          <div className="game-info">
            <img src={game.thumbnail} alt="game-thumbnail" className="game-img" />
            <p>Developed by {game.developer}</p>
            <p>Released on {game.release_date}</p>
            <Link to={game.game_url} target="_blank" className="play-button">
              PLAY NOW
            </Link>
          {currentUser && <button onClick={clickHandler} className="save-game-button">{saveIcon()} {buttonText()}</button>}
          </div>
          <div className="game-description">
            <div className="screenshots-container">
              {game.screenshots.slice(0, 4).map((screenshot) => (
                <img
                  src={screenshot.image}
                  alt="game-screenshot"
                  className="game-screenshots"
                  key={screenshot.id}
                />
              ))}
            </div>
            <div dangerouslySetInnerHTML={sanitizedData()} />
            <ReviewSection gameId={apiId} />
          </div>
        </div>
      </div>
    </>
  );
};
