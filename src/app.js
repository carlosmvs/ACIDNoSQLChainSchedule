import express from 'express'
import dotenv from 'dotenv'
dotenv.config()
import databaseMongo from './config/databaseMongo'
import routesACIDNoSQLChain from './resources/acidnosqlchain/ACIDNoSQLChainRouter'
import routesSender from '../src/resources/acidnosqlchainschedule/SenderRouter'
import routesRecipient from '../src/resources/acidnosqlchainschedule/RecipientRouter'
import routesSchedule from '../src/resources/acidnosqlchainschedule/ScheduleRouter'
import routesReservation from '../src/resources/acidnosqlchainschedule/ReservationRouter'

class APP {
  constructor() {
    this.server = express()
    this.database()
    this.middlewares()
    this.routes()
  }

  database() {
    databaseMongo.mongo()
  }

  middlewares() {
    this.server.use(express.json());
  }

  routes() {
    this.server.use(routesACIDNoSQLChain, routesSender, routesRecipient, routesSchedule, routesReservation)
  }
}

export default new APP().server