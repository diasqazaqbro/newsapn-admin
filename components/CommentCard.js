import { db } from "@/lib/config";
import { deleteDoc, doc, updateDoc } from "firebase/firestore/lite";
import Link from "next/link";
import React from "react";

function CommentCard({ comment }) {
  const userData = comment.user;
  const newsData = comment.news;

  const handleDelete = async (deleteId) => {
    try {
      const clusterDocRef = doc(db, "coments", deleteId);
      await deleteDoc(clusterDocRef);
      console.log("Cluster successfully deleted with ID:", deleteId);
    } catch (error) {
      console.error("Error deleting cluster: ", error);
    } finally {
      window.location.reload();
    }
  };
  const handleModerate = async (id) => {
    try {
      const newsDocRef = doc(db, "coments", id);

      const updatedData = {
        moderated: true,
      };

      await updateDoc(newsDocRef, updatedData);

      console.log("Document successfully updated!");
    } catch (error) {
      console.error("Error updating document: ", error);
    } finally {
      window.location.reload();
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-4 mb-4">
      <div className="flex items-center mb-2 justify-between">
        <div>
          {userData && (
            <p className="font-semibold">
              {userData.name}
              <span className=" font-normal text-gray-600">
                {" "}
                - {userData.email}
              </span>
            </p>
          )}
          <p className="text-gray-500 text-sm">
            {new Date(comment.timeposted.seconds * 1000).toLocaleString()}
          </p>
        </div>
        <div>
          <button
            onClick={() => {
              handleModerate(comment.id);
            }}
            className="bg-blue-500 text-white px-2 mr-4 py-1 rounded"
          >
            Одобрить
          </button>
          <button
            onClick={() => {
              handleDelete(comment.id);
            }}
            className="bg-red-500 text-white px-2 py-1 rounded"
          >
            Удалить
          </button>
        </div>
      </div>
      <div className="flex justify-between mt-4 mb-4">
        <p className="text-gray-800">{comment.coment_text}</p>
        <span className="text-gray-500">{comment.likes} Likes</span>
      </div>
      {newsData && (
        <div className="mt-4">
          <hr />
          <div className="pt-4">
            <Link
              className=" text-blue-500 underline"
              href={`/${comment.news_Ref.path}`}
            >
              {newsData.post_title}
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default CommentCard;
