const ResetPassword: React.FC = () => {
    return (
        <>
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <h1>Reset Password</h1>
            {/* {error && <p style={{ color: 'red' }}>{error}</p>} */}
            <form onSubmit={() => {}}> {/* onSubmit fires when someone hits enter. */}
                <label style={{ display: 'block', width: '300px', margin: '0 auto', textAlign: 'left' }}>
                    Enter New Password
                </label>
                <input
                    type="text"
                    placeholder="New Password"
                    // value={username}
                    // onChange={(e) => setUsername(e.target.value)}
                    style={{ display: 'block', margin: '10px auto', padding: '10px', width: '300px' }}
                />
                <label style={{ display: 'block', width: '300px', margin: '0 auto', textAlign: 'left' }}>
                    Enter New Password
                </label>
                <input
                    type="password"
                    placeholder="New Password"
                    // value={password}
                    // onChange={(e) => setPassword(e.target.value)}
                    style={{ display: 'block', margin: '10px auto', padding: '10px', width: '300px' }}
                />
                <div className="options" style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
                    {/* Don't forget the type! If the type is not here both buttons will fire! */}
                    <button type='submit' onClick={() => {}} style={{ padding: '10px 20px' }}>Login</button>
                    <button type='button' onClick={() => {}}>Forgot Password?</button>
                </div>
            </form>
        </div>
        </>
    )
}

export default ResetPassword;