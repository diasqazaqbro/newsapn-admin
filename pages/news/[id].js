import DeleteItem from "@/components/DeleteItem";
import Layout from "@/components/Layout";
import { db } from "@/lib/config";
import { Editor } from "@tinymce/tinymce-react";
import { collection, doc, getDocs, updateDoc } from "firebase/firestore/lite";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import ReactHtmlParser from "react-html-parser";
const NewsId = () => {
  const router = useRouter();
  const { id } = router.query;

  const [selectedNews, setSelectedNews] = useState(null);

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
      } catch (error) {
        console.error("Error fetching news:", error);
      }
    }

    fetchNews();
  }, [id]);

  const editorRef = useRef(null);
  const log = async () => {
    if (editorRef.current) {
      console.log(editorRef.current.getContent());
      try {
        const newsDocRef = doc(db, "news", id);

        const updatedData = {
          post_description: editorRef.current.getContent(),
        };

        await updateDoc(newsDocRef, updatedData);

        console.log("Document successfully updated!");
      } catch (error) {
        console.error("Error updating document: ", error);
      }
    }
  };
  return (
    <Layout>
      {selectedNews ? (
        <div className="max-w p-12 m-12 bg-white rounded-xl overflow-hidden shadow-md">
            <DeleteItem id={id}/>

          <img
            className="w-full h-48 object-cover"
            src={selectedNews.post_photo}
            alt={selectedNews.post_title}
          />
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
              {" "}
              {ReactHtmlParser(selectedNews.post_description)}
            </p>
          </div>
          <div>
            <Editor
              apiKey="your-api-key"
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
                  "anchor",
                  "searchreplace",
                  "visualblocks",
                  "code",
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
                  "alignright alignjustify | bullist numlist outdent indent | " +
                  "removeformat | help",
                content_style:
                  "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
              }}
            />
            <button
              className="bg-blue-500 text-white px-4 mt-4 py-2 rounded"
              onClick={log}
            >
              Редактировать
            </button>
          </div>
        </div>
      ) : (
        "loading"
      )}
    </Layout>
  );
};

export default NewsId;
