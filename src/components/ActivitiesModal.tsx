import { useEffect, useState } from "react";
import axios from "axios";

interface ActivitiesModalProps {
  isOpen: boolean;
  onClose: () => void;
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

const defaultActivity = {
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
    if (activityId !== null) {
      const fetchActivity = async () => {
        try {
          const response = await axios.get(
            `http://localhost:3001/activities/${activityId}`
          );
          setActivity(response.data);
        } catch (error) {
          console.error("Error fetching activity:", error);
        }
      };

      fetchActivity();
    } else {
      setActivity(defaultActivity);
    }
  }, [activityId]);

  if (!isOpen) {
    return null;
  }

  const handleCreateActivity = async () => {
    if (activity) {
      try {
        const today = new Date();
        const formattedDate = today.toISOString().split("T")[0];

        const formData = new FormData();
        formData.append("email", userEmail);
        formData.append("date", formattedDate);
        formData.append("title", activity.title);
        formData.append("content", activity.content);

        if (selectedFile) {
          formData.append("image", selectedFile);
        }
        await axios.post(`http://localhost:3001/activities`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        await refreshActivities();
        onClose();
      } catch (error) {
        console.error("Error creating activity:", error);
      }
    }
  };

  const handleEditActivity = async () => {
    try {
      const formData = new FormData();
      formData.append("title", activity.title);
      formData.append("content", activity.content);

      if (selectedFile) {
        formData.append("image", selectedFile);
      }
      await axios.patch(
        `http://localhost:3001/activities/${activityId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      await refreshActivities();
      setIsEditing(false);
      onClose();
    } catch (error) {
      console.error("Error editing activity:", error);
    }
  };

  const handleDeleteActivity = async () => {
    const isConfirmed = window.confirm("정말로 이 활동을 삭제하시겠습니까?");

    if (isConfirmed) {
      try {
        await axios.delete(`http://localhost:3001/activities/${activityId}`);
        await refreshActivities();
        onClose();
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
          onClick={onClose}
        >
          &times;
        </button>
        {activityId === null ? (
          // 게시물 생성
          <div className="flex w-full h-full">
            <input
              type="file"
              onChange={handleFileChange}
              className="bg-slate-400 w-2/5 h-full object-cover rounded-l-lg"
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
                className="mb-4 text-left"
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
                    className="text-2xl font-bold mb-4 border border-gray-300 rounded p-2 w-full text-left"
                  />
                  <p className="mb-4 text-left">{activity.email}</p>
                  <p className="mb-4 text-left">{activity.date}</p>
                  <textarea
                    value={activity.content}
                    onChange={(e) =>
                      setActivity({ ...activity, content: e.target.value })
                    }
                    className="mb-4 border border-gray-300 rounded p-2 w-full h-40 text-left"
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
                  <h2 className="text-3xl font-bold mb-5">{activity.title}</h2>
                  <p className="mb-4">{activity.email}</p>
                  <p className="mb-4">{activity.date}</p>
                  <p className="mb-4">{activity.content}</p>
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
