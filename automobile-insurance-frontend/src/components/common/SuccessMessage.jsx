import "../../styles/Common.css";

function SuccessMessage({ message }) {
    if (!message) return null;
    return <div className="success-banner">{message}</div>;
}

export default SuccessMessage;
