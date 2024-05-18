import React from "react";
import { Link, useLocation } from "react-router-dom";
import DOMPurify from "dompurify";
import { CommentSection } from "../CommentSection/CommentSection";
import "./article.css";

export const Article = () => {
  const location = useLocation();
  const propsData = location.state;

  // DOMPurify sanitizes HTML and prevents XSS attacks
  const sanitizedData = () => ({
    __html: DOMPurify.sanitize(propsData.article_content),
  });

  return (
    <>
      <Link to="/" className="back-button">
        &#8592; Back
      </Link>
      <div className="article-container">
        <div className="title-contents">
          <h1 className="article-headline">{propsData.title}</h1>
          <p className="source">
            Posted by{" "}
            <a href="https://www.mmobomb.com/" target="_blank" rel="noreferrer">
              mmobomb.com
            </a>
          </p>
        </div>
        <article className="article-post">
          <div dangerouslySetInnerHTML={sanitizedData()} />
        </article>
        <CommentSection articleId={propsData.id} />
      </div>
    </>
  );
};
