import { Link } from "react-router-dom"
const SignUp = () =>{
     return (
        <div className="flex w-full h-screen flex-wrap lg:flex-nowrap text-center">
            {/* left side */}
            <div className="w-full lg:w-1/2 bg-blue-900 text-white flex flex-col justify-center items-center h-64 lg:h-screen p-8">
                <div >
                    <span>[logo]</span>
                    <h1 className="text-3xl font-bold mt-4">Welcome to MentorHub</h1>
                    <h4 className="mt-2 text-lg">your centeralized hub for CTD mentorship. <br />Never miss a session.</h4>

                </div>
            </div>

            {/* right side */}
            <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8">
            <span>[Logo]</span>
                <h3 className="text-2xl font-semibold mb-2">MentorHub</h3>
                <p className="mb-6 text-gray-600">Welcome! Please enter your details.</p>
                <div className="w-full max-w-md">
                    <div className="mb-4">
                        <label htmlFor="email" className="block mb-1 text-left text-gray-700">Email</label>
                        <input type="text" name="email" className="w-full p-2 border border-gray-300 rounded" placeholder="Enter your email" />
                    </div>
                    <div className="mb-6">
                        <label htmlFor="password" className="block mb-1 text-left text-gray-700">Password</label>
                        <input type="password" name="password" className="w-full p-2 border border-gray-300 rounded" placeholder="Enter your password" />
                    </div>
                   <div className="mb-6">
                        <label htmlFor="confirm-password" className="block mb-1 text-left text-gray-700">Confirm Password</label>
                        <input type="password" name="password" className="w-full p-2 border border-gray-300 rounded" placeholder="Enter your password" />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="bio" className="block mb-1 text-left text-gray-700">Bio</label>
                        <textarea name="bio" rows={4} className="block w-full text-sm p-2 border rounded-lg focus:ring-blue-500 border-gray-300" placeholder="Your bio here..." ></textarea>
                    </div>
                    <div className="mb-4">
                        <button className="w-3xs bg-blue-900 text-white py-2 rounded">Sign up</button>
                    </div>
                    <div>
                        <p className="text-gray-600">
                            Do you have an account? <Link to='/Login' className="text-red-700 font-semibold">Sign in</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SignUp