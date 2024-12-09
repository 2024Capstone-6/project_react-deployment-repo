import axios from 'axios'
import React from 'react'

const Add_Modal = (props: { 
  setModal: () => void,
  qid : string
  settoggle : () => void
}) => {
  return (
    <div
        className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
        onClick={()=>{props.setModal}}
      >
      <div
        className="bg-white p-8 rounded-lg shadow-lg w-[50%] h-auto max-w-full"
        onClick={(e) => e.stopPropagation()} // 모달 내부 클릭 시 닫히지 않도록 설정
      >
      <h3 className="text-2xl font-bold mb-6">실패!</h3>
          <button
            className="w-full h-auto bg-red-500 text-white py-3 rounded mb-4 hover:bg-red-600 transition"
            type='submit'
            onClick={async ()=>{
              props.setModal()
              props.settoggle()
            }}
          >
            NEXT
          </button>
      </div>
    </div>
  )
}

export default Add_Modal
