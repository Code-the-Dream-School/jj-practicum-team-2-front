import WelcomeSidebar from "../components/common/WelcomeSidebar";
import LoginForm from "../components/auth/LoginForm";

export default function LoginPage() {
  return (
    <div className="flex w-full h-screen flex-wrap lg:flex-nowrap text-center">
      {/* welcome sidebar */}
      <WelcomeSidebar />
      {/* form sidebar */}
      <LoginForm />
    </div>
  );
}
