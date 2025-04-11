import React, { useEffect, useState, useTransition } from 'react'
import { deletePost, getPost } from '../api/PostApi'
import Form from './Form'

const Posts = () => {
  const [data, setData] = useState([])
  const [updateDataApi, setUpdataDataApi] = useState({})
  const [deletingId, setDeletingId] = useState(null)
  const [isPending, startTransition] = useTransition()
  const [loading, setLoading] = useState(true)


  // Get posts
  const getPostData = async () => {
    try {
      const res = await getPost()
      setData(res.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)  // Done loading
    }
  }


  useEffect(() => {
    getPostData()
  }, [])

  // Delete post
  const handleDeletePost = (id) => {
    setDeletingId(id)
    startTransition(async () => {
      try {
        // Simulate delay
        await new Promise((resolve) => setTimeout(resolve, 2000))

        const res = await deletePost(id)
        if (res.status === 200) {
          const updated = data.filter(post => post.id !== id)
          setData(updated)
        } else {
          console.log('Failed to delete:', res.status)
        }
      } catch (err) {
        console.log(err)
      } finally {
        setDeletingId(null)
      }
    })
  }

  const handleUpdatePost = (curElem) => setUpdataDataApi(curElem)

  return (
    <div className="min-h-screen bg-[#1e293b] p-8">
      {loading && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0f172a]/80 text-white backdrop-blur-sm">
          <div className="w-10 h-10 border-4 border-white border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-lg font-semibold animate-pulse tracking-wide">Please wait...</p>
        </div>
      )}

      <section>
        <Form
          data={data}
          setData={setData}
          updateDataApi={updateDataApi}
          setUpdataDataApi={setUpdataDataApi}
        />
      </section>

      <ol className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 list-decimal list-inside text-white">
        {data.map(({ id, title, body }) => {
          const isDeleting = isPending && deletingId === id

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

              <div className="flex space-x-3 items-center">
                <button
                  onClick={() => handleUpdatePost({ id, title, body })}
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-1 rounded"
                >
                  EDIT
                </button>

                <button
                  disabled={isDeleting}
                  onClick={() => handleDeletePost(id)}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded flex items-center gap-2"
                >
                  {isDeleting && (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  )}
                  DELETE
                </button>

              </div>
            </li>
          )
        })}
      </ol>
    </div>
  )
}

export default Posts
