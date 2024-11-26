import { useEffect, useState } from "react";

interface ActivitiesModalProps {
    isOpen: boolean;
    onClose: () => void;
    activityId: number | null;
};

interface Activity {
    id: number;
    email: string;
    date: string;
    title: string;
    content: string;
    mediaUrl: string;
}

const ActivitiesModal: React.FC<ActivitiesModalProps> = ({ isOpen, onClose, activityId }) => {
    const [activity, setActivity] = useState<Activity | null>(null);
  
    useEffect(() => {
      if (activityId !== null) {
        const fetchActivity = async () => {
          try {
            const response = await fetch(`http://localhost:3001/activities/${activityId}`);
            const data = await response.json();
            if (response.ok) {
              setActivity(data);
            } else {
              console.error('Error fetching activity:', data.message);
            }
          } catch (error) {
            console.error('Error:', error);
          }
        };
  
        fetchActivity();
      }
    }, [activityId]);
  
    if (!isOpen) {
      return null;
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center z-50">
          <div className="bg-white m-auto p-6 w-4/5 h-[80vh] rounded-lg shadow-lg relative">
            <button className="absolute top-2 right-2 text-gray-500 hover:text-gray-700" onClick={onClose}>
              &times;
            </button>
            {activity ? (
              <div>
                <h2 className="text-2xl font-bold mb-4">{activity.title}</h2>
                <p className="mb-4">{activity.content}</p>
                {/* 기타 활동 정보 */}
              </div>
            ) : (
              <p>Loading...</p>
            )}
          </div>
        </div>
    );
}

export default ActivitiesModal;