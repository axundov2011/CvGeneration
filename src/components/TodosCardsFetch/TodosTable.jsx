import styles from './todosTable.module.css'

const columns = ['Task', 'User ID', 'Completed', 'Actions']

const TodosTable = ({ todos, onRemove }) => {
  return (
    <section className={styles.tableCard} aria-label="Added todos">
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              {columns.map((column) => (
                <th key={column} scope="col">{column}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {todos.length === 0 ? (
              <tr>
                <td className={styles.emptyState} colSpan={columns.length}>
                  No todos added yet.
                </td>
              </tr>
            ) : todos.map((todo) => (
              <tr key={todo.id}>
                <td>{todo.todo}</td>
                <td>{todo.userId}</td>
                <td>{todo.completed ? 'Completed' : 'Not Completed'}</td>
                <td>
                  <button
                    className={styles.removeButton}
                    type="button"
                    onClick={() => onRemove(todo.id)}
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}

export default TodosTable
