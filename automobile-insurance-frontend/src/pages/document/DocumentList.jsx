import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import Loader from "../../components/common/Loader";
import ErrorMessage from "../../components/common/ErrorMessage";
import DocumentService from "../../services/DocumentService";
import { useAuth } from "../../context/AuthContext";
import "../../styles/Table.css";

function DocumentList() {

    const { user, hasRole } = useAuth();
    const isAdmin = hasRole("ADMIN");

    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        loadDocuments();
    }, []);

    async function loadDocuments() {
        setLoading(true);
        setError("");
        try {
            const response = await DocumentService.getAllDocuments();
            setDocuments(response.data);
        } catch (err) {
            console.log(err);
            setError("Unable to load documents.");
        } finally {
            setLoading(false);
        }
    }

    async function handleDelete(documentId) {
        if (!window.confirm("Delete this document?")) return;
        try {
            await DocumentService.deleteDocument(documentId);
            setDocuments((prev) => prev.filter((d) => d.documentId !== documentId));
        } catch (err) {
            console.log(err);
            alert("Unable to delete document.");
        }
    }

    const visibleDocuments = isAdmin
        ? documents
        : documents.filter((d) => d.proposal?.user?.userId === user?.userId);

    return (
        <>
            <Navbar />

            <div className="container">
                <div className="list-header">
                    <h2 className="title">{isAdmin ? "All Documents" : "My Documents"}</h2>
                    <Link to="/register-document" className="btn btn-primary">
                        + Add Document
                    </Link>
                </div>

                <ErrorMessage message={error} />

                {loading ? (
                    <Loader label="Loading documents..." />
                ) : visibleDocuments.length === 0 ? (
                    <p className="empty-state">No documents found.</p>
                ) : (
                    <table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                {isAdmin && <th>Applicant</th>}
                                <th>Proposal</th>
                                <th>Document Name</th>
                                <th>File Path</th>
                                <th>Uploaded On</th>
                                <th>Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {visibleDocuments.map((doc) => (
                                <tr key={doc.documentId}>
                                    <td>{doc.documentId}</td>
                                    {isAdmin && <td>{doc.proposal?.user?.name}</td>}
                                    <td>{doc.proposal?.vehicleModel}</td>
                                    <td>{doc.documentName}</td>
                                    <td>
                                        <a href={doc.filePath} target="_blank" rel="noreferrer">
                                            View
                                        </a>
                                    </td>
                                    <td>
                                        {doc.uploadedDate
                                            ? new Date(doc.uploadedDate).toLocaleDateString()
                                            : "-"}
                                    </td>
                                    <td>
                                        <button
                                            className="btn btn-danger btn-sm"
                                            onClick={() => handleDelete(doc.documentId)}
                                        >
                                            Delete
                                        </button>
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

export default DocumentList;
