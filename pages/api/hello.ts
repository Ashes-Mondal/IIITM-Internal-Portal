import type { NextApiRequest, NextApiResponse } from 'next'
import nextConnect from '../../lib/nextConnect'
import dbConnect from '../../lib/dbConnect'
import { validate } from '../../lib/validate'
import { getSession } from "next-auth/react"
import Joi from 'joi'

const carSchema = Joi.object({
  brand: Joi.string().required(),
  model: Joi.string().required(),
})

const handler = nextConnect
handler.get(validate({body:carSchema}),async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSession({req});
  // if(!session)
  // {
  //   res.status(401).json({ data:null,error:'UNAUTHORIZED' })
  //   return
  // }
  //*Client is signedIn
  await dbConnect()
  res.status(200).json({ data:"HELLO FROM API",error:null })
})
export default handler
