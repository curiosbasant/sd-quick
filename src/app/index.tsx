import { Link } from 'expo-router'

export default function HomePage() {
  return (
    <ul className='p-4 group'>
      <li className=''>
        <Link href='/students/profile'>Student Profile</Link>
      </li>
      <li className=''>
        <table className='group'>
          <tr className=''>
            <td className=''>1</td>
            <td className='group-has-[tr]:bg-red-500'>2</td>
          </tr>
          <tr className=''>
            <td className=''>3</td>
            <td className=''>
              <input type='color' name='' id='' />
            </td>
          </tr>
        </table>
      </li>
    </ul>
  )
}
