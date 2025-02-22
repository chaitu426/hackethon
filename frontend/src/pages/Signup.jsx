import React from 'react'
import { SignIn } from '@clerk/clerk-react'

const Signup = () => {
  return (
    <div>
        <SignIn signUpUrl='/signup' forceRedirectUrl={"/"} />
    </div>
  )
}

export default Signup