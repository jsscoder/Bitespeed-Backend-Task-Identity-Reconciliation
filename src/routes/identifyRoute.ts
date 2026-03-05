import { Request, Response } from "express"
import { handleIdentity } from "../services/contactService"

const identify = async (req: Request, res: Response) => {

 const { email, phoneNumber } = req.body

 const result = await handleIdentity(email, phoneNumber)

 res.json({ contact: result })

}
export default identify