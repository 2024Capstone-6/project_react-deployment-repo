import React, { useState } from 'react';
import MemberCard from '../components/Member/MemberCard';

const Member: React.FC = () => {
  const [members, setMembers] = useState([
    { id: 1, name: '', role: '', comment: '', email: '', techStack: [] as string[] },
  ]);

  // Add new member
  const addMember = () => {
    const newMember = {
      id: Date.now(),
      name: '',
      role: '',
      comment: '',
      email: '',
      techStack: [] as string[],
    };
    setMembers([...members, newMember]);
  };

  // Delete member by id
  const deleteMember = (id: number) => {
    setMembers(members.filter((member) => member.id !== id));
  };

  return (
    <div className="p-12 -mt-10">
      <div className="flex flex-col gap-4">
        {members.map((member) => (
          <MemberCard
            key={member.id}
            onDelete={() => deleteMember(member.id)}
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