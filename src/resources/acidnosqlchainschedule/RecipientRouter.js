import { Router } from 'express'

const routesRecipient = new Router()

import RecipientController from './RecipientController'

routesRecipient.post('/recipients', RecipientController.store)

export default routesRecipient