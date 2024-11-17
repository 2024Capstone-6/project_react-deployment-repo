import React from 'react';

const Japan: React.FC = () => {
  const handleCardClick = (id: number) => {
    console.log(`Card ${id} clicked`);
  };

  const handleScroll = (direction: 'left' | 'right', section: 'activities' | 'japanese') => {
    console.log(`Scroll ${direction} in ${section} section`);
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
          <button className="ml-4 bg-blue-500 text-white p-2 rounded w-10 h-10 flex items-center justify-center mb-4">+</button>
        </div>
        <div className="activities-container relative">
          <button
            className="absolute left-0 top-1/2 transform -translate-y-1/2 p-2 rounded"
            onClick={() => handleScroll('left', 'activities')}
          >
            &lt;
          </button>
          <div className="flex overflow-x-auto space-x-4 mx-auto w-[calc(100%-1rem)] justify-center">
            {[1, 2, 3].map((id) => (
              <div
                key={id}
                className="w-[30%] h-[55vh] bg-gray-200 flex-shrink-0"
                onClick={() => handleCardClick(id)}
              >
                Card {id}
              </div>
            ))}
          </div>
          <button
            className="absolute right-0 top-1/2 transform -translate-y-1/2 p-2 rounded"
            onClick={() => handleScroll('right', 'activities')}
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
          <button className="ml-4 bg-blue-500 text-white p-2 rounded w-10 h-10 flex items-center justify-center mb-4">+</button>
        </div>
        <div className="relative">
          <div className="relative">
            <button
              className="absolute left-0 top-1/2 transform -translate-y-1/2 p-2 rounded"
              onClick={() => handleScroll('left', 'japanese')}
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
              onClick={() => handleScroll('right', 'japanese')}
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