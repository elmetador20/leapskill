import React, { Suspense } from 'react'
import { Loader } from 'lucide-react'
const Layout = ({children}) => {
  return (
    <div className='px-5'>
      <div className='flex items-center justify- mb-5'>
        <h1 className='text-6xl font-extralightbold gradient-title'>Industry Insights</h1>

      </div>
      <Suspense 
      fallback={<Loader className="mt-4" width={"100%"} color="grey"/>}> {children}</Suspense>
     
    </div>
  )
}

export default Layout
