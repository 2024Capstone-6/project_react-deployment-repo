import { useEffect, useState } from "react";
import axios from "axios";

interface ActivitiesModalProps {
  isOpen: boolean;
  onClose: () => void;
  activityId: number | null;
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
}) => {
  const [activity, setActivity] = useState<Activity>(defaultActivity);

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
        // 현재 날짜를 YYYY-MM-DD 형식으로 포맷팅
        const today = new Date();
        const formattedDate = today.toISOString().split("T")[0];

        const activityWithDate = {
          ...activity,
          date: formattedDate,
        };

        await axios.post(`http://localhost:3001/activities`, activityWithDate);
        onClose();
      } catch (error) {
        console.error("Error creating activity:", error);
      }
    }
  };

  const handleDeleteActivity = async () => {
    // 사용자에게 삭제 확인
    const isConfirmed = window.confirm("정말로 이 활동을 삭제하시겠습니까?");

    if (isConfirmed) {
      try {
        await axios.delete(`http://localhost:3001/activities/${activityId}`);
        onClose();
        window.location.reload();
      } catch (error) {
        console.error("Error deleting activity:", error);
      }
    }
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
          <div className="flex w-full h-full">
            <input
              type="file"
              placeholder="Media URL"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  setActivity({
                    ...activity,
                    mediaUrl: URL.createObjectURL(file),
                  });
                }
              }}
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
                className="text-2xl font-bold mb-5"
              />
              <textarea
                placeholder="Content"
                value={activity?.content || ""}
                onChange={(e) =>
                  setActivity({ ...activity, content: e.target.value })
                }
                className="mb-4"
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
          <div className="flex w-full h-full">
            <img
              src={activity.mediaUrl}
              alt={activity.title}
              className="bg-slate-400 w-2/5 h-full object-cover rounded-l-lg"
            />
            <div className="w-3/5 p-6 flex flex-col text-left justify-center">
              <button className="absolute bottom-4 right-20 border border-blue-500 text-blue-500 p-1 rounded">
                Edit
              </button>
              <button
                onClick={handleDeleteActivity}
                className="absolute bottom-4 right-5 border border-red-500 text-red-500 p-1 rounded"
              >
                Delete
              </button>
              <h2 className="text-3xl font-bold mb-5">{activity.title}</h2>
              <p className="mb-4">{activity.email}</p>
              <p className="mb-4">{activity.date}</p>
              <p className="mb-4">{activity.content}</p>
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
