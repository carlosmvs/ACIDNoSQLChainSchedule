import Recipient from './RecipientModel'

class RecipientController {
  async store(req, res) {
    try {
      const recipient = await Recipient.create(req.body)
      return res.json(recipient)
    } catch (err) {
      throw err
    }
  }
}

export default new RecipientController()