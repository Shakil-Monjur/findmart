

function Navbar() {
  return (
    <nav className="navbar">
      <div className="logo">
        <h2>FindMart</h2>
      </div>

      <div className="nav-right">
        <button className="signup-btn">Sign Up</button>
        <button className="login-btn">Log In</button>
      </div>
    </nav>
  );
}

export default Navbar;