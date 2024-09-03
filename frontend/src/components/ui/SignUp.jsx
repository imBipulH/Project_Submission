import { useState } from 'react'
import { Input } from './Input'
import { Link } from 'react-router-dom'
import axiosInstance from '../utils/axiosinstance'

const SignUp = () => {
  const [error, setError] = useState('')
  const [data, setData] = useState({
    fullName: '',
    email: '',
    password: ''
  })
  const handleChange = e => {
    setData({ ...data, [e.target.name]: e.target.value })
  }

  const handleSignUp = async () => {
    if (!data.fullName || !data.email || !data.password) {
      setError('Please fill all fields')
      return
    }
    setError('')

    try {
      const response = await axiosInstance.post('/register', {
        fullName: data.fullName,
        email: data.email,
        password: data.password
      })

      if (response.data && response.data.error) {
        setError(response.data.message)
        return
      }

      if (response.data && response.data.accessToken) {
        localStorage.setItem('token', response.data.accessToken)
        window.location.href = '/login'
      }
    } catch (error) {
      setError(error.response.data.error)
    }
  }

  return (
    <div>
      <div className='absolute w-full top-20 '>
        <div className='container rounded'>
          <div className='container w-full max-w-96 bg-white relative pt-10 px-4'>
            <h2 className='bg-teal-500 text-3xl py-4 text-center text-white'>
              Sign Up
            </h2>
            {error && (
              <p className='text-base text-white bg-red-400 py-2 w-full text-center mt-4'>
                {error}
              </p>
            )}
            <Input
              title='Full Name'
              name='fullName'
              type='text'
              value={data.fullName}
              placeholder='Enter your full name'
              onChange={e => handleChange(e)}
            />
            <Input
              title='Email Address'
              name='email'
              type='email'
              value={data.email}
              placeholder='Enter your email address'
              onChange={e => handleChange(e)}
            />
            <Input
              title='Password'
              name='password'
              type='password'
              value={data.password}
              placeholder='Enter password'
              onChange={e => handleChange(e)}
            />

            <button
              onClick={handleSignUp}
              className='bg-teal-500 w-full py-2 rounded text-white active:bg-teal-400 hover:shadow-xl'
            >
              Signup
            </button>

            <p className='w-full text-center mt-10 text-lg'>
              Already have an account?{' '}
              <Link to='/login'>
                <span className='text-lg text-teal-800'>Log In</span>
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SignUp
