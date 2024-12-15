// React 훅, 컴포넌트 상태 및 생명주기 관리를 위한 훅
import { useEffect, useState } from "react";
import axios from "axios";

// API 기본 URL 설정
const API_BASE_URL = "http://localhost:3001";

// 활동 모달 컴포넌트의 속성 타입 정의
interface ActivitiesModalProps {
  isOpen: boolean; // 모달 열기 상태
  onClose: (isNewItem: boolean) => void; // 모달 닫기 함수
  activityId: number | null; // 활동 ID (null일 경우 생성 모드)
  userEmail: string; // 사용자 이메일
  refreshActivities: () => Promise<void>; // 활동 데이터 새로고침 함수
}

// 활동 데이터 인터페이스 정의
interface Activity {
  id: number;
  email: string;
  date: string;
  title: string;
  content: string;
  mediaUrl: string;
}

// 기본 활동 데이터 초기값 설정
const defaultActivity: Activity = {
  id: 0,
  email: "",
  date: "",
  title: "",
  content: "",
  mediaUrl: "",
};

// 활동 생성, 수정, 삭제를 위한 모달 컴포넌트, 부모 컴포넌트로부터 props를 받아 사용
const ActivitiesModal: React.FC<ActivitiesModalProps> = ({
  isOpen,
  onClose,
  activityId,
  userEmail,
  refreshActivities,
}) => {
  // 활동 상태 관리
  const [activity, setActivity] = useState<Activity>(defaultActivity);
  // 활동 수정 상태 관리
  const [isEditing, setIsEditing] = useState(false);
  // 선택된 파일 상태 관리
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // activityId가 변경될 때마다 활동 데이터 가져오기
  useEffect(() => {
    const fetchActivity = async () => {
      if (activityId === null) {
        setActivity(defaultActivity);
        setSelectedFile(null);
        return;
      }

      try {
        const response = await axios.get<Activity>(
          `${API_BASE_URL}/activities/${activityId}`
        );
        setActivity(response.data);
        setSelectedFile(null);
      } catch (error) {
        console.error("Error fetching activity:", error);
        alert("활동을 불러오는데 실패했습니다.");
      }
    };

    fetchActivity();
  }, [activityId]);

  // 모달이 닫혀있으면 렌더링 하지 않음
  if (!isOpen) {
    return null;
  }

  // 활동 생성
  const handleCreateActivity = async () => {
    await refreshActivities();
    // 제목과 내용이 모두 입력되었는지 확인
    if (!activity.title.trim() || !activity.content.trim()) {
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

      // 폼 데이터 생성 - 파일이나 키-값 쌍 데이터를 포함
      const formData = new FormData();
      // formData.append("key", value)로 데이터를 추가
      formData.append("email", userEmail);
      formData.append("date", formattedDate);
      formData.append("title", activity.title.trim());
      formData.append("content", activity.content.trim());

      if (selectedFile) {
        formData.append("image", selectedFile);
      }

      await axios.post(`${API_BASE_URL}/activities`, formData, {
        // 파일 업로드 시 필요한 헤더 설정
        headers: {
          // 요청 데이터의 형식을 명시
          "Content-Type": "multipart/form-data",
        },
      });

      await refreshActivities(); // 활동 목록 새로고침
      setActivity(defaultActivity); // 활동 초기화
      setSelectedFile(null); // 선택된 파일 초기화
      onClose(true); // 모달 닫기
    } catch (error) {
      console.error("Error creating activity:", error);
      alert("활동 생성에 실패했습니다.");
    }
  };

  // 활동 수정
  const handleEditActivity = async () => {
    if (!activity.title.trim() || !activity.content.trim()) {
      alert("제목과 내용을 모두 입력해주세요.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("title", activity.title.trim());
      formData.append("content", activity.content.trim());

      if (selectedFile) {
        formData.append("image", selectedFile);
      }

      await axios.patch(`${API_BASE_URL}/activities/${activityId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      await refreshActivities(); // 활동 목록 새로고침
      setIsEditing(false); // 수정 모드 종료
      setSelectedFile(null); // 선택된 파일 초기화
    } catch (error) {
      console.error("Error editing activity:", error);
      alert("활동 수정에 실패했습니다.");
    }
  };

  // 활동 삭제
  const handleDeleteActivity = async () => {
    const isConfirmed = window.confirm("정말로 이 활동을 삭제하시겠습니까?");

    if (isConfirmed) {
      try {
        await axios.delete(`${API_BASE_URL}/activities/${activityId}`);
        await refreshActivities();
        onClose(true);
      } catch (error) {
        console.error("Error deleting activity:", error);
      }
    }
  };

  // 파일 변경 이벤트 처리
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // 파일 크기 제한 체크
      if (file.size > 5 * 1024 * 1024) {
        alert("파일 크기는 5MB 이하여야 합니다.");
        return;
      }

      // 이미지 파일 타입 체크
      if (!file.type.startsWith("image/")) {
        alert("이미지 파일만 업로드 가능합니다.");
        return;
      }

      setSelectedFile(file);
      const previewUrl = URL.createObjectURL(file); // 미리보기 URL 생성
      setActivity({
        ...activity,
        mediaUrl: previewUrl, // 미리보기용 임시 URL 저장
      });
    }
  };

  // 활동 소유자 확인
  const isOwner = () => {
    return activity?.email === userEmail;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex z-50">
      <div className="bg-white m-auto p-6 w-[80vw] h-[80vh] rounded-lg shadow-lg relative">
        <button
          className="absolute top-2 right-4 text-gray-500 hover:text-gray-700"
          onClick={() => onClose(false)}
        >
          &times;
        </button>
        {activityId === null ? (
          // 게시물 생성
          <div className="flex w-full h-full">
            <div className="bg-slate-300 w-2/5 h-full relative">
              {activity.mediaUrl ? (
                <img
                  src={activity.mediaUrl}
                  alt="미리보기"
                  className="w-full h-full object-cover rounded-l-lg"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <p className="text-gray-500">이미지를 선택해주세요</p>
                </div>
              )}
              <input
                type="file"
                onChange={handleFileChange}
                accept="image/*"
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
            </div>
            <div className="w-3/5 p-6 flex flex-col text-left justify-center">
              <input
                type="text"
                placeholder="Title"
                value={activity?.title || ""}
                onChange={(e) =>
                  setActivity({ ...activity, title: e.target.value })
                }
                className="text-2xl font-bold mb-5 text-left"
              />
              <textarea
                placeholder="Content"
                value={activity?.content || ""}
                onChange={(e) =>
                  setActivity({ ...activity, content: e.target.value })
                }
                className="mb-4 text-left w-full h-40 p-2 border rounded whitespace-pre-wrap"
              />
              <button
                onClick={handleCreateActivity}
                className="bg-blue-500 text-white p-2 rounded"
              >
                Create
              </button>
            </div>
          </div>
        ) : activity ? (
          // 게시물 수정
          <div className="flex w-full h-full">
            <img
              src={activity.mediaUrl}
              alt={activity.title}
              className="bg-slate-400 w-2/5 h-full object-cover rounded-l-lg"
            />
            <div className="w-3/5 p-6 flex flex-col text-left justify-center">
              {isEditing ? (
                <>
                  <input
                    type="text"
                    value={activity.title}
                    onChange={(e) =>
                      setActivity({ ...activity, title: e.target.value })
                    }
                    className="text-2xl font-bold mb-4 w-full text-left"
                  />
                  <p className="text-sm text-gray-500 text-left">
                    {activity.email}
                  </p>
                  <p className="mb-4 text-sm text-gray-500 text-left">
                    {activity.date}
                  </p>
                  <textarea
                    value={activity.content}
                    onChange={(e) =>
                      setActivity({ ...activity, content: e.target.value })
                    }
                    className="mb-4 border border-gray-300 rounded p-2 w-full h-40 text-left whitespace-pre-wrap"
                  />
                  {isEditing && (
                    <input
                      type="file"
                      onChange={handleFileChange}
                      className="mb-4"
                    />
                  )}
                  {isOwner() && (
                    <button
                      onClick={handleEditActivity}
                      className="absolute bottom-4 right-6 bg-blue-500 text-white p-1 rounded w-20"
                    >
                      Save
                    </button>
                  )}
                </>
              ) : (
                // 게시물 상세보기
                <>
                  <h2 className="text-2xl font-bold mb-5">{activity.title}</h2>
                  <p className="text-sm text-gray-500">{activity.email}</p>
                  <p className="text-sm text-gray-500 mb-4">{activity.date}</p>
                  <p className="mb-4 whitespace-pre-wrap">{activity.content}</p>
                  {isOwner() && (
                    <div className="absolute bottom-4 right-4 space-x-2">
                      <button
                        onClick={() => setIsEditing(true)}
                        className="border border-blue-500 text-blue-500 p-1 rounded"
                      >
                        Edit
                      </button>
                      <button
                        onClick={handleDeleteActivity}
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

export default ActivitiesModal;
