import { Link } from 'react-router-dom'
const LoginForm = () => {
    return (
        <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8">
            <h3 className="text-2xl font-semibold mb-2">MentorHub</h3>
            <p className="mb-6 text-gray-600">Welcome back! Please enter your details.</p>
            <form>
                <div className="w-full max-w-md">
                    <div className="mb-4">
                        <label htmlFor="email" className="block mb-1 text-left text-gray-700">Email</label>
                        <input type="text" name="email" className="w-full p-2 border border-gray-300 rounded" placeholder="Enter your email" required />
                    </div>
                    <div className="mb-6">
                        <label htmlFor="password" className="block mb-1 text-left text-gray-700">Password</label>
                        <input type="password" name="password" className="w-full p-2 border border-gray-300 rounded" placeholder="Enter your password" required />
                    </div>
                    <div className="mb-4">
                        <button className="w-3xs bg-blue-900 text-white py-2 rounded" style={{
                            background: '#384A68',
                        }}>Sign in</button>
                    </div>
                    <div>
                        <p className="text-gray-600">
                            Don't have an account? <Link to='/SignUp' className="text-red-700 font-semibold">Sign up</Link>
                        </p>
                    </div>
                </div>
            </form>
        </div>
    )
}
export default LoginForm