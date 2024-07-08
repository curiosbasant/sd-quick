import { ArrowLeftIcon } from 'lucide-react'

export function Header(props: { title: string; onGoBack?: () => void }) {
  return (
    <div className='flex items-center gap-3 border-b p-4'>
      {!props.onGoBack || <ArrowLeftIcon className='absolute' size={20} onClick={props.onGoBack} />}
      <p className='text-center flex-1 font-bold'>{props.title}</p>
    </div>
  )
}
