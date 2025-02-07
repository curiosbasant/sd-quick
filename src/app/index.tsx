import { Image } from 'react-native'

export default function HomePage() {
  return (
    <div className='bg-pink-500 p-4'>
      <Image source={require('~/assets/images/icon.png')} />
    </div>
  )
}
