import { Header } from '~/components/header'
import { Button } from '../ui'
import { ViewProps } from './types'

export function InitialView(props: ViewProps<'initial'>) {
  return (
    <section className='space-y-6'>
      <Header title='SD Quick' />
      <div className='px-4 space-y-6'>
        <Button className='w-full' onClick={() => props.onViewSelect('tcList')}>
          TC List
        </Button>
      </div>
    </section>
  )
}
