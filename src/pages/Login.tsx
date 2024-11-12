const Login: React.FC = () => {
  return (
    <div className="login-container" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <div className="input-field">
        <input type="text" placeholder="Email" />
      </div>
      <div className="input-field">
        <input type="password" placeholder="Password" />
      </div>
      <div className="sign-up-text">
        <p>New to User? <a style={{ color: 'blue' }} href="/signup">Sign Up</a></p>
      </div>
    </div>
  );
};

export default Login;