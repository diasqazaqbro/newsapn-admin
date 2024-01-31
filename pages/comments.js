import Layout from "@/components/Layout";
import { useEffect, useState } from "react";
import { db } from "@/lib/config";
import { collection, getDocs, doc, getDoc } from "firebase/firestore/lite";
import CommentCard from "@/components/CommentCard";

const fetchUserData = async (userRef) => {
  const userDoc = await getDoc(userRef);
  if (userDoc.exists()) {
    return userDoc.data();
  } else {
    return null;
  }
};

const fetchNewsData = async (newsRef) => {
  const newsDoc = await getDoc(newsRef);
  if (newsDoc.exists()) {
    return newsDoc.data();
  } else {
    return null;
  }
};

export default function Home() {
  const [commentList, setCommentList] = useState([]);

  useEffect(() => {
    async function fetchComments() {
      try {
        const commentsCollection = collection(db, "coments");
        const querySnapshot = await getDocs(commentsCollection);
        const comments = [];

        for (const doc of querySnapshot.docs) {
          const commentData = doc.data();

          const userRef = doc.get("user");
          const newsRef = doc.get("news_Ref");

          const userData = await fetchUserData(userRef);
          const newsData = await fetchNewsData(newsRef);

          comments.push({ id: doc.id, ...commentData, user: userData, news: newsData });
        }

        setCommentList(comments);
      } catch (error) {
        console.error("Error fetching comments:", error);
      } 
    }

    fetchComments();
  }, []);
  console.log(commentList);
  const filteredComment = commentList.filter((c) => c.moderated == false)
  return (
    <Layout>
      <div className="container mx-auto p-4">
        {filteredComment.length > 0 ? filteredComment.map((comment, index) => (
          <CommentCard key={index} comment={comment} />
        )) : <h2 className="text-center mt-[100px] text-2xl">Нет комментариев :(</h2>}
      </div>
    </Layout>
  );
}
