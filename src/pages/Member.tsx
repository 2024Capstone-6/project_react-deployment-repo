import React, { useState, useEffect } from 'react';
import MemberCard from '../components/Member/MemberCard';

// 멤버 객체의 타입을 정의한 인터페이스
// interface: 객체의 구조를 정의
interface Member {
  id: number; // 멤버의 고유 ID
  name: string; // 멤버 이름
  role: string; // 멤버 역할
  comment: string; // 멤버 코멘트
  email: string; // 멤버 이메일
  techStack: string[]; // 멤버 기술 스택, 문자열 배열
  profileImage: string | null; // 프로필 이미지, null 허용
}

// Member 페이지 컴포넌트: 멤버 리스트를 관리하고 화면에 표시
const Member: React.FC = () => {
  const [members, setMembers] = useState<Member[]>([]); // 멤버 데이터 상태

  // 데이터 가져오기: 백엔드에서 멤버 데이터를 가져옴
  // 컴포넌트가 처음 렌더링될 때 실행
  useEffect(() => {
    // fetch를 호출, 멤버 데이터를 백엔드에서 가져옴
    // fetch: 데이터를 가져오거나 서버와 통신할 때 사용, 비동기 함수
    // http://localhost:3001/members에 GET 요청
    fetch('http://localhost:3001/members')
      // res: Response 객체, 서버로부터 받은 HTTP 응답
      // json(): 응답 본문을 JSON 형식으로 변환
      .then((res) => res.json())
      // data: 서버에서 응답한 JSON 데이터, 배열
      .then((data) => {
        // 가져온 데이터 출력
        console.log('Fetched members:', data);
        setMembers(data); // 가져온 데이터를 상태에 저장
      })
      // 에러 발생 시 오류 출력
      .catch((err) => console.error('Error fetching members:', err));
  }, []);

  // 새로운 멤버 추가
  const addMember = async () => {
    // 새로운 멤버 추가 시 사용할 초기 데이터 객체
    const newMember = {
      name: '',
      role: '',
      comment: '',
      email: '',
      techStack: [],
      // 기본 프로필 이미지 URL
      profileImage: 'https://www.yju.ac.kr/sites/kr/images/img_symbol_mark.png',
    };

    try {
      // 서버로 POST 요청
      const response = await fetch('http://localhost:3001/members', {
        method: 'POST',
        headers: {
          // 요청 본문이 JSON임을 서버에 알려줌
          'Content-Type': 'application/json',
        },
        // newMember 객체를 JSON 문자열로 변환하여 서버에 전송
        body: JSON.stringify(newMember),
      });
      // 실패 시
      if (!response.ok) {
        // 오류 메시지 출력 후 함수 종료
        console.error('Failed to add member');
        return;
      }
      // 서버에서 반환한 JSON 데이터를 JavaScript 객체로 변환
      // 새로 추가된 멤버의 데이터
      const addedMember = await response.json();

      // 기존 members에 새로 추가된 멤버를 포함
      // prevMembers: 기존 멤버, addedMember: 기존 멤버 배열에 새 멤버 추가
      setMembers((prevMembers) => [...prevMembers, addedMember]);
    } catch (err) { // 에러 발생 시 에러 메시지 출력
      console.error('Error adding member:', err);
    }
  };

  // 멤버 업데이트
  // updatedMember: 수정된 멤버 데이터 객체, Member 타입에 맞는 데이터 구조
  const updateMember = (updatedMember: Member) => {
    // 상태를 업데이트하여 수정된 멤버 정보를 반영
    setMembers((prevMembers) =>
      // 기존 배열을 순회
      prevMembers.map((member) =>
        // member.id가 수정된 멤버 id와 같다면 수정된 정보로 교체
        // 다르다면 기존 정보 유지
        member.id === updatedMember.id ? updatedMember : member
      )
    );
  };

  // 화면 렌더링
  return (
    <div className="p-12 -mt-10">
      <div className="flex flex-col gap-4">
        {/* members 배열의 각 요소를 순회하며 컴포넌트 렌더링 */}
        {/* members: Member 타입 객체 배열 */}
        {/* member: 배열의 각 요소, 각 멤버 데이터 */}
        {members.map((member) => (
          <MemberCard
            key={member.id} // 각 멤버의 ID를 MemberCard에 전달
            memberData={member} // 각 멤버의 데이터를 MemberCard에 전달
            // 삭제 핸들러 함수
            onDelete={() => {
              // filter(): 조건을 만족하는 요소만 반환, 반환 값: 새로운 배열
              // m: 현재 순회중인 members 배열의 요소, Member 타입
              // m.id가 삭제하려는 멤버의 ID와 다르면 새 배열에 포함
              setMembers(members.filter((m) => m.id !== member.id));
              // 
              fetch(`http://localhost:3001/members/${member.id}`, {
                method: 'DELETE',
              }).catch((err) => console.error('Error deleting member:', err));
            }}
            // 업데이트 핸들러 함수
            onUpdate={updateMember}
          />
        ))}
      </div>
      <div className="flex justify-center mt-8">
        {/* 멤버 추가 버튼 */}
        <button
          // 클릭 시 addMember 함수 호출
          onClick={addMember}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Add Member
        </button>
      </div>
    </div>
  );
};

export default Member;