import api from "../api/api";

const DocumentService = {

    getAllDocuments() {

        return api.get("/documents");

    },

    getDocumentById(id) {

        return api.get(`/documents/${id}`);

    },

    uploadDocument(document) {

        return api.post("/documents", document);

    },

    deleteDocument(id) {

        return api.delete(`/documents/${id}`);

    }
    
};

export default DocumentService;