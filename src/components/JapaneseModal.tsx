import { useEffect, useState } from "react";
import axios from "axios";

interface JapaneseModalProps {
  isOpen: boolean;
  onClose: () => void;
  japaneseId: number | null;
  userEmail: string;
  refreshJapanese: () => Promise<void>;
}

interface Japanese {
  id: number;
  email: string;
  date: string;
  title: string;
  content: string;
}

const defaultJapanese = {
  id: 0,
  email: "",
  date: "",
  title: "",
  content: "",
};

const JapaneseModal: React.FC<JapaneseModalProps> = ({
  isOpen,
  onClose,
  japaneseId,
  userEmail,
  refreshJapanese,
}) => {
  const [japanese, setJapanese] = useState<Japanese>(defaultJapanese);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (japaneseId !== null) {
      const fetchJapanese = async () => {
        try {
          const response = await axios.get(
            `http://localhost:3001/japanese/${japaneseId}`
          );
          setJapanese(response.data);
        } catch (error) {
          console.error("Error fetching japanese:", error);
        }
      };

      fetchJapanese();
    } else {
      setJapanese(defaultJapanese);
    }
  }, [japaneseId]);

  if (!isOpen) {
    return null;
  }

  const handleCreateJapanese = async () => {
    if (japanese) {
      try {
        const today = new Date();
        const formattedDate = today.toISOString().split("T")[0];

        const newJapanese = {
          email: userEmail,
          date: formattedDate,
          title: japanese.title,
          content: japanese.content,
        };

        await axios.post(`http://localhost:3001/japanese`, newJapanese);
        await refreshJapanese();
        onClose();
      } catch (error) {
        console.error("Error creating japanese:", error);
      }
    }
  };

  const handleEditJapanese = async () => {
    try {
      const updatedJapanese = {
        title: japanese.title,
        content: japanese.content,
      };

      await axios.patch(
        `http://localhost:3001/japanese/${japaneseId}`,
        updatedJapanese
      );
      await refreshJapanese();
      setIsEditing(false);
      onClose();
    } catch (error) {
      console.error("Error editing japanese:", error);
    }
  };

  const handleDeleteJapanese = async () => {
    const isConfirmed = window.confirm("정말로 이 게시물을 삭제하시겠습니까?");

    if (isConfirmed) {
      try {
        await axios.delete(`http://localhost:3001/japanese/${japaneseId}`);
        await refreshJapanese();
        onClose();
      } catch (error) {
        console.error("Error deleting japanese:", error);
      }
    }
  };

  const isOwner = () => {
    return japanese?.email === userEmail;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex z-50">
      <div className="bg-white m-auto p-6 w-[80vw] h-[80vh] rounded-lg shadow-lg relative">
        <button
          className="absolute top-2 right-4 text-gray-500 hover:text-gray-700"
          onClick={onClose}
        >
          &times;
        </button>
        {japaneseId === null ? (
          // 게시물 생성
          <div className="flex w-full h-full">
            <div className="w-full p-6 flex flex-col text-left justify-center">
              <input
                type="text"
                placeholder="Title"
                value={japanese?.title || ""}
                onChange={(e) =>
                  setJapanese({ ...japanese, title: e.target.value })
                }
                className="text-2xl font-bold mb-5 text-left"
              />
              <textarea
                placeholder="Content"
                value={japanese?.content || ""}
                onChange={(e) =>
                  setJapanese({ ...japanese, content: e.target.value })
                }
                className="mb-4 text-left"
              />
              <button
                onClick={handleCreateJapanese}
                className="bg-blue-500 text-white p-2 rounded"
              >
                Create
              </button>
            </div>
          </div>
        ) : japanese ? (
          // 게시물 수정/조회
          <div className="flex w-full h-full">
            <div className="w-full p-6 flex flex-col text-left justify-center">
              {isEditing ? (
                <>
                  <input
                    type="text"
                    value={japanese.title}
                    onChange={(e) =>
                      setJapanese({ ...japanese, title: e.target.value })
                    }
                    className="text-2xl font-bold mb-4 border border-gray-300 rounded p-2 w-full text-left"
                  />
                  <p className="mb-4 text-left">{japanese.email}</p>
                  <p className="mb-4 text-left">{japanese.date}</p>
                  <textarea
                    value={japanese.content}
                    onChange={(e) =>
                      setJapanese({ ...japanese, content: e.target.value })
                    }
                    className="mb-4 border border-gray-300 rounded p-2 w-full h-40 text-left"
                  />
                  {isOwner() && (
                    <button
                      onClick={handleEditJapanese}
                      className="absolute bottom-4 right-6 bg-blue-500 text-white p-1 rounded w-20"
                    >
                      Save
                    </button>
                  )}
                </>
              ) : (
                // 게시물 상세보기
                <>
                  <h2 className="text-3xl font-bold mb-5">{japanese.title}</h2>
                  <p className="mb-4">{japanese.email}</p>
                  <p className="mb-4">{japanese.date}</p>
                  <p className="mb-4">{japanese.content}</p>
                  {isOwner() && (
                    <div className="absolute bottom-4 right-4 space-x-2">
                      <button
                        onClick={() => setIsEditing(true)}
                        className="border border-blue-500 text-blue-500 p-1 rounded"
                      >
                        Edit
                      </button>
                      <button
                        onClick={handleDeleteJapanese}
                        className="border border-red-500 text-red-500 p-1 rounded"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </div>
  );
};

export default JapaneseModal;
