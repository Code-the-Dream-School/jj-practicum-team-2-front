import Header from "../common/Header";
import Footer from "./Footer";

const Layout = ({ children, showHeader = true, showFooter = true }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {showHeader && <Header />}
      <main className="flex-1 container mx-auto px-4 py-6">{children}</main>
      {showFooter && <Footer />}
    </div>
  );
};

export default Layout;
