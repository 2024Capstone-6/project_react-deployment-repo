import axios from 'axios'
import React from 'react'


const Special = () => {

  function checkAnswer(answer : string){
    const question = axios.get('localhost:')
  }

  return (
    <div>
      <div className='Question'>문제 박스</div>
      <form onSubmit={(e)=>{
        e.preventDefault()
        const answer = e.currentTarget.answer.value // input창의 값 읽어옴.
        console.log(answer)

      }}
      >
        <input style={{
          border:'solid 1px black',
          borderRadius:'10px'
        }}
        name='answer'
        />
        <button type='submit' style={{border:'solid 1px black', marginLeft:'.5%'}}>제출</button>
      </form>
    </div>
  )
}

export default Special