import { Router } from 'express'

const routesSender = new Router()

import SenderController from './SenderController'

routesSender.post('/senders', SenderController.store)

export default routesSender