import React, { useEffect, useState } from 'react'
import { getAllPost } from '../services/post'

export default function Post() {

  const [page, setPage] = useState(1)
  const [posts, setPosts] = useState([])
  const [totalPages, setTotalPages] = useState(1)

  const fetchPost = async () => {
    try{

      const data = await getAllPost(page, 10)
      setPosts(data.data || [])
      setTotalPages(data.totalPages || 1)

    }catch(err){
      console.error(err)
    }
  }
// Initialy run with Post Page -> run
// After page use state changes -> run
  useEffect(() => {
    fetchPost()
  }, [page])

  return (
    <div>
      <h2>All Post</h2>
      <div>
        {posts?.map((post:any) => (
          <div>
            <h3>{post?.title}</h3>
            <p>{post?.content}</p>
            {post?.tags?.map((tags:any) => (
              <span>{tags}</span>
            ))}
            {post?.imageURL && <img src = {post.imageURL} alt = {post?.title}/>}
          </div>
        ))}
      </div>
      <div>
        <button
          disabled = {page === 1}
          onClick={() => {
            if(page > 1) setPage(page-1)
          }}
        >
          Prev
        </button>
        <span>
          Page {page} of {totalPages}
        </span>
        <button
          disabled = {page === totalPages}
          onClick={() => {
            if(page < totalPages) setPage(page+1)
          }}
        >
          Next
        </button>
      </div>
    </div>
  )
}
