import Navbar from './Navbar';
import Sidebar from './Sidebar';
import './layout.css';

function Layout({ children }) {
  return (
    <>
      <Navbar />
      <div className="app-body">
        <Sidebar />
        <main>{children}</main>
      </div>
    </>
  );
}

export default Layout;