import { FaRegThumbsDown, FaRegThumbsUp } from 'react-icons/fa'
import styles from './Comments.module.css'
import { useEffect, useState } from 'react'
import axios from 'axios'

const Comments = () => {
  const [commentList, setCommentList] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await axios.get('https://dummyjson.com/comments')
        setCommentList(response.data.comments)
      } catch (fetchError) {
        console.error('Failed to fetch comments:', fetchError)
        setError('Comments could not be loaded. Please try again.')
      }
    }

    fetchComments()
  }, [])

  const handleLike = (id) => {
    setCommentList((previousComments) =>
      previousComments.map((comment) => (
        comment.id === id
          ? { ...comment, likes: (comment.likes || 0) + 1 }
          : comment
      ))
    )
  }

  return (
    <main className={styles.page}>
      <section className={styles.comments} aria-labelledby="comments-title">
        <h1 className={styles.title} id="comments-title">Comments</h1>

        {error ? (
          <p className={styles.author} role="alert">{error}</p>
        ) : (
          <div className={styles.list}>
            {commentList.map((comment) => (
              <article className={styles.comment} key={comment.id}>
                <div className={styles.commentContent}>
                  <h2 className={styles.commentText}>{comment.body}</h2>
                  <p className={styles.author}>By: {comment.user?.fullName || 'Unknown user'}</p>
                </div>

                <div className={styles.reactions} aria-label="Comment reactions">
                  <button
                    className={styles.reaction}
                    type="button"
                    aria-label={`${comment.likes || 0} likes`}
                    onClick={() => handleLike(comment.id)}
                  >
                    <FaRegThumbsUp aria-hidden="true" />
                    <span>{comment.likes || 0}</span>
                  </button>
                  <button className={styles.reaction} type="button" aria-label={`${comment.dislikes || 0} dislikes`}>
                    <FaRegThumbsDown aria-hidden="true" />
                    <span>{comment.dislikes || 0}</span>
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  )
}

export default Comments
