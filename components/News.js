import React, { useEffect, useState } from "react";
import { db } from "@/lib/config";
import { collection, getDocs } from "firebase/firestore/lite";
import Link from "next/link";

const News = () => {
  const [newsList, setNewsList] = useState([]);

  useEffect(() => {
    async function fetchNews() {
      try {
        const newsCollection = collection(db, "news");
        const querySnapshot = await getDocs(newsCollection);
        const newsDocs = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setNewsList(newsDocs);
      } catch (error) {
        console.error("Error fetching news:", error);
      }
    }

    fetchNews();
  }, []);
  return (
      <div className="flex flex-wrap">
        {newsList.map((newsItem) => (
          <div className="news-card" key={newsItem.id}>
          <Link href={`/news/${newsItem.id}`}>
            <span className="news-title">{newsItem.post_title}</span>
          </Link>
          <Link href={`/news/${newsItem.id}`}>
            <span className="read-more-link">
              Read more
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-4 h-4 arrow-icon">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
              </svg>
            </span>
          </Link>
        </div>
        ))}
    </div>
  );
};

export default News;
