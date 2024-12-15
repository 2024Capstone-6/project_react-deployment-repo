import { useEffect, useState } from "react";
import axios from "axios";

// API 서버 주소
const API_BASE_URL = "http://localhost:3001";

// 부모 컴포넌트로부터 전달받는 props 타입 정의
interface JapaneseModalProps {
  isOpen: boolean;
  onClose: (isNewItem: boolean) => void;
  japaneseId: number | null; // 일본어 ID (null일 경우 생성 모드)
  userEmail: string;
  refreshJapanese: () => Promise<void>;
}

// 게시물 데이터 타입 정의
interface Japanese {
  id: number;
  email: string;
  date: string;
  title: string;
  content: string;
}

// 기본 게시물 데이터 초기값
const defaultJapanese: Japanese = {
  id: 0,
  email: "",
  date: "",
  title: "",
  content: "",
};

// 컴포넌트 정의
// 부모 컴포넌트로부터 props를 받아 사용
const JapaneseModal: React.FC<JapaneseModalProps> = ({
  isOpen,
  onClose,
  japaneseId,
  userEmail,
  refreshJapanese,
}) => {
  // 게시물 데이터 상태 관리
  const [japanese, setJapanese] = useState<Japanese>(defaultJapanese);
  // 수정 모드 상태 관리
  const [isEditing, setIsEditing] = useState(false);

  // japaneseId가 변경될 때마다 게시물 데이터 가져오기
  useEffect(() => {
    const fetchJapanese = async () => {
      if (japaneseId === null) {
        setJapanese(defaultJapanese);
        return;
      }

      try {
        const response = await axios.get<Japanese>(
          `${API_BASE_URL}/japanese/${japaneseId}`
        );
        setJapanese(response.data);
      } catch (error) {
        console.error("Error fetching japanese:", error);
        alert("게시물을 불러오는데 실패했습니다.");
      }
    };

    fetchJapanese(); // 게시물 데이터 가져오기
  }, [japaneseId]); // japaneseId가 변경될 때마다 게시물 데이터 가져오기

  if (!isOpen) {
    return null;
  }

  // 일본어 생성
  const handleCreateJapanese = async () => {
    if (!japanese.title.trim() || !japanese.content.trim()) {
      alert("제목과 내용을 모두 입력해주세요.");
      return;
    }

    try {
      // 현재 날짜 및 시간 가져오기
      const now = new Date();
      const formattedDate = `${now.getFullYear().toString().slice(2)}-${String(
        now.getMonth() + 1
      ).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")} ${String(
        now.getHours()
      ).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;

      const newJapanese = {
        email: userEmail,
        date: formattedDate,
        title: japanese.title.trim(),
        content: japanese.content.trim(),
      };

      await axios.post(`${API_BASE_URL}/japanese`, newJapanese);
      await refreshJapanese(); // 일본어 목록 새로고침
      setJapanese(defaultJapanese); // 게시물 초기화
      onClose(true); // 모달 닫기
    } catch (error) {
      console.error("Error creating japanese:", error);
      alert("게시물 생성에 실패했습니다.");
    }
  };

  // 일본어 수정
  const handleEditJapanese = async () => {
    if (!japanese.title.trim() || !japanese.content.trim()) {
      alert("제목과 내용을 모두 입력해주세요.");
      return;
    }

    try {
      const updatedJapanese = {
        title: japanese.title.trim(),
        content: japanese.content.trim(),
      };

      await axios.patch(
        `${API_BASE_URL}/japanese/${japaneseId}`,
        updatedJapanese
      );
      await refreshJapanese();
      setIsEditing(false);
      onClose(false);
    } catch (error) {
      console.error("Error editing japanese:", error);
      alert("게시물 수정에 실패했습니다.");
    }
  };

  // 일본어 삭제
  const handleDeleteJapanese = async () => {
    const isConfirmed = window.confirm("정말로 이 게시물을 삭제하시겠습니까?");

    if (isConfirmed) {
      try {
        await axios.delete(`${API_BASE_URL}/japanese/${japaneseId}`);
        await refreshJapanese();
        onClose(true);
      } catch (error) {
        console.error("Error deleting japanese:", error);
        alert("게시물 삭제에 실패했습니다.");
      }
    }
  };

  // 게시물 작성자 확인
  const isOwner = () => {
    return japanese?.email === userEmail;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex z-50">
      <div className="bg-white m-auto p-6 w-[80vw] h-[50vh] rounded-lg shadow-lg relative">
        <button
          className="absolute top-2 right-4 text-gray-500 hover:text-gray-700"
          onClick={() => onClose(false)}
        >
          &times;
        </button>
        {japaneseId === null ? (
          // 게시물 생성
          <div className="flex w-full h-full items-center justify-center">
            <div className="w-3/5 flex flex-col text-left">
              <input
                type="text"
                placeholder="Title"
                value={japanese?.title || ""}
                onChange={(e) =>
                  setJapanese({ ...japanese, title: e.target.value })
                }
                className="text-3xl font-bold mb-4 text-left"
              />
              <p className="text-sm text-gray-500">{userEmail}</p>
              <p className="text-sm text-gray-500 mb-4">
                {new Date().toISOString().split("T")[0]}
              </p>
              <textarea
                placeholder="Content"
                value={japanese?.content || ""}
                onChange={(e) =>
                  setJapanese({ ...japanese, content: e.target.value })
                }
                className="mb-4 text-left border border-gray-300 rounded p-2 w-full h-[25vh] whitespace-pre-wrap"
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
          // 게시물 수정
          <div className="flex w-full h-full items-center justify-center">
            <div className="w-1/2 flex flex-col text-left">
              {isEditing ? (
                <>
                  <input
                    type="text"
                    value={japanese.title}
                    onChange={(e) =>
                      setJapanese({ ...japanese, title: e.target.value })
                    }
                    className="text-3xl font-bold mb-4 w-full text-left"
                  />
                  <p className="text-sm text-gray-500">{japanese.email}</p>
                  <p className="text-sm text-gray-500 mb-4">{japanese.date}</p>
                  <textarea
                    value={japanese.content}
                    onChange={(e) =>
                      setJapanese({ ...japanese, content: e.target.value })
                    }
                    className="mb-4 border border-gray-300 rounded p-2 w-full h-[25vh] text-left whitespace-pre-wrap"
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
                  <h2 className="text-3xl font-bold mb-4">{japanese.title}</h2>
                  <p className="text-sm text-gray-500">{japanese.email}</p>
                  <p className="text-sm text-gray-500 mb-4">{japanese.date}</p>
                  <p className="mb-4 border border-gray-300 rounded p-2 h-[25vh] overflow-y-auto whitespace-pre-wrap">
                    {japanese.content}
                  </p>
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
