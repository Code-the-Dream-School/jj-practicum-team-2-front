import WelcomeSidebar from "../components/common/WelcomeSidebar";
import RegisterForm from "../components/auth/RegisterForm";
export default function RegisterPage() {
  return (
    <div className="flex w-full h-screen flex-wrap lg:flex-nowrap text-center">
      {/* left side */}
      <WelcomeSidebar />
      {/* right side */}
      <RegisterForm />
    </div>
  );
}
