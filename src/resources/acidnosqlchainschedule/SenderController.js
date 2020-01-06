import Sender from './SenderModel'

class SenderController {
  async store(req, res) {
    try {
      const sender = await Sender.create(req.body)
      return res.json(sender)
    } catch (err) {
      throw err
    }
  }
}

export default new SenderController()