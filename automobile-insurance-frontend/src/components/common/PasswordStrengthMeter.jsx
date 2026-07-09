import "../../styles/Common.css";

/**
 * Computes a simple 0-4 strength score from length + character variety
 * and renders a live-updating colored bar + label as the user types.
 * Pure presentational - the parent still owns the actual password value.
 */
function getStrength(password) {
    if (!password) return 0;

    let score = 0;
    if (password.length >= 6) score++;
    if (password.length >= 10) score++;
    if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    return Math.min(score, 4);
}

const LABELS = ["Very Weak", "Weak", "Fair", "Good", "Strong"];
const COLORS = ["#dc3545", "#fd7e14", "#ffc107", "#6f9e18", "#198754"];

function PasswordStrengthMeter({ password }) {
    if (!password) return null;

    const score = getStrength(password);

    return (
        <div className="password-strength">
            <div className="password-strength-track">
                {[0, 1, 2, 3].map((i) => (
                    <div
                        key={i}
                        className="password-strength-segment"
                        style={{
                            background: i < score ? COLORS[score] : "#e0e0e0",
                        }}
                    />
                ))}
            </div>
            <span
                className="password-strength-label"
                style={{ color: COLORS[score] }}
            >
                {LABELS[score]}
            </span>
        </div>
    );
}

export default PasswordStrengthMeter;
