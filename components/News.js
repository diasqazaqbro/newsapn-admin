import React, { useEffect, useState } from "react";
import { db } from "@/lib/config";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore/lite";
import Link from "next/link";

const News = () => {
  const [newsList, setNewsList] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  useEffect(() => {
    async function fetchNews() {
      try {
        const newsCollection = collection(db, "news");
        const q = query(newsCollection, orderBy("time_posted", "desc")); // Query sorted by time_posted in descending order
        const querySnapshot = await getDocs(q);
        const newsDocs = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setNewsList(newsDocs);
        console.log(newsDocs);
      } catch (error) {
        console.error("Error fetching news:", error);
      }
    }

    fetchNews();
  }, [selectedCategory]);

  const filteredNewsByCategory = selectedCategory
    ? newsList.filter((news) => news.category == selectedCategory)
    : newsList;

  const filteredNews = filteredNewsByCategory.filter((news) =>
    news.post_title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mx-auto p-4">
      <div className="mb-4">
        <label htmlFor="search" className="mr-2">
          Поиск:
        </label>
        <input
          type="text"
          id="search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border p-2 rounded"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="category" className="mr-2">
          Фильтрация по Категориям
        </label>
        <select
          id="category"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">All</option>
          <option value={"Происшествия"}>Происшествия</option>
          <option value={"Анонсы"}>Анонсы</option>
          <option value={"История"}>История</option>
          <option value={"Спорт"}>Спорт</option>
          <option value={"Символика и атрибутика"}>
            Символика и атрибутика
          </option>
          <option value={"Культура"}>Культура</option>
          <option value={"Образование"}>Образование</option>
          <option value={"Обращение"}>Обращение</option>
          <option value={"Летопись"}>Летопись</option>
          <option value={"Экономика"}>Экономика</option>
          <option value={"Общество"}>Общество</option>
          <option value={"Портрет"}>Портрет</option>
          <option value={"Путешествия"}>Путешествия</option>
          <option value={"События"}>События</option>
          <option value={"Здоровье и психология"}>Здоровье и психология</option>
          <option value={"Архитектура и строительство"}>
            Архитектура и строительство
          </option>
        </select>
      </div>

      <div className="flex flex-wrap">
        {filteredNews.map((newsItem) => (
          <div
            className="news-card bg-white p-4 m-4 rounded shadow-md"
            key={newsItem.id}
          >
            <Link href={`/news/${newsItem.id}`}>
              <span className="news-title text-xl font-semibold mb-2">
                {newsItem.post_title}
              </span>
            </Link>
            <Link href={`/news/${newsItem.id}`}>
              <span className="read-more-link flex items-center text-blue-500 no-underline hover:text-blue-700 transition duration-300 ease-in-out">
                Читать больше
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className="w-4 h-4 ml-1 arrow-icon"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 5l7 7-7 7"
                  ></path>
                </svg>
              </span>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default News;
