import React, { useState } from 'react';
import { deleteDoc, doc } from 'firebase/firestore/lite';
import { db } from '@/lib/config';
import { useRouter } from 'next/router';

const DeleteItem = ({ id }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter()
  const handleDelete = async () => {
    try {
      const clusterDocRef = doc(db, 'news', id);
      await deleteDoc(clusterDocRef);
      console.log('Cluster successfully deleted with ID:', id);
      setIsModalOpen(false);
      router.back()
    } catch (error) {
      console.error('Error deleting cluster: ', error);
    }
  };

  return (
    <div>
      <button onClick={() => setIsModalOpen(true)} className="bg-red-500 text-white px-4 py-2 rounded">
        Удалить
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded-lg">
            <p className="mb-4">Вы точно хотите удалить?</p>
            <div className="flex justify-end">
              <button onClick={() => setIsModalOpen(false)} className="text-gray-600 mr-4">
                Отмена
              </button>
              <button onClick={handleDelete} className="text-white bg-red-500 px-4 py-2 rounded">
                Удалить
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeleteItem;
