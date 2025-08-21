import { Link } from "react-router-dom"
const SignupForm = () => {
    return (
        <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8">
            <h3 className="text-2xl font-semibold mb-2">MentorHub</h3>
            <p className="mb-6 text-gray-600">Welcome! Please enter your details.</p>
            <form>
                <div className="w-full max-w-md">
                    <div className="mb-4">
                        <label htmlFor="email" className="block mb-1 text-left text-gray-700">Email</label>
                        <input type="text" name="email" className="w-full p-2 border border-gray-300 rounded" placeholder="john.doe@company.com" required />
                    </div>
                    <div className="mb-6">
                        <label htmlFor="password" className="block mb-1 text-left text-gray-700">Password</label>
                        <input type="password" name="password" className="w-full p-2 border border-gray-300 rounded" placeholder="*******" required />
                    </div>
                    <div className="mb-6">
                        <label htmlFor="confirm-password" className="block mb-1 text-left text-gray-700">Confirm Password</label>
                        <input type="password" name="password" className="w-full p-2 border border-gray-300 rounded" placeholder="*******" required />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="bio" className="block mb-1 text-left text-gray-700">Bio</label>
                        <textarea name="bio" rows={4} className="block w-full text-sm p-2 border rounded-lg focus:ring-blue-500 border-gray-300" placeholder="Your bio here..." ></textarea>
                    </div>
                    <div className="mb-4">
                        <button className="w-3xs bg-blue-900 text-white py-2 rounded" style={{
                            background: 'linear-gradient(to bottom, #1e3a8a, #384A68)',
                        }}>Sign up</button>
                    </div>
                    <div>
                        <p className="text-gray-600">
                            Do you have an account? <Link to='/Login' className="text-red-700 font-semibold">Sign in</Link>
                        </p>
                    </div>
                </div>
            </form>
        </div>
    )
}
export default SignupForm