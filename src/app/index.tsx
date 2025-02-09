import { Link } from 'expo-router'
import { dispatchAction } from '~/utils'

export default function HomePage() {
  return (
    <ul className='bg-lime-500 p-4'>
      <li>
        <Link href='/students/profile'>Student Profile</Link>
      </li>
      <button
        onClick={() => {
          console.log('clicked')
          dispatchAction({ type: 'hello' })
        }}>
        Click Me
      </button>
    </ul>
  )
}
