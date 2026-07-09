import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import Loader from "../../components/common/Loader";
import ErrorMessage from "../../components/common/ErrorMessage";
import UserService from "../../services/UserService";
import { useAuth } from "../../context/AuthContext";
import "../../styles/Table.css";

function UserList() {

    const { user: currentUser } = useAuth();

    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        loadUsers();
    }, []);

    async function loadUsers() {
        setLoading(true);
        setError("");
        try {
            const response = await UserService.getAllUsers();
            setUsers(response.data);
        } catch (err) {
            console.log(err);
            setError("Unable to load users.");
        } finally {
            setLoading(false);
        }
    }

    async function handleDelete(userId) {
        if (!window.confirm("Delete this user? This cannot be undone.")) return;
        try {
            await UserService.deleteUser(userId);
            setUsers((prev) => prev.filter((u) => u.userId !== userId));
        } catch (err) {
            console.log(err);
            alert("Unable to delete user.");
        }
    }

    return (
        <>
            <Navbar />

            <div className="container">
                <div className="list-header">
                    <h2 className="title">Manage Users</h2>
                    <Link to="/register-user" className="btn btn-primary">
                        + Add User
                    </Link>
                </div>

                <ErrorMessage message={error} />

                {loading ? (
                    <Loader label="Loading users..." />
                ) : users.length === 0 ? (
                    <p className="empty-state">No users found.</p>
                ) : (
                    <table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Role</th>
                                <th>Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {users.map((u) => (
                                <tr key={u.userId}>
                                    <td>{u.userId}</td>
                                    <td>{u.name}</td>
                                    <td>{u.email}</td>
                                    <td>
                                        <span className={`status-badge status-${u.role === "ADMIN" ? "active" : "pending"}`}>
                                            {u.role}
                                        </span>
                                    </td>
                                    <td>
                                        <Link
                                            to={`/update-user/${u.userId}`}
                                            className="btn btn-secondary btn-sm"
                                        >
                                            Edit
                                        </Link>
                                        {u.userId !== currentUser?.userId && (
                                            <button
                                                className="btn btn-danger btn-sm"
                                                onClick={() => handleDelete(u.userId)}
                                            >
                                                Delete
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            <Footer />
        </>
    );
}

export default UserList;
