import { useMutation } from '@tanstack/react-query'
import { apiRequest, dispatchAction } from '~/utils'

export default function StudentProfile() {
  const { mutate } = useMutation({
    mutationFn: async (values: string[]) => {
      const rows = await dispatchAction({ type: 'save-student-profile', payload: values })
      return await apiRequest.post('/students/sheet', { list: rows })
    },
  })

  return (
    <form
      onSubmit={async (ev) => {
        ev.preventDefault()
        const fd = new FormData(ev.currentTarget)
        const values = fd.getAll('standards') as string[]
        mutate(values)
      }}>
      <p className=''>Select Classes</p>
      <select className='' name='standards' defaultValue={['all']} multiple>
        <option value='all'>All</option>
        {[...Array(12).keys()].map((i) => (
          <option value={i + 1} key={i}>
            {i + 1}
          </option>
        ))}
      </select>

      <button type='submit'>Submit</button>
    </form>
  )
}
