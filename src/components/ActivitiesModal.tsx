import { useEffect, useState } from "react";
import axios from "axios";

const API_BASE_URL = "http://localhost:3001";

interface ActivitiesModalProps {
  isOpen: boolean;
  onClose: (isNewItem: boolean) => void;
  activityId: number | null;
  userEmail: string;
  refreshActivities: () => Promise<void>;
}

interface Activity {
  id: number;
  email: string;
  date: string;
  title: string;
  content: string;
  mediaUrl: string;
}

const defaultActivity: Activity = {
  id: 0,
  email: "",
  date: "",
  title: "",
  content: "",
  mediaUrl: "",
};

const ActivitiesModal: React.FC<ActivitiesModalProps> = ({
  isOpen,
  onClose,
  activityId,
  userEmail,
  refreshActivities,
}) => {
  const [activity, setActivity] = useState<Activity>(defaultActivity);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

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

  if (!isOpen) {
    return null;
  }

  const handleCreateActivity = async () => {
    if (!activity.title.trim() || !activity.content.trim()) {
      alert("제목과 내용을 모두 입력해주세요.");
      return;
    }

    try {
      const today = new Date();
      const formattedDate = today.toISOString().split("T")[0];

      const formData = new FormData();
      formData.append("email", userEmail);
      formData.append("date", formattedDate);
      formData.append("title", activity.title.trim());
      formData.append("content", activity.content.trim());

      if (selectedFile) {
        formData.append("image", selectedFile);
      }

      await axios.post(`${API_BASE_URL}/activities`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      await refreshActivities();
      setActivity(defaultActivity);
      setSelectedFile(null);
      onClose(true);
    } catch (error) {
      console.error("Error creating activity:", error);
      alert("활동 생성에 실패했습니다.");
    }
  };

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

      await refreshActivities();
      setIsEditing(false);
      setSelectedFile(null);
      onClose(false);
    } catch (error) {
      console.error("Error editing activity:", error);
      alert("활동 수정에 실패했습니다.");
    }
  };

  const handleDeleteActivity = async () => {
    const isConfirmed = window.confirm("정말로 이 활동을 삭제하시겠습니까?");

    if (isConfirmed) {
      try {
        await axios.delete(`${API_BASE_URL}/activities/${activityId}`);
        await refreshActivities();
        onClose(false);
      } catch (error) {
        console.error("Error deleting activity:", error);
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setActivity({
        ...activity,
        mediaUrl: URL.createObjectURL(file),
      });
    }
  };

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
            <input
              type="file"
              onChange={handleFileChange}
              className="bg-slate-300 w-2/5 h-full object-cover rounded-l-lg"
            />
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
          // 게시물 수정/조회
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
