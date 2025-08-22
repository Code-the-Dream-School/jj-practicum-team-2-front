import Header from "../common/Header";

const Layout = ({ children, showHeader = true }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      {showHeader && <Header />}
      <main className="container mx-auto px-4 py-6">{children}</main>
    </div>
  );
};

export default Layout;
