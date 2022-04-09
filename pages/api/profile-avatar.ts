import nextConnect from '../../lib/nextConnect'
import { downloadFile } from '../../lib/gridFs'

const handler = nextConnect

handler.get(downloadFile)

export default handler