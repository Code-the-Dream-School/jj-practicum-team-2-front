import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
const LoginForm = () => {
    const initialLoginData = { email: "", password: "" }
    const [loginData, setLoginData] = useState(initialLoginData)
    const [loginDataErrors, setLoginDataErrors] = useState({})
    const [isSubmit, setIsSubmit] = useState(false)

    const handleChange = (e) => {
        const { name, value } = e.target
        setLoginData({ ...loginData, [name]: value })
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        setLoginDataErrors(validate(loginData))
        setIsSubmit(true)
    }

    useEffect(() => {
        console.log(loginDataErrors)
        if (Object.keys(loginDataErrors).length === 0 && isSubmit) {
            console.log(loginData)
        }
    }, [loginDataErrors])

    const validate = (val) => {
        const errors = {}
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i
        if (!val.email) {
            errors.email = "Email is required!"
        } else if (!regex.test(val.email)) {
            errors.email = "This is not a valid email format"
        }
        if (!val.password) {
            errors.password = "Password is required!"
        } else if (val.password.length < 4) {
            errors.password = "Password must be more than 4 characters"
        } else if (val.password.length > 10) {
            errors.password = "password cannot exceed more than 10 characters"
        }
        return errors
    }

    return (
        <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8">
            <h3 className="text-2xl font-semibold mb-2">MentorHub</h3>
            <p className="mb-6 text-gray-600">Welcome back! Please enter your details.</p>
            <div className="container">
                {Object.keys(loginDataErrors).length === 0 && isSubmit ? (
                    <div className="p-4 mb-4 text-sm text-green-800 rounded-lg bg-green-50 dark:bg-gray-800 dark:text-green-400" role="alert">
                        <span className="font-medium">Login Successful!</span>
                    </div>
                ) : (
                    null
                )}
            </div>
            <form onSubmit={handleSubmit}>
                <div className="w-full max-w-md">
                    <div className="mb-4">
                        <label htmlFor="email" className="block mb-1 text-left text-gray-700">Email</label>
                        <input type="text" name="email" value={loginData.email} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded" placeholder="Enter your email" />
                        <p className='text-sm text-red-800'>{loginDataErrors.email}</p>
                    </div>
                    <div className="mb-6">
                        <label htmlFor="password" className="block mb-1 text-left text-gray-700">Password</label>
                        <input type="password" name="password" value={loginData.password} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded" placeholder="Enter your password" />
                        <p className='text-sm text-red-800'>{loginDataErrors.password}</p>
                    </div>
                    <div className="mb-4">
                        <button className="w-3xs bg-blue-900 text-white py-2 rounded" style={{
                            background: '#384A68',
                        }}>Sign in</button>
                    </div>
                    <div>
                        <p className="text-gray-600">
                            Don't have an account? <Link to='/SignUp' className="text-red-700">Sign up</Link>
                        </p>
                    </div>
                </div>
            </form>
        </div>
    )
}
export default LoginForm