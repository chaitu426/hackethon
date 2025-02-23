import React from 'react'
import { SignIn } from '@clerk/clerk-react'

const Signup = () => {
  return (
    <div className='flex items-center justify-center h-screen'>
        <SignIn signUpUrl='/signup'  forceRedirectUrl={"/"} />
    </div>
  )
}

export default Signup