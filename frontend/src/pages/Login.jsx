import React from 'react'
import { SignUp } from '@clerk/clerk-react'

const Login = () => {
  return (
    <div className='flex items-center justify-center h-screen'>
        <SignUp  signInUrl='/login'  forceRedirectUrl={"/"} />
    </div>
  )
}

export default Login