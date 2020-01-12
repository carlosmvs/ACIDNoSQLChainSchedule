import { Router } from 'express'

const routesBlockchain = new Router()

import ACIDNoSQLChainController from './ACIDNoSQLChainController'

routesBlockchain.post('/blockchain/mongo', ACIDNoSQLChainController.storeBlockchainMongo)

routesBlockchain.get('/blockchain/mongo', ACIDNoSQLChainController.indexBlockchainMongo)

routesBlockchain.get('/blockchain', ACIDNoSQLChainController.indexBlockchain)

routesBlockchain.post('/node', ACIDNoSQLChainController.storeNode)

routesBlockchain.post('/node/multiple', ACIDNoSQLChainController.storeNodeMultiple)

routesBlockchain.post('/node/broadcast', ACIDNoSQLChainController.storeBroadcastNode)

routesBlockchain.post('/transaction', ACIDNoSQLChainController.storeTransaction)

routesBlockchain.post('/transaction/broadcast', ACIDNoSQLChainController.storeBroadcastTransaction)

routesBlockchain.post('/block', ACIDNoSQLChainController.storeBlock)

routesBlockchain.get('/mine', ACIDNoSQLChainController.indexMine)

routesBlockchain.get('/consensu', ACIDNoSQLChainController.indexConsensu)


routesBlockchain.post('/patients', ACIDNoSQLChainController.storePatient)
routesBlockchain.post('/clinicals', ACIDNoSQLChainController.storeClinical)

routesBlockchain.post('/appointments', ACIDNoSQLChainController.storeAppointment)
routesBlockchain.get('/appointments', ACIDNoSQLChainController.indexTransference)
routesBlockchain.put('/appointments/:name', ACIDNoSQLChainController.updateAppointment)
routesBlockchain.delete('/appointments/:id', ACIDNoSQLChainController.destroyTransference)

routesBlockchain.post('/registrys', ACIDNoSQLChainController.storeRegistry)







export default routesBlockchain