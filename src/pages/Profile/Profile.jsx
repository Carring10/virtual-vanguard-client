import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../context/authContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Navbar } from "../Navbar/Navbar";
import { Link } from "react-router-dom";
import defaultPic from "../../images/default-pic.jpg";
import "./profile.css";

export const Profile = () => {
  const [file, setFile] = useState(null);
  const { currentUser, setCurrentUser } = useContext(AuthContext);
  const queryClient = useQueryClient();

  const username = currentUser.username;

  const genreColors = {
    MMORPG: "#FF5733",
    Shooter: "#3399FF",
    Strategy: "#9933FF",
    MOBA: "#33CC33",
    Racing: "#FFCC33",
    Sports: "#FF3366",
    Survival: "#66CCFF",
    MMO: "#660066",
    MMOFPS: "#FF9933",
    MMOTPS: "#CC0033",
    MMORTS: "#9966FF",
    "Card Game": "#ff66d9",
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`https://virtual-vanguard-mmo-f84f119b0dd9.herokuapp.com/users/get/${username}`);
        setCurrentUser(response.data[0]);
      } catch (err) {
        console.log(err);
      }
    };
    fetchUser();
  }, [setCurrentUser, username]);

  const { data } = useQuery(["games"], () =>
    axios.get(`https://virtual-vanguard-mmo-f84f119b0dd9.herokuapp.com/games/getGames/${username}`).then((res) => {
      const data = res.data.games;
      return data;
    })
  );

  const placeholderImg = () => {
    if (currentUser.profilePic === null) {
      return <img src={defaultPic} alt="Default" className="profile-pic" />;
    } else {
      return (
        <img
          src={"/upload/" + currentUser.profilePic}
          alt="Default"
          className="profile-pic"
        />
      );
    }
  };

  const upload = async (file) => {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await axios.post("https://virtual-vanguard-mmo-f84f119b0dd9.herokuapp.com/upload", formData);
      return res.data;
    } catch (err) {
      console.log(err);
    }
  };

  const updatePic = useMutation(
    (newPic) => {
      console.log(newPic);
      return axios.put("https://virtual-vanguard-mmo-f84f119b0dd9.herokuapp.com/users/updatePic", newPic);
    },
    {
      onSuccess: () => {
        // Invalidate and refetch
        queryClient.invalidateQueries(["users"]);
      },
    }
  );

  const handleClick = async (event) => {
    event.preventDefault();
    let profileUrl;

    profileUrl = await upload(file);

    if (file) {
      updatePic.mutate({ username, profilePic: profileUrl });
      console.log(updatePic);
      console.log(username, profileUrl);
      // setCurrentUser();
      // window.location.reload();
    }
  };

  const confirmFile = () => {
    if (file) {
      return (
        <div className="save-btn-container">
          <p className="file-name">{file.name} selected</p>
          <button className="save-btn" onClick={handleClick}>
            UPDATE
          </button>
        </div>
      );
    }
  };

  const deleteGame = useMutation(
    (deletedData) => {
      console.log("deletedData", deletedData);
      return axios.delete("https://virtual-vanguard-mmo-f84f119b0dd9.herokuapp.com/games/delete", { data: deletedData });
    },
    {
      onSuccess: () => {
        // Invalidate and refetch
        queryClient.invalidateQueries(["games"]);
      },
    }
  );

  const handleDelete = (event, game) => {
    event.preventDefault();

    const user = currentUser.username;
    const apiId = game.apiId;

    deleteGame.mutate({ user, apiId });
  };

  return (
    <>
    <Navbar />
      <div className="profile-container">
        <h1 className="profile-header">Profile</h1>
        <div className="profile-contents">
          <p className="profile-username">{username && username[0].toUpperCase() + username.slice(1)}</p>
          <div className="profile-pic-container">
            {placeholderImg()}
            <label className="overlay">
              <input
                type="file"
                id="profile"
                style={{ display: "none" }}
                onChange={(e) => setFile(e.target.files[0])}
              />
            </label>
          </div>
          {confirmFile()}
        </div>
        <h4 className="saved-games-header">Your saved games</h4>
        <div className="saved-games-container">
          {data &&
            data.map((game) => (
              <div className="profile-game-container" key={game.gameId}>
                <div
                  className="delete-game"
                  onClick={(event) => handleDelete(event, game)}
                >
                  <i className="bx bx-trash" id="trash"></i>
                </div>
                <img
                  src={game.gameImg}
                  alt="Game thumbnail"
                  className="profile-game-img"
                />
                <div className="profile-game-info">
                  <p className="profile-game-title">{game.gameTitle}</p>
                  <div>
                    <p
                      className="profile-game-genre"
                      style={{ backgroundColor: genreColors[game.gameGenre] }}
                    >
                      {game.gameGenre}
                    </p>
                  </div>
                </div>
                <Link to={game.gameUrl} target="_blank" className="profile-play-button">
                  Play Now
                </Link>
              </div>
            ))}
        </div>
      </div>
    </>
  );
};
