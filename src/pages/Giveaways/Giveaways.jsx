import { useState, useEffect } from "react";
import { Navbar } from "../Navbar/Navbar";
import axios from "axios";
import "./giveaways.css";

export const Giveaways = () => {
  const [giveAways, setGiveAways] = useState([]);

  useEffect(() => {
    const fetchGiveAways = async () => {
      try {
        const response = await axios.get("https://www.mmobomb.com/api1/giveaways");
        setGiveAways(response.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchGiveAways();
  }, []);

  return (
    <>
      <Navbar />
      <div className="main-container">
        <div className="giveaway-header-container">
          <h1 className="giveaways-header">GIVEAWAYS</h1>
          <p className="giveaway-info">
            <i className="bx bx-info-circle" id="info-circle"></i> Follow the link to{" "}
            <a
              href="https://www.mmobomb.com/giveaway/world-warships-holiday-gift"
              target="_blank"
              rel="noreferrer"
            >
              mmobomb.com
            </a>{" "}
            to get a key!
          </p>
        </div>
        <div className="give-aways-container">
          {giveAways.map((giveAway, index) => (
            <div className="give-away">
              <div className="title-container">
                <p>{giveAway.title}</p>
                <img src={giveAway.thumbnail} alt="Giveaway Thumbnail" />
              </div>
              <div className="give-away-details">
                <p>{giveAway.keys_left} of Keys Left!</p>
                <div class="meter">
                  <span style={{width: giveAway.keys_left.slice(0, -1) + "%"}}></span>
                </div>
                <a
                  href={giveAway.giveaway_url}
                  className="giveaway-url"
                  target="_blank"
                  rel="noreferrer"
                >
                  Click Here to Redeem
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};
