import { useState } from 'react'
import styles from './formUser.module.css'

const UpdateCard = ({ user, onClose, onSave }) => {
  const [fullName, setFullName] = useState(user.fullName)
  const [nickName, setNickName] = useState(user.nickName)
  const [age, setAge] = useState(String(user.age))

  const handleSubmit = (event) => {
    event.preventDefault()
    onSave({ ...user, fullName, nickName, age })
  }

  return (
    <div className={styles.modalBackdrop} onMouseDown={(event) => {
      if (event.target === event.currentTarget) onClose()
    }}>
      <section
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-user-title"
      >
        <div className={styles.modalHeader}>
          <h2 id="edit-user-title">Update User</h2>
          <button className={styles.closeButton} type="button" onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>
        <form className={styles.form} onSubmit={handleSubmit}>
          <input
            className={styles.input}
            type="text"
            placeholder="FullName"
            value={fullName}
            onChange={(event) => setFullName(event.target.value)}
            autoFocus
          />
          <input
            className={styles.input}
            type="text"
            placeholder="NickName"
            value={nickName}
            onChange={(event) => setNickName(event.target.value)}
          />
          <input
            className={styles.input}
            type="number"
            placeholder="Age"
            min="1"
            max="120"
            value={age}
            onChange={(event) => setAge(event.target.value)}
          />
          <div className={styles.modalActions}>
            <button className={styles.editButton} type="submit">Save changes</button>
            <button className={styles.removeButton} type="button" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </section>
    </div>
  )
}

export default UpdateCard
