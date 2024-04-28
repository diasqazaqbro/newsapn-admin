import Layout from "@/components/Layout";
import { useEffect, useState } from "react";
import { db } from "@/lib/config";
import { collection, getDocs, doc, getDoc } from "firebase/firestore/lite";
import CommentCard from "@/components/CommentCard";

const fetchDocumentData = async (docRef) => {
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
};


const fetchMultipleDocuments = async (docRefs) => {
  const dataPromises = docRefs.map(ref => fetchDocumentData(ref));
  return Promise.all(dataPromises);
};

export default function Home() {
  const [commentList, setCommentList] = useState([]);

  useEffect(() => {
    async function fetchComments() {
        const commentsCollection = collection(db, "coments");
        const querySnapshot = await getDocs(commentsCollection);
        const commentsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        console.log(commentsData[0].news_Ref.id)
        // Extract unique user and news references
        const userRefs = [...new Set(commentsData.map(comment => doc(db, "users", comment.user.id)))];
        const newsRefs = [...new Set(commentsData.map(comment => doc(db, "news", comment.news_Ref.id)))];
        console.log(123)

        // Fetch user and news data in parallel
        const [users, newsItems] = await Promise.all([
          fetchMultipleDocuments(userRefs),
          fetchMultipleDocuments(newsRefs)
        ]);

        // Create lookup tables
        const usersById = users.reduce((acc, user) => (user ? { ...acc, [user.id]: user } : acc), {});
        const newsById = newsItems.reduce((acc, news) => (news ? { ...acc, [news.id]: news } : acc), {});

        // Assemble comments with user and news data
        const enrichedComments = commentsData.map(comment => ({
          ...comment,
          user: usersById[comment.user],
          news: newsById[comment.news_Ref]
        }));
        console.log(enrichedComments)
        console.log(123)
        setCommentList(enrichedComments.filter(comment => !comment.moderated));
    }

    fetchComments();
    console.log(commentList)
  }, []);

  return (
      <Layout>
        <div className="container mx-auto p-4">
          {commentList.length > 0 ? commentList.map((comment, index) => (
              <CommentCard key={index} comment={comment} />
          )) : <h2 className="text-center mt-[100px] text-2xl">No comments available.</h2>}
        </div>
      </Layout>
  );
}
