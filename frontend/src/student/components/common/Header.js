function Header() {
  return (
    <div className="student-app">
      <header className="main-header">
        <div className="header-left">
          <h1>E-Learning</h1>
        </div>
        <div className="header-center">
          <div className="search-bar">
            <i className="fas fa-search"></i>
            <input type="text" placeholder="Search courses, students..." />
          </div>
        </div>
        <div className="header-right"></div>
      </header>
    </div>
  );
}

export default Header;
