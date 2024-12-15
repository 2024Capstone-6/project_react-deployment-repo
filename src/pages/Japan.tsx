// 상태 관리와 생명주기 관리를 위한 React 훅
import { useState, useEffect } from "react";
import axios from "axios";

// 모달 컴포넌트
import ActivitiesModal from "../components/ActivitiesModal";
import JapaneseModal from "../components/JapaneseModal";

// 백엔드 API 엔드포인트
const API_BASE_URL = "http://localhost:3001";

// 페이지당 아이템 수
const ITEMS_PER_PAGE = 3;

// 각 콘텐츠 항목의 데이터 구조를 정의
interface ContentItem {
  id: number;
  email: string;
  date: string;
  // 선택적 속성
  title?: string;
  content?: string;
  mediaUrl?: string;
}

// 검색 및 생성 섹션 컴포넌트
const SearchCreateSection: React.FC<{
  placeholder: string; // 입력 필드의 힌트 텍스트를 정의
  onCreate: () => void; // 생성 버튼 클릭 시 호출되는 함수
  searchTerm: string; // 검색어
  onSearchChange: (value: string) => void; // 검색어 변경 시 호출되는 함수
}> = ({ placeholder, onCreate, searchTerm, onSearchChange }) => (
  <div className="flex justify-between items-center mb-4">
    <input
      type="text"
      placeholder={placeholder}
      value={searchTerm}
      onChange={(e) => onSearchChange(e.target.value)}
      className="border p-2 rounded w-full mb-4"
    />
    <button
      className="ml-4 bg-blue-500 text-white p-2 rounded w-10 h-10 flex items-center justify-center mb-4"
      onClick={onCreate}
    >
      +
    </button>
  </div>
);

// 메인 컴포넌트
const Japan: React.FC = () => {
  // 데이터의 현재 페이지를 저장
  const [activitiesPage, setActivitiesPage] = useState<number>(1);
  const [japanesePage, setJapanesePage] = useState<number>(1);

  // 모달의 열림 상태를 정의
  const [isActivitiesModalOpen, setIsActivitiesModalOpen] =
    useState<boolean>(false);
  const [isJapaneseModalOpen, setIsJapaneseModalOpen] =
    useState<boolean>(false);

  // 선택한 데이터의 ID를 저장
  const [selectedActivitiesId, setSelectedActivitiesId] = useState<
    number | null
  >(null);
  const [selectedJapaneseId, setSelectedJapaneseId] = useState<number | null>(
    null
  );

  // 데이터의 총 개수를 저장
  const [totalActivities, setTotalActivities] = useState<number>(0);
  const [totalJapanese, setTotalJapanese] = useState<number>(0);

  // 현재 사용자의 이메일 정보를 저장
  const [userEmail, setUserEmail] = useState<string>("");

  // 컴포넌트 마운트 시 세션스토리지에서 유저 정보 가져오기
  useEffect(() => {
    const email = sessionStorage.getItem("Email");
    if (!email) {
      window.location.href = "/login";
      return;
    }
    setUserEmail(email);
    fetchAllActivities();
    fetchAllJapanese();
  }, []);

  // 모든 데이터를 저장
  const [allActivities, setAllActivities] = useState<ContentItem[]>([]);
  const [allJapanese, setAllJapanese] = useState<ContentItem[]>([]);

  // 모든 활동 데이터를 불러와서 저장
  const fetchAllActivities = async () => {
    try {
      const response = await axios.get<ContentItem[]>(
        `${API_BASE_URL}/activities`
      );
      setAllActivities(response.data);
    } catch (error) {
      console.error("Error fetching all activities:", error);
    }
  };

  // 모든 일본어 데이터를 불러와서 저장
  const fetchAllJapanese = async () => {
    try {
      const response = await axios.get<ContentItem[]>(
        `${API_BASE_URL}/japanese`
      );
      setAllJapanese(response.data);
    } catch (error) {
      console.error("Error fetching all japanese:", error);
    }
  };

  // 활동 페이지네이션 데이터를 가져오는 함수
  const fetchPaginatedActivities = async (page: number) => {
    try {
      // 활동 데이터 리스트와 총 활동 데이터 수를 API 응답 데이터의 타입으로 명시
      const response = await axios.get<{ items: ContentItem[]; total: number }>(
        `${API_BASE_URL}/activities/page`,
        {
          // 페이지 번호와 페이지당 아이템 수를 포함한 쿼리 매개변수
          params: {
            page: page,
            limit: ITEMS_PER_PAGE,
          },
        }
      );
      setTotalActivities(response.data.total);
    } catch (error) {
      console.error("Error fetching paginated activities:", error);
      alert("활동 목록을 불러오는데 실패했습니다.");
    }
  };

  // 활동 목록을 새로고침하는 함수
  const refreshActivities = async () => {
    try {
      const response = await axios.get<{ items: ContentItem[]; total: number }>(
        `${API_BASE_URL}/activities/page`,
        {
          params: {
            page: activitiesPage,
            limit: ITEMS_PER_PAGE,
          },
        }
      );
      setTotalActivities(response.data.total);
      await fetchAllActivities(); // 전체 데이터 업데이트
    } catch (error) {
      console.error("Error fetching activities:", error);
      alert("활동 목록을 불러오는데 실패했습니다.");
    }
  };

  // 활동 생성 함수
  const handleCreateActivity = () => {
    if (!userEmail) {
      alert("로그인이 필요합니다.");
      return;
    }
    setSelectedActivitiesId(null);
    setIsActivitiesModalOpen(true);
  };

  // 활동 카드를 클릭 시 모달 열기
  const handleActivityClick = (id: number) => {
    setSelectedActivitiesId(id);
    setIsActivitiesModalOpen(true);
  };

  // 활동 모달 닫기 함수
  const handleActivitiesModalClose = async (isNewItem: boolean) => {
    setIsActivitiesModalOpen(false);
    await fetchAllActivities(); // 전체 데이터 새로고침

    if (isNewItem) {
      try {
        const response = await axios.get<{
          items: ContentItem[];
          total: number;
        }>(`${API_BASE_URL}/activities/page`, {
          params: {
            page: activitiesPage,
            limit: ITEMS_PER_PAGE,
          },
        });

        if (response.data.items.length === 0 && activitiesPage > 1) {
          setActivitiesPage((prev) => prev - 1);
        } else {
          await refreshActivities();
        }
      } catch (error) {
        console.error("Error checking page data:", error);
        alert("데이터 확인에 실패했습니다.");
      }
    }
  };

  // 활동의 페이지네이션 함수
  const handleActivitiesPagination = (direction: "prev" | "next") => {
    if (
      direction === "next" &&
      activitiesPage * ITEMS_PER_PAGE < filteredActivities.length
    ) {
      setActivitiesPage((prev) => prev + 1);
    } else if (direction === "prev" && activitiesPage > 1) {
      setActivitiesPage((prev) => prev - 1);
    }
  };

  // 일본어 목록을 불러오는 함수
  const fetchPaginatedJapanese = async (page: number) => {
    try {
      const response = await axios.get<{ items: ContentItem[]; total: number }>(
        `${API_BASE_URL}/japanese/page`,
        {
          params: {
            page: page,
          },
        }
      );
      setTotalJapanese(response.data.total);
    } catch (error) {
      console.error("Error fetching paginated japanese:", error);
      alert("게시물 목록을 불러오는데 실패했습니다.");
    }
  };

  // 일본어 목록을 새로고침하는 함수
  const refreshJapanese = async () => {
    try {
      // 일본어 데이터 리스트와 총 일본어 데이터 수를 API 응답 데이터의 타입으로 명시
      const response = await axios.get<{ items: ContentItem[]; total: number }>(
        `${API_BASE_URL}/japanese/page`,
        {
          params: {
            page: japanesePage,
          },
        }
      );
      setTotalJapanese(response.data.total);
    } catch (error) {
      console.error("Error fetching japanese:", error);
      alert("게시물 목록을 불러오는데 실패했습니다.");
    }
  };

  // 일본어 생성 함수
  const handleCreateJapanese = () => {
    if (!userEmail) {
      alert("로그인이 필요합니다.");
      return;
    }
    setSelectedJapaneseId(null);
    setIsJapaneseModalOpen(true);
  };

  // 일본어 카드를 클릭 시 모달 열기
  const handleJapaneseClick = (id: number) => {
    console.log(`Japanese ${id} clicked`);
    setSelectedJapaneseId(id);
    setIsJapaneseModalOpen(true);
  };

  // 일본어 모달 닫기 함수
  const handleJapaneseModalClose = async (isNewItem: boolean) => {
    setIsJapaneseModalOpen(false);
    await fetchAllJapanese(); // 전체 데이터 새로고침

    if (isNewItem) {
      try {
        const response = await axios.get<{
          items: ContentItem[];
          total: number;
        }>(`${API_BASE_URL}/japanese/page`, {
          params: {
            page: japanesePage,
          },
        });

        if (response.data.items.length === 0 && japanesePage > 1) {
          setJapanesePage((prev) => prev - 1);
        } else {
          await refreshJapanese();
        }
      } catch (error) {
        console.error("Error checking page data:", error);
        alert("데이터 확인에 실패했습니다.");
      }
    }
  };

  // 일본어의 페이지네이션 함수
  const handleJapanesePagination = (direction: "prev" | "next") => {
    if (direction === "next" && japanesePage * 1 < filteredJapanese.length) {
      setJapanesePage((prev) => prev + 1);
    } else if (direction === "prev" && japanesePage > 1) {
      setJapanesePage((prev) => prev - 1);
    }
  };

  // 페이지 변경 시 데이터 로드
  useEffect(() => {
    fetchPaginatedActivities(activitiesPage);
  }, [activitiesPage]);

  useEffect(() => {
    fetchPaginatedJapanese(japanesePage);
  }, [japanesePage]);

  // 검색어 상태 정의
  const [activitiesSearchTerm, setActivitiesSearchTerm] = useState<string>("");
  const [japaneseSearchTerm, setJapaneseSearchTerm] = useState<string>("");

  // 검색어에 따라 필터링된 활동 목록을 반환
  const filteredActivities = allActivities.filter((activity) => {
    const searchTerm = activitiesSearchTerm.toLowerCase();
    return (
      activity.email?.toLowerCase().includes(searchTerm) ||
      activity.title?.toLowerCase().includes(searchTerm)
    );
  });

  // 검색어에 따라 필터링된 일본어 게시물 목록을 반환
  const filteredJapanese = allJapanese.filter((japanese) => {
    const searchTerm = japaneseSearchTerm.toLowerCase();
    return (
      japanese.email?.toLowerCase().includes(searchTerm) ||
      japanese.title?.toLowerCase().includes(searchTerm)
    );
  });

  // 검색 결과 페이지네이션
  const getPaginatedResults = (
    items: ContentItem[],
    page: number,
    limit: number
  ) => {
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    return items.slice(startIndex, endIndex);
  };

  // 검색 결과 페이지네이션 데이터를 가져오는 함수
  const paginatedActivities = getPaginatedResults(
    filteredActivities,
    activitiesPage,
    ITEMS_PER_PAGE
  );
  const paginatedJapanese = getPaginatedResults(
    filteredJapanese,
    japanesePage,
    1
  );

  return (
    <div className="p-5 h-screen w-full m-auto">
      {/* Activities Section */}
      <div className="mb-8">
        <SearchCreateSection
          placeholder="Search Activities"
          onCreate={handleCreateActivity}
          searchTerm={activitiesSearchTerm}
          onSearchChange={setActivitiesSearchTerm}
        />
        <div className="relative h-[55vh]">
          {totalActivities === 0 ? (
            <div className="w-full h-full flex items-center justify-center bg-gray-100">
              <p className="text-gray-500">게시물이 존재하지 않습니다.</p>
            </div>
          ) : (
            <>
              <button
                className="absolute left-0 top-1/2 transform -translate-y-1/2 p-2 rounded"
                onClick={() => handleActivitiesPagination("prev")}
              >
                &lt;
              </button>
              <div className="flex overflow-x-auto space-x-4 mx-auto w-[calc(100%-1rem)] justify-center">
                {paginatedActivities.map((activity) => (
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
                className={`absolute right-0 top-1/2 transform -translate-y-1/2 p-2 rounded ${
                  activitiesPage * ITEMS_PER_PAGE >= totalActivities
                    ? "text-gray-300"
                    : ""
                }`}
                onClick={() => handleActivitiesPagination("next")}
                disabled={activitiesPage * ITEMS_PER_PAGE >= totalActivities}
              >
                &gt;
              </button>
            </>
          )}
          {/* 모달 컴포넌트 추가 */}
          <ActivitiesModal
            isOpen={isActivitiesModalOpen}
            onClose={handleActivitiesModalClose}
            activityId={selectedActivitiesId}
            userEmail={userEmail}
            refreshActivities={refreshActivities} // 새로운 prop 추가
          />
        </div>
      </div>

      {/* Japanese Section */}
      <div className="japanese-section">
        <SearchCreateSection
          placeholder="Search Japanese"
          onCreate={handleCreateJapanese}
          searchTerm={japaneseSearchTerm}
          onSearchChange={setJapaneseSearchTerm}
        />
        <div className="relative h-[20vh]">
          {totalJapanese === 0 ? (
            <div className="w-full h-full flex items-center justify-center bg-gray-100">
              <p className="text-gray-500">게시물이 존재하지 않습니다.</p>
            </div>
          ) : (
            <>
              <button
                onClick={() => handleJapanesePagination("prev")}
                className="absolute left-0 top-1/2 transform -translate-y-1/2 p-2 rounded"
              >
                &lt;
              </button>
              <div className="flex overflow-x-auto space-x-4 mx-auto w-[92%] justify-center">
                {paginatedJapanese.map((japanese) => (
                  <div
                    key={japanese.id}
                    className="w-full h-[20vh] bg-gray-200 flex flex-col text-left justify-center p-4 cursor-pointer"
                    onClick={() => handleJapaneseClick(japanese.id)}
                  >
                    <h1 className="text-xl font-bold">{japanese.title}</h1>
                    <p className="text-sm text-gray-500">{japanese.email}</p>
                    <p className="text-sm text-gray-500">{japanese.date}</p>
                    <p className="text-sm whitespace-pre-wrap overflow-hidden">
                      {japanese.content}
                    </p>
                  </div>
                ))}
              </div>
              <button
                className={`absolute right-0 top-1/2 transform -translate-y-1/2 p-2 rounded ${
                  japanesePage >= totalJapanese ? "text-gray-300" : ""
                }`}
                onClick={() => handleJapanesePagination("next")}
                disabled={japanesePage >= totalJapanese}
              >
                &gt;
              </button>
            </>
          )}
        </div>
        {/* Japanese 모달 컴포넌트 추가 */}
        <JapaneseModal
          isOpen={isJapaneseModalOpen}
          onClose={handleJapaneseModalClose}
          japaneseId={selectedJapaneseId}
          userEmail={userEmail}
          refreshJapanese={refreshJapanese}
        />
      </div>
    </div>
  );
};

export default Japan;
