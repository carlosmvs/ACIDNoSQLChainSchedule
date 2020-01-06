import express from 'express'
import dotenv from 'dotenv'
dotenv.config()
import databaseMongo from './config/databaseMongo'
import routesACIDNoSQLChain from './resources/acidnosqlchain/ACIDNoSQLChainRouter'
import routesEstablishment from '../src/resources/acidnosqlchainschedule/EstablishmentRouter'
import routesUser from '../src/resources/acidnosqlchainschedule/UserRouter'
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
    this.server.use(routesACIDNoSQLChain, routesEstablishment, routesUser, routesSchedule, routesReservation)
  }
}

export default new APP().server