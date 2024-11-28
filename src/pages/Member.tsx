import React, { useState, useEffect } from 'react';
import MemberCard from '../components/Member/MemberCard';

interface Member {
  id: number;
  name: string;
  role: string;
  comment: string;
  email: string;
  techStack: string[];
  profileImage: string | null;
}

const Member: React.FC = () => {
  const [members, setMembers] = useState<Member[]>([]);

  useEffect(() => {
    fetch('http://localhost:3001/members') // 백엔드 API 경로 확인
      .then((res) => res.json())
      .then((data) => {
        console.log('Fetched members:', data);
        setMembers(data);
      })
      .catch((err) => console.error('Error fetching members:', err));
  }, []);

  const addMember = () => {
    const newMember = {
      name: 'New Member',
      role: 'New Role',
      comment: 'Default comment',
      email: 'example@example.com',
      techStack: [],
      profileImage: null,
    };

    fetch('http://localhost:3001/members', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newMember),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log('Added member:', data);
        setMembers([...members, data]);
      })
      .catch((err) => console.error('Error adding member:', err));
  };

  const updateMember = (updatedMember: Member) => {
    setMembers((prevMembers) =>
      prevMembers.map((member) =>
        member.id === updatedMember.id ? updatedMember : member
      )
    );
  };

  return (
    <div className="p-12 -mt-10">
      <div className="flex flex-col gap-4">
        {members.map((member) => (
          <MemberCard
            key={member.id}
            memberData={member}
            onDelete={() => {
              setMembers(members.filter((m) => m.id !== member.id));
              fetch(`http://localhost:3001/members/${member.id}`, {
                method: 'DELETE',
              }).catch((err) => console.error('Error deleting member:', err));
            }}
            onUpdate={updateMember}
          />
        ))}
      </div>
      <div className="flex justify-center mt-8">
        <button
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