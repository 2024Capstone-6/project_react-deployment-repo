import { useState, useEffect } from "react";

interface Activity {
  id: number;
  mediaUrl: string;
}

const Japan: React.FC = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [page, setPage] = useState<number>(1);

  const limit = 3;

  // 페이지네이션 데이터를 가져오는 함수
  const fetchPaginatedPosts = async (page: number) => {
    try {
      const response = await fetch(`http://localhost:3001/activities/page?page=${page}&limit=${limit}`);
      const data = await response.json();
      if (response.ok) {
        setActivities(data);
      } else {
        console.error('Error fetching paginated posts:', data.message);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  // 페이지 변경 시 데이터 로드
  useEffect(() => {
    fetchPaginatedPosts(page);
  }, [page]);

  const handlePageChange = (direction: 'prev' | 'next') => {
    setPage((prevPage) => (direction === 'next' ? prevPage + 1 : Math.max(prevPage - 1, 1)));
  };

  const handleCardClick = (id: number) => {
    console.log(`Card ${id} clicked`);
  };

  return (
    <div className="japan p-5 h-screen w-full m-auto">
      {/* Activities Section */}
      <div className="activities-section mb-8">
        <div className="search-activities flex justify-between items-center mb-4">
          <input
            type="text"
            placeholder="Search Activities"
            className="border p-2 rounded w-full mb-4"
          />
          <button
            className="ml-4 bg-blue-500 text-white p-2 rounded w-10 h-10 flex items-center justify-center mb-4"
          >
            +
          </button>
        </div>
        <div className="activities-container relative">
          <button
            className="absolute left-0 top-1/2 transform -translate-y-1/2 p-2 rounded"
            onClick={() => handlePageChange('prev')}
          >
            &lt;
          </button>
          <div className="flex overflow-x-auto space-x-4 mx-auto w-[calc(100%-1rem)] justify-center">
          {activities.map((activity) => (
            <div
              key={activity.id}
              className="w-[30%] h-[55vh] bg-gray-200 flex-shrink-0 overflow-hidden relative"
              onClick={() => handleCardClick(activity.id)}
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
            onClick={() => handlePageChange('next')}
          >
            &gt;
          </button>
        </div>
      </div>

      {/* Japanese Section */}
      <div className="japanese-section">
        <div className="search-japanese flex justify-between items-center mb-4">
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
            <button
              className="absolute left-0 top-1/2 transform -translate-y-1/2 p-2 rounded"
            >
              &lt;
            </button>
            <div className="flex overflow-x-auto space-x-4 mx-auto w-[92%] justify-center">
              <textarea
                className="w-full h-[200px] bg-gray-200 flex-shrink-0 p-2"
                placeholder="Large text box"
              />
            </div>
            <button
              className="absolute right-0 top-1/2 transform -translate-y-1/2 p-2 rounded"
            >
              &gt;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Japan;