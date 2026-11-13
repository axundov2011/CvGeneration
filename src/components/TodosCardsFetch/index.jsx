import { useEffect, useState } from 'react'
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import styles from './todosCards.module.css'
import TodosTable from './TodosTable'

const TodosCardsFetch = () => {
  const [todos, setTodos] = useState([])
  const [addedTodos, setAddedTodos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const response = await axios.get('https://dummyjson.com/todos')
        setTodos(response.data.todos)
      } catch (fetchError) {
        console.error('Failed to fetch todos:', fetchError)
        setError('Todos could not be loaded. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    fetchTodos()
  }, [])

  const handleAddTodo = (todo) => {
    setAddedTodos((currentTodos) => (
      currentTodos.some((item) => item.id === todo.id)
        ? currentTodos
        : [...currentTodos, todo]
    ))
    toast.success('Todo added successfully!')

  }

  const handleRemoveTodo = (todoId) => {
    setAddedTodos((currentTodos) => currentTodos.filter((todo) => todo.id !== todoId))
  }

  return (
    <main className={styles.page}>
      <section className={styles.board} aria-labelledby="todos-title">
        <h1 className={styles.title} id="todos-title">Todos</h1>

        {loading && <p className={styles.message}>Loading todos...</p>}
        {!loading && error && <p className={styles.message}>{error}</p>}

        {!loading && !error && (
          <div className={styles.grid}>
            {todos.map((todo) => {
              const isAdded = addedTodos.some((item) => item.id === todo.id)

              return (
                <article
                  className={`${styles.card} ${todo.completed ? styles.completed : styles.pending}`}
                  key={todo.id}
                >
                  <p className={styles.task}>{todo.todo}</p>
                  <span className={styles.status}>
                    {todo.completed ? 'Completed' : 'Not Completed'}
                  </span>
                  <button
                    className={`${styles.button} ${isAdded ? styles.addedButton : ''}`}
                    type="button"
                    onClick={() => handleAddTodo(todo)}
                    disabled={isAdded}
                  >
                    {isAdded ? 'Added' : 'Add'}
                  </button>
                </article>
              )
            })}
          </div>
        )}
      </section>

      <TodosTable todos={addedTodos} onRemove={handleRemoveTodo} />
      <ToastContainer position="top-right" autoClose={2500} />
    </main>
  )
}

export default TodosCardsFetch
