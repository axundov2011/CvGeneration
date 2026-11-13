import styles from './DataUsers.module.css'
import { useState, useEffect } from 'react'
import { columns } from '../../mock/usersData'
import axios from 'axios'

const DataUsers = () => {
    const [usersData, setUsersData] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get('https://dummyjson.com/users')
                setUsersData(response.data.users)

            } catch (fetchError) {
                setError('Users could not be loaded. Please try again.')
                console.error('Failed to fetch users:', fetchError)
            } finally {
                setLoading(false)
            }
        }

        fetchUsers()
    }, [])

    return (
        <main className={styles.page}>
            <section className={styles.tableCard} aria-label="Users table">
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
                            {loading && (
                                <tr>
                                    <td className={styles.status} colSpan={columns.length}>Loading users...</td>
                                </tr>
                            )}
                            {!loading && error && (
                                <tr>
                                    <td className={styles.status} colSpan={columns.length}>{error}</td>
                                </tr>
                            )}
                            {!loading && !error && usersData.map((user, index) => (
                                <tr key={user.id}>
                                    <td>{index + 1}</td>
                                    <td>{user.firstName}</td>
                                    <td>{user.lastName}</td>
                                    <td>{user.email}</td>
                                    <td>{user.phone}</td>
                                    <td>{user.age}</td>
                                    <td>{user.role}</td>
                                    <td>{user.address?.address}</td>
                                    <td>{user.company?.department}</td>
                                    <td>{user.bank?.cardNumber}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>
        </main>
    )
}

export default DataUsers
