import { Router } from 'express'

const routesBlockchain = new Router()

import ACIDNoSQLChainController from './ACIDNoSQLChainController'

routesBlockchain.post('/blockchain/mongo', ACIDNoSQLChainController.storeBlockchainMongo)

routesBlockchain.get('/blockchain/mongo', ACIDNoSQLChainController.indexBlockchainMongo)

routesBlockchain.get('/blockchain/server', ACIDNoSQLChainController.indexBlockchainServer)

routesBlockchain.post('/node', ACIDNoSQLChainController.storeNode)

routesBlockchain.post('/node/multiple', ACIDNoSQLChainController.storeNodeMultiple)

routesBlockchain.post('/node/broadcast', ACIDNoSQLChainController.storeBroadcastNode)

routesBlockchain.post('/transaction', ACIDNoSQLChainController.storeTransaction)

routesBlockchain.post('/transaction/broadcast', ACIDNoSQLChainController.storeBroadcastTransaction)

routesBlockchain.post('/block', ACIDNoSQLChainController.storeBlock)

routesBlockchain.get('/mine', ACIDNoSQLChainController.indexMine)

routesBlockchain.get('/consensu', ACIDNoSQLChainController.indexConsensu)


routesBlockchain.post('/users', ACIDNoSQLChainController.storeUser)
routesBlockchain.post('/sellers', ACIDNoSQLChainController.storeSeller)

routesBlockchain.get('/reserves', ACIDNoSQLChainController.indexReserve)
routesBlockchain.put('/reserves/:id', ACIDNoSQLChainController.updateReserve)
routesBlockchain.delete('/reserves/:id', ACIDNoSQLChainController.destroyReserve)

routesBlockchain.put('/changes/:id', ACIDNoSQLChainController.updateChange)







export default routesBlockchain