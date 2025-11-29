import { SignIn } from '@clerk/nextjs'

export default function Page() {
  return <div className='flex min-h-screen justify-center pt-8'>

  <SignIn />
  </div>
}