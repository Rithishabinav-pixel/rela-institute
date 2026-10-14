"use client";

import React, { useEffect, useRef } from "react";
import style from "./detail.module.css";
import "./articleDetail.css";
import { toLocalArticleLinks } from "../wordpress";

export default function ArticleContent({ content }) {
  const contentRef = useRef(null);

 useEffect(() => {
  const timer = setTimeout(() => {
    if (!contentRef.current) return;

    const tableHead = contentRef.current.querySelector(
      ".ez-toc-title-container"
    );

    const tableBody = contentRef.current.querySelector("nav");

    if (!tableHead || !tableBody) return;

    const handleClick = () => {
      tableBody.classList.toggle("active");
    };

    tableHead.addEventListener("click", handleClick);

    return () => {
      tableHead.removeEventListener("click", handleClick);
    };
  }, 500);

  return () => clearTimeout(timer);
}, [content]);

  return (
    <div
      className={style.articleContents}
      ref={contentRef}
      dangerouslySetInnerHTML={{
        __html: toLocalArticleLinks(content)
      }}
    />
  );
}