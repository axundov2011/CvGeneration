import { useEffect, useRef, useState } from 'react'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import styles from './formUser.module.css'
import UpdateCard from './UpdateCard'

const STORAGE_KEY = 'users'

const validateUser = ({ fullName, nickName, age }) => {
  if (!fullName.trim() || !nickName.trim() || !String(age).trim()) {
    return 'Please complete all fields.'
  }
  if (fullName.trim().length < 2) {
    return 'Full name must contain at least 2 characters.'
  }
  if (nickName.trim().length < 2) {
    return 'Nickname must contain at least 2 characters.'
  }
  if (!/^\d+$/.test(String(age)) || Number(age) < 1 || Number(age) > 120) {
    return 'Age must be a whole number between 1 and 120.'
  }
  return ''
}

const loadStoredUsers = () => {
  try {
    const savedUsers = localStorage.getItem(STORAGE_KEY)
    if (savedUsers === null) {
      return { users: [], canWrite: true, error: null }
    }

    const parsedUsers = JSON.parse(savedUsers)
    if (!Array.isArray(parsedUsers)) {
      throw new Error('Stored users data is not an array.')
    }

    return {
      users: parsedUsers.map((user) => ({
        ...user,
        id: user.id || crypto.randomUUID(),
      })),
      canWrite: true,
      error: null,
    }
  } catch (error) {
    console.error('Unable to load users from local storage.', error)
    return { users: [], canWrite: false, error }
  }
}

const FormUser = () => {
  const [storedUsers] = useState(loadStoredUsers)
  const [cartItems, setCartItems] = useState(storedUsers.users)
  const [fullName, setFullName] = useState('')
  const [nickName, setNickName] = useState('')
  const [age, setAge] = useState('')
  const [show, setShow] = useState(false)
  const [editedItem, setEditedItem] = useState(null)
  const storageWritable = useRef(storedUsers.canWrite)

  useEffect(() => {
    if (storedUsers.error) {
      toast.error('Saved users could not be loaded. You can still add users for this session.')
    }
  }, [storedUsers.error])

  useEffect(() => {
    if (!storageWritable.current) return

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cartItems))
    } catch (error) {
      console.error('Unable to save users to local storage.', error)
      toast.error('Users could not be saved to local storage.')
      storageWritable.current = false
    }
  }, [cartItems])

  const handleSubmit = (event) => {
    event.preventDefault()
    const newUser = {
      id: crypto.randomUUID(),
      fullName: fullName.trim(),
      nickName: nickName.trim(),
      age: Number(age),
    }
    const validationError = validateUser(newUser)

    if (validationError) {
      toast.error(validationError)
      return
    }

    setCartItems((currentItems) => [...currentItems, newUser])
    storageWritable.current = true
    setFullName('')
    setNickName('')
    setAge('')
    toast.success('User added successfully.')
  }

  const handleRemoveAllUsers = () => {
    if (cartItems.length === 0) {
      toast.info('There are no users to remove.')
      return
    }
    setCartItems([])
    storageWritable.current = true
    toast.success('All users removed.')
  }

  const handleEditUser = (user) => {
    setEditedItem(user)
    setShow(true)
  }

  const handleUpdateUser = (updatedUser) => {
    const validationError = validateUser(updatedUser)
    if (validationError) {
      toast.error(validationError)
      return false
    }

    storageWritable.current = true
    setCartItems((currentItems) => currentItems.map((user) =>
      user.id === updatedUser.id
        ? { ...updatedUser, fullName: updatedUser.fullName.trim(), nickName: updatedUser.nickName.trim(), age: Number(updatedUser.age) }
        : user
    ))
    setShow(false)
    setEditedItem(null)
    toast.success('User updated successfully.')
    return true
  }

  const handleRemoveUser = (id) => {
    setCartItems((currentItems) => currentItems.filter((user) => user.id !== id))
    storageWritable.current = true
    toast.success('User removed.')
  }

  const handleCloseModal = () => {
    setShow(false)
    setEditedItem(null)
  }

  return (
    <main className={styles.page}>
      <section className={styles.content}>
        <h1 className={styles.title}>Add User</h1>

        <form className={styles.form} onSubmit={handleSubmit}>
          <input
            className={styles.input}
            type="text"
            name="fullName"
            placeholder="FullName"
            value={fullName}
            onChange={(event) => setFullName(event.target.value)}
          />
          <input
            className={styles.input}
            type="text"
            name="nickName"
            placeholder="NickName"
            value={nickName}
            onChange={(event) => setNickName(event.target.value)}
          />
          <input
            className={styles.input}
            type="number"
            name="age"
            placeholder="Age"
            min="1"
            max="120"
            value={age}
            onChange={(event) => setAge(event.target.value)}
          />

          <div className={styles.formActions}>
            <button className={styles.addButton} type="submit">Add User</button>
            <button className={styles.removeAllButton} type="button" onClick={handleRemoveAllUsers}>
              Remove All
            </button>
          </div>
        </form>

        {cartItems.length > 0 ? (
          <div className={styles.userList}>
            {cartItems.map((user) => (
              <article className={styles.userCard} key={user.id}>
                <p><strong>FullName :</strong> {user.fullName}</p>
                <p><strong>NickName :</strong> {user.nickName}</p>
                <p><strong>Age :</strong> {user.age}</p>
                <div className={styles.cardActions}>
                  <button className={styles.editButton} type="button" onClick={() => handleEditUser(user)}>
                    Edit
                  </button>
                  <button className={styles.removeButton} type="button" onClick={() => handleRemoveUser(user.id)}>
                    Remove
                  </button>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <p className={styles.emptyState}>No users added yet.</p>
        )}
      </section>

      {show && editedItem && (
        <UpdateCard
          user={editedItem}
          onClose={handleCloseModal}
          onSave={handleUpdateUser}
        />
      )}
      <ToastContainer position="top-right" autoClose={2500} />
    </main>
  )
}

export default FormUser
