import React from 'react'
import { SignUp } from '@clerk/clerk-react'

const Login = () => {
  return (
    <div>
        <SignUp signInUrl='/login' forceRedirectUrl={"/"} />
    </div>
  )
}

export default Login