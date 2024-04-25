import DeleteItem from "@/components/DeleteItem";
import Layout from "@/components/Layout";
import { db, storage } from "@/lib/config";
import { Editor } from "@tinymce/tinymce-react";
import { collection, doc, getDocs, updateDoc } from "firebase/firestore/lite";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import ReactHtmlParser from "react-html-parser";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

const NewsId = () => {
  const router = useRouter();
  const { id } = router.query;
  const [selectedNews, setSelectedNews] = useState(null);
  const [editedTitle, setEditedTitle] = useState("");
  const [editedVideo, setEditedVideo] = useState("");
  const [editedCategory, setEditedCategory] = useState("");
  const [isChecked, setIsChecked] = useState();

  const handleChange = () => {
    setIsChecked(!isChecked);
  };
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    try {
      const storageRef = ref(storage, `news/${selectedNews.post_title}`);
      await uploadBytes(storageRef, file);
      const photoURL = await getDownloadURL(storageRef);
      const updatedData = { post_photo: photoURL };
      const newsDocRef = doc(db, "news", id);
      await updateDoc(newsDocRef, updatedData);
      setSelectedNews((prevState) => ({ ...prevState, post_photo: photoURL }));
    } catch (error) {
      console.error("Error updating photo:", error);
    }
  };
  useEffect(() => {
    async function fetchNews() {
      try {
        const newsCollection = collection(db, "news");
        const querySnapshot = await getDocs(newsCollection);
        const newsDocs = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        const foundNews = newsDocs.find((news) => news.id === id);
        setSelectedNews(foundNews);
        setEditedTitle(foundNews.post_title);
        setEditedVideo(foundNews.youtube)
        setEditedCategory(foundNews.category);
        setIsChecked(foundNews.breaking_news);
      } catch (error) {
        console.error("Error fetching news:", error);
      }
    }

    fetchNews();
  }, [id]);

  const editorRef = useRef(null);

  const handleTitleChange = (e) => {
    setEditedTitle(e.target.value);
  };

  const handleCategoryChange = (e) => {
    setEditedCategory(e.target.value);
  };
  

  const log = async () => {
    if (editorRef.current) {
      console.log(editedVideo);
      try {
        const newsDocRef = doc(db, "news", id);
        const updatedData = {
          post_title: editedTitle,
          category: editedCategory,
          post_description: editorRef.current.getContent(),
          breaking_news: isChecked,
          youtube: editedVideo | ""
        };

        await updateDoc(newsDocRef, updatedData);
        router.push('/');

        console.log("Document successfully updated!");
      } catch (error) {
        console.error("Error updating document: ", error);
      }
    }
  };
  return (
    <Layout>
      {selectedNews ? (
        <div className="max-w p-4 md:p-8 lg:p-12 bg-white rounded-xl overflow-hidden shadow-md">
          <img
            className="w-full h-48 object-cover"
            src={selectedNews.post_photo}
            alt={selectedNews.post_title}
          />
          <div className="mt-4">
            <label htmlFor="fileInput" className="cursor-pointer">
              <div>Youtube: {editedVideo ? editedVideo : 'нет видео'}</div>
              <span className="bg-blue-500 text-white px-2 mr-4 py-1 rounded">
                Редактировать фотографию
              </span>
              <input
                id="fileInput"
                onChange={(event) => {
                  handleFileChange(event);
                }}
                type="file"
                style={{ display: "none" }}
              />
            </label>
          </div>
          <div className="mt-4">
            <div className="flex self-center">
              <input
                type="checkbox"
                checked={isChecked}
                onChange={handleChange}
                className="mr-2 h-5 w-5 text-blue-500 focus:ring-blue-400 border-gray-300 rounded"
              />
              <span className="text-sm font-medium text-gray-900">
                Главные новости
              </span>
            </div>
          </div>

          <div className="p-6">
            <div className="flex items-center justify-between">
              <span className="text-gray-800 font-bold">
                {selectedNews.category}
              </span>
            </div>
            <h2 className="mt-2 mb-4 text-2xl font-semibold text-gray-800">
              {selectedNews.post_title}
            </h2>
            <p className="text-gray-600">
              {ReactHtmlParser(selectedNews.post_description)}
            </p>
          </div>
          <hr />
          <div className="mt-10">
            <h2 className="mb-5 font-bold text-2xl">Редактировать</h2>

            <input
              type="text"
              value={editedTitle}
              onChange={handleTitleChange}
              className="border p-2 mb-4 rounded"
            />
            

            <div>Youtube</div>
            
              <input
              type="text"
              value={editedVideo}
              onChange={(e) => {setEditedVideo(e.target.value)}}
              className="border p-2 mb-10 rounded"
            />
            <select
              value={editedCategory}
              onChange={handleCategoryChange}
              className="border p-2 mb-4 rounded"
            >
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
              <option value={"Здоровье и психология"}>
                Здоровье и психология
              </option>
              <option value={"Архитектура и строительство"}>
                Архитектура и строительство
              </option>
            </select>

            <Editor
              apiKey='a3mu452cbh2dxc6zy2w75jelhgvjq4nk8ic27hcwfkx12mhv'
              onInit={(evt, editor) => (editorRef.current = editor)}
              initialValue={selectedNews.post_description}
              init={{
                height: 500,
                menubar: false,
                plugins: [
                  "advlist",
                  "autolink",
                  "lists",
                  "link",
                  "image",
                  "charmap",
                  "preview",
                  "searchreplace",
                  "visualblocks",
                  "codesample code",
                  "fullscreen",
                  "insertdatetime",
                  "media",
                  "table",
                  "code",
                  "help",
                  "wordcount",
                ],
                toolbar:
                "undo redo | blocks | " +
                "bold italic forecolor | alignleft aligncenter " +
                "alignright alignjustify | bullist numlist outdent indent |" +
                "media | image  | preview | table | code",
                content_style:
                  "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
              }}
            />
            <div className="flex mt-4">
              {" "}
              <button
                className="bg-blue-500 text-white px-4 mr-4 py-2 rounded"
                onClick={log}
              >
                Редактировать
              </button>
              <DeleteItem id={id} />
            </div>
          </div>
        </div>
      ) : (
        "loading"
      )}
    </Layout>
  );
};

export default NewsId;
