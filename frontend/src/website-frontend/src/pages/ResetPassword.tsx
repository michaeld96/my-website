import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE: string = import.meta.env.VITE_API_BASE;

const ResetPassword: React.FC = () => {
    const navigate = useNavigate();
    
    const [newPassword, setNewPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [error, setError] = useState<string>('');
    const [success, setSuccess] = useState<string>('');

    const token = new URLSearchParams(location.search).get('token');

    const handleChangePassword = async (e: React.FormEvent<HTMLFormElement>) => {
        // Another try, we want the error to be blank.
        setError('');
        setSuccess('');
        e.preventDefault();
        if (newPassword != confirmPassword) {
            setError('Both password entries need to match!');
            return;
        }
        if (!token) {
            setError('Token is missing or invalid!');
            return;
        }
        // Checking token validity.
        try {
            await axios.post(`${API_BASE}/auth/reset-password/${encodeURIComponent(token)}`, {
                password: newPassword
            })
            setSuccess('Password has successfully been changed!');
        } catch (err) {
            setError('Problem resetting password!');
            console.log("ERROR", err);
        }
        
        return;
    }

    return (
        <>
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <h1>Reset Password</h1>
            <form onSubmit={handleChangePassword}> {/* onSubmit fires when someone hits enter. */}
                <label style={{ display: 'block', width: '325px', margin: '0 auto', textAlign: 'left' }}>
                    Enter New Password
                </label>
                <input
                    type="password" // Makes text hidden
                    placeholder="New Password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    style={{ display: 'block', margin: '10px auto', padding: '10px', width: '300px' }}
                />
                <label style={{ display: 'block', width: '325px', margin: '0 auto', textAlign: 'left' }}>
                    Confirm New Password
                </label>
                <input
                    type="password"
                    placeholder="New Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    style={{ display: 'block', margin: '10px auto', padding: '10px', width: '300px' }}
                />
                <div className="options" style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
                    <button type='submit' style={{ padding: '10px 20px' }}>Change Password</button>
                </div>
            </form>
            {error && (
                <>
                <p style={{color: 'red', fontWeight: 'bold'}}>{error}</p>
                </>
            )}
            {success && (
                <>
                <p style={{color: 'green', fontWeight: 'bold'}}>{success}</p>
                <button onClick={() => navigate('/')}>To Homepage!</button>
                </>
            )}
        </div>
        </>
    )
}

export default ResetPassword;