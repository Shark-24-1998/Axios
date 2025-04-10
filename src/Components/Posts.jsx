import React, { useEffect, useState } from 'react'
import { deletePost, getPost } from '../api/PostApi'
import Form from './Form'

const Posts = () => {
  const [data, setData] = useState([])
  const [updateDataApi , setUpdataDataApi] = useState({})

  //Get Post 
  const getPostData = async () => {
    const res = await getPost()
    setData(res.data)
    console.log(res.data)
  }

  useEffect(() => {
    getPostData()
  }, [])

  //Delete Post 
  const handleDeletePost =async (id)=>{
    
    try{
        const res = await deletePost(id)
        console.log(res)
        if(res.status === 200){
            const newUpdatedPosts = data.filter((curPost) =>{
                return curPost.id !== id
            })
            setData(newUpdatedPosts)
        }else{
            console.log('Failed to delete the post : ' , res.status)
        }
    }catch(error){
            console.log(error)
    }
  }

//handle update post
const handleUpdatePost = (curElem)=> setUpdataDataApi(curElem)
  

  return (
    <>
      <div className="min-h-screen bg-[#1e293b] p-8">
      <section>
        <Form data = {data} setData = {setData} updateDataApi = {updateDataApi} setUpdataDataApi = {setUpdataDataApi} />
    </section>
        <ol className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 list-decimal list-inside text-white">
          {
            data.map((curElem) => {
              const { id, title, body } = curElem
              return (
                <li
                  key={id}
                  className="bg-[#1e293b] border border-gray-700 rounded-lg p-5 shadow-md transform transition-transform duration-300 hover:scale-105 hover:shadow-lg"
                >
                  <p className="text-sm font-bold text-gray-300 mb-1">
                    Title: <span className="text-white">{title}</span>
                  </p>
                  <p className="text-sm text-gray-400 mb-4">
                    Body: <span className="text-white">{body}</span>
                  </p>
                  <div className="flex space-x-3">
                    <button onClick={() => handleUpdatePost(curElem)}
                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-1 rounded">EDIT</button>
                    <button onClick={() => handleDeletePost(id)} className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded">DELETE</button>
                  </div>
                </li>
              )
            })
          }
        </ol>
      </div>
    </>
  )
}

export default Posts
