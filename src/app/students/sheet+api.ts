type PostBody = {
  // viewState: string
  list: {
    class: number
    serialNumber: string
    ooscStatus: string
    srNo: string
    nicId: string
    name: string
    fName: string
    mName: string
    category: string
    gender: string
    dob: string
    mobile: string
  }[]
}

export async function POST(req: Request) {
  const { list }: PostBody = await req.json()

  return Response.json({ hello: 'world' })
}
