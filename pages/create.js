import React, { useRef, useState } from "react";
import { addDoc, collection } from "firebase/firestore/lite";
import { db } from "@/lib/config";
import Layout from "@/components/Layout";
import { Editor } from "@tinymce/tinymce-react";

const NewNewsForm = () => {
  const [category, setCategory] = useState("");
  const [postTitle, setPostTitle] = useState("");
  const editorRef = useRef(null);

  const handleCreateNews = async () => {
    if (editorRef.current) {
      console.log(editorRef.current.getContent());
      try {
        const newsCollection = collection(db, "news");
        const newNewsDoc = await addDoc(newsCollection, {
          category: category,
          post_description: editorRef.current.getContent(),
          post_title: postTitle,
        });

        console.log("Document successfully created with ID:", newNewsDoc.id);
        setCategory("");
        setPostDescription("");
        setPostTitle("");
      } catch (error) {
        console.error("Error creating document: ", error);
      }
    }
  };

  return (
    <Layout>
      <div className="flex items-center justify-center">
        <div className="max-w w-full p-4 bg-white rounded-lg shadow-md">
          <label className="block mb-2">
            <span className="text-gray-700">Категория:</span>
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="mt-1 p-2 border rounded-md w-full focus:outline-none focus:border-blue-500"
            />
          </label>
          <label className="block mb-4">
            <span className="text-gray-700">Заголовок:</span>
            <input
              type="text"
              value={postTitle}
              onChange={(e) => setPostTitle(e.target.value)}
              className="mt-1 p-2 border rounded-md w-full focus:outline-none focus:border-blue-500"
            />
          </label>
          <Editor
            apiKey="your-api-key"
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
            onClick={handleCreateNews}
            className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:border-blue-300"
          >
            Создать новость
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default NewNewsForm;
