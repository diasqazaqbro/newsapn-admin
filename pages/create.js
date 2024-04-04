import React, { useRef, useState } from "react";
import { addDoc, collection, doc, getDoc } from "firebase/firestore/lite";
import { db, storage } from "@/lib/config";
import Layout from "@/components/Layout";
import { Editor } from "@tinymce/tinymce-react";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import ReactHtmlParser from "react-html-parser";

const NewNewsForm = () => {
  const [postTitle, setPostTitle] = useState("");
  const editorRef = useRef(null);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [file, setFile] = useState();
  const [isChecked, setIsChecked] = useState(false);
  const [url, setUrl] = useState("");
  const [youtube, setYoutube] = useState("");

  const handleCategoryChange = (event) => {
    const selectedValue = event.target.value;
    setSelectedCategory(selectedValue);
  };

  const handleCreateNews = async () => {
    if (editorRef.current) {
      console.log(editorRef.current.getContent());
      if (!file) {
        alert("Загрузите фотку");
        return;
      }
      try {
        const storageRef = ref(storage, `news/${postTitle}`);
        await uploadBytes(storageRef, file);
        const photoURL = await getDownloadURL(storageRef);
        const newsCollection = collection(db, "news");
        const userDoc = await getDoc(
          doc(db, "users", "vmjD2bZBMxd6ajB917GQC2o72Rv2")
        );
        const currentDate = new Date(); // Получаем текущую дату и время
        const userReference = userDoc.ref;
        await addDoc(newsCollection, {
          category: selectedCategory,
          post_description: editorRef.current.getContent(),
          post_title: postTitle,
          breaking_news: isChecked,
          num_comments: 0,
          num_likes: 0,
          num_views: 0,
          post_user: userReference,
          tag: [],
          viewed: [],
          post_photo: photoURL,
          url: url,
          time_posted: currentDate,
          youtube: youtube
        });
        console.log("File object:", file);
        console.log("Document successfully created");
        setPostTitle("");
        setShowPreview(true); // Show preview after creating the news
      } catch (error) {
        console.error("Error creating document: ", error);
      }
    }
  };

  const handleChange = () => {
    setIsChecked(!isChecked);
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  return (
    <Layout>
      <div className="flex items-center justify-center">
        <div className="max-w w-full p-4 bg-white rounded-lg shadow-md">
          <label htmlFor="fileInput" className="cursor-pointer">
            <span className="bg-blue-500 text-white px-2 mr-4 py-1 rounded">
              Добавить фотографию
            </span>
            <input
              id="fileInput"
              onClick={(event) => {
                handleFileChange(event);
              }}
              type="file"
              style={{ display: "none" }}
            />
          </label>
          <div className="mt-4 mb-6">
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
          <label htmlFor="category">Категория:</label>
          <select
            id="category"
            name="category"
            value={selectedCategory}
            onChange={handleCategoryChange}
            className="p-2 border rounded-md"
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
          <label className="block mb-4">
            <span className="text-gray-700">Заголовок:</span>
            <input
              type="text"
              value={postTitle}
              onChange={(e) => setPostTitle(e.target.value)}
              className="mt-1 p-2 border rounded-md w-full focus:outline-none focus:border-blue-500"
            />
          </label>
          <label className="block mb-4">
            <span className="text-gray-700">URL:</span>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="mt-1 p-2 border rounded-md w-full focus:outline-none focus:border-blue-500"
            />
          </label>
          <label className="block mb-4">
            <span className="text-gray-700">Youtube link:</span>
            <input
              type="text"
              value={youtube}
              onChange={(e) => setYoutube(e.target.value)}
              className="mt-1 p-2 border rounded-md w-full focus:outline-none focus:border-blue-500"
            />
          </label>

          <Editor
            apiKey="a3mu452cbh2dxc6zy2w75jelhgvjq4nk8ic27hcwfkx12mhv"
            onInit={(evt, editor) => (editorRef.current = editor)}
            initialValue={"<p>Введите описание</p>"}
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

          <button
            onClick={handleCreateNews}
            className="bg-blue-500 mt-5 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:border-blue-300"
          >
            Создать новость
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default NewNewsForm;
