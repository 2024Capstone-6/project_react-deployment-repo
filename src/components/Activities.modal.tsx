import { useState } from "react";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
}

const ActivitiesModal: React.FC<Omit<ModalProps, 'children'>> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-4 rounded-lg">
                <div>여기에 모달 내용을 작성하세요</div>
            </div>
        </div>
    );
};

export default ActivitiesModal;