import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Navbar } from "../Navbar/Navbar";
import './feed.css';
import background from "../../images/controller-background.webp"

export const Feed = () => {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    const fetchAllArticles = async () => {
      try {
        const response = await axios.get("https://www.mmobomb.com/api1/latestnews");
        setArticles(response.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchAllArticles();
  }, []);


  const topFunction = () => {
    document.querySelector(".feed-container").scrollTop = 0;
  }

  return (
    <>
    <div style={{ backgroundImage: `url(${background})` }} className="bg-img"></div>
    <Navbar />
    <div className="feed-container">
      <h2 className="news-header">Latest MMO News</h2>
      {articles.map((article, index) => (
        <div className="article" key={article.id} index={index}>
          <Link to="/article" state={articles[index]} className="article-link">
            <img src={article.main_image} className="article-img" alt="Game Thumbnail" />
            <div className="article-contents">
            <p className="headline">{article.title}</p>
            <p className="description">{article.short_description}</p>
            </div>
          </Link>
        </div>
      ))}
      <div className="to-top-container">
        <button className="to-top-btn" onClick={topFunction}>
          <i className="bx bx-up-arrow-alt" id="up-arrow"></i>Back to Top</button>
      </div>
    </div>
    </>
  );
};
