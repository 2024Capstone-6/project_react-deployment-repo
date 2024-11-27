import { useEffect, useState } from "react";
import axios from "axios";

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
              const response = await axios.get(`http://localhost:3001/activities/${activityId}`);
              setActivity(response.data);
            } catch (error) {
              console.error('Error fetching activity:', error);
            }
          };
    
          fetchActivity();
        }
      }, [activityId]);
  
    if (!isOpen) {
      return null;
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex z-50">
          <div className="bg-white m-auto p-6 w-[80vw] h-[80vh] rounded-lg shadow-lg relative">
            <button className="absolute top-2 right-2 text-gray-500 hover:text-gray-700" onClick={onClose}>
              &times;
            </button>
            {activity ? (
              <div className="flex w-full h-full">
              <img src={activity.mediaUrl} alt={activity.title} className="bg-slate-400 w-2/5 h-full object-cover rounded-l-lg" />
              <div className="w-3/5 p-6 flex flex-col text-left justify-center">
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
}

export default ActivitiesModal;