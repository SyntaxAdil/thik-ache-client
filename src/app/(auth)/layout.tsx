import React from 'react'
import Navbar from '../../components/shared/navbar/navbar'

const AuthLayout = ({children}: Readonly<{ children: React.ReactNode }>) => {
  return (
    <div>
        <Navbar></Navbar>
        <main>
            {children}
        </main>
    </div>
  )
}

export default AuthLayout