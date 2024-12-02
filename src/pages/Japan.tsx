import { useState, useEffect } from "react";
import axios from "axios";

import ActivitiesModal from "../components/ActivitiesModal";

interface Activity {
  id: number;
  mediaUrl: string;
}

interface Japanese {
  id: number;
  date: string;
  email: string;
  title: string;
  content: string;
}

const Japan: React.FC = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [japanese, setJapanese] = useState<Japanese[]>([]);
  const [page, setPage] = useState<number>(1);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selcetedID, setSelectedID] = useState<number | null>(null);

  const limit = 3;

  // 페이지네이션 데이터를 가져오는 함수
  const fetchPaginatedActivities = async (page: number) => {
    try {
      const response = await axios.get(
        `http://localhost:3001/activities/page`,
        {
          params: {
            page: page,
            limit: limit,
          },
        }
      );
      setActivities(response.data);
    } catch (error) {
      console.error("Error fetching paginated activities:", error);
    }
  };

  const fetchPaginatedJapanese = async (page: number) => {
    try {
      const response = await axios.get(`http://localhost:3001/japanese/page`, {
        params: { page: page },
      });
      setJapanese(response.data);
    } catch (error) {
      console.error("Error fetching paginated japanese:", error);
    }
  };

  // 페이지 변경 시 데이터 로드
  useEffect(() => {
    fetchPaginatedActivities(page);
    fetchPaginatedJapanese(page);
  }, [page]);

  const handlePageChange = (direction: "prev" | "next") => {
    setPage((prevPage) =>
      direction === "next" ? prevPage + 1 : Math.max(prevPage - 1, 1)
    );
  };

  const handleActivityClick = (id: number) => {
    console.log(`Card ${id} clicked`);
    setSelectedID(id);
    setIsModalOpen(true);
  };

  const handleCreateActivity = () => {
    setSelectedID(null);
    setIsModalOpen(true);
  };

  return (
    <div className="p-5 h-screen w-full m-auto">
      {/* Activities Section */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <input
            type="text"
            placeholder="Search Activities"
            className="border p-2 rounded w-full mb-4"
          />
          <button
            className="ml-4 bg-blue-500 text-white p-2 rounded w-10 h-10 flex items-center justify-center mb-4"
            onClick={handleCreateActivity}
          >
            +
          </button>
        </div>
        <div className="relative">
          <button
            className="absolute left-0 top-1/2 transform -translate-y-1/2 p-2 rounded"
            onClick={() => handlePageChange("prev")}
          >
            &lt;
          </button>
          <div className="flex overflow-x-auto space-x-4 mx-auto w-[calc(100%-1rem)] justify-center">
            {activities.map((activity) => (
              <div
                key={activity.id}
                className="w-[30%] h-[55vh] bg-gray-200 flex-shrink-0 overflow-hidden relative"
                onClick={() => handleActivityClick(activity.id)}
              >
                {/* 게시물의 사진을 표시 */}
                {activity.mediaUrl ? (
                  <img
                    src={activity.mediaUrl}
                    alt={`Activity ${activity.id}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  // 사진이 없는 경우 기본 배경 표시
                  <div className="flex items-center justify-center w-full h-full bg-gray-300 text-gray-700">
                    No Image
                  </div>
                )}
              </div>
            ))}
          </div>
          <button
            className="absolute right-0 top-1/2 transform -translate-y-1/2 p-2 rounded"
            onClick={() => handlePageChange("next")}
          >
            &gt;
          </button>
          {/* 모달 컴포넌트 추가 */}
          <ActivitiesModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            activityId={selcetedID}
          />
        </div>
      </div>

      {/* Japanese Section */}
      <div className="japanese-section">
        <div className="flex justify-between items-center mb-4">
          <input
            type="text"
            placeholder="Search Japanese"
            className="border p-2 rounded w-full mb-4"
          />
          <button className="ml-4 bg-blue-500 text-white p-2 rounded w-10 h-10 flex items-center justify-center mb-4">
            +
          </button>
        </div>
        <div className="relative">
          <div className="relative">
            <button className="absolute left-0 top-1/2 transform -translate-y-1/2 p-2 rounded">
              &lt;
            </button>
            <div className="flex overflow-x-auto space-x-4 mx-auto w-[92%] justify-center">
              {japanese.map((japanese) => (
                <div
                  key={japanese.id}
                  className="w-full h-[20vh] bg-gray-200 flex flex-col text-left justify-center p-4"
                >
                  <h1 className="text-xl font-bold">{japanese.title}</h1>
                  <p className="text-sm text-gray-500">{japanese.email}</p>
                  <p className="text-sm text-gray-500">{japanese.date}</p>
                  <p className="text-sm">{japanese.content}</p>
                </div>
              ))}
            </div>
            <button className="absolute right-0 top-1/2 transform -translate-y-1/2 p-2 rounded">
              &gt;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Japan;
