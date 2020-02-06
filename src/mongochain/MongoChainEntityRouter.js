import { Router } from 'express'

const routesEntity = new Router()

import MongoChainEntityController from './MongoChainEntityController'

routesEntity.post('/senders', MongoChainEntityController.storeSender)
routesEntity.post('/recipients', MongoChainEntityController.storeRecipient)

routesEntity.put('/transferences/:id', MongoChainEntityController.updateTransference)
routesEntity.get('/transferences/:senderId', MongoChainEntityController.showTransferenceBySenderId)
routesEntity.get('/transferences/:recipientId', MongoChainEntityController.showTransferenceByRecipientId)

routesEntity.post('/patients', MongoChainEntityController.storePatient)
routesEntity.post('/clinics', MongoChainEntityController.storeClinic)

routesEntity.get('/appointments', MongoChainEntityController.indexAppointment)
routesEntity.put('/appointments/:id', MongoChainEntityController.updateAppointment)
routesEntity.delete('/appointments/:id', MongoChainEntityController.destroyAppointment)

routesEntity.put('/changes/:id', MongoChainEntityController.updateChange)

export default routesEntity