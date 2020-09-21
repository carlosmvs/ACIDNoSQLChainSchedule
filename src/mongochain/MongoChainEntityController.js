import mongoose from 'mongoose'
import MongoChainSenderModel from './MongoChainSenderModel'
import MongoChainRecipientModel from './MongoChainRecipientModel'
import MongoChainTransferenceModel from './MongoChainTransferenceModel'
import MongoChainPatientModel from '../mongochainschedulehealth/MongoChainScheduleHealthPatientModel'
import MongoChainClinicModel from '../mongochainschedulehealth/MongoChainScheduleHealthClinicModel'
import MongoChainAppointmentModel from '../mongochainschedulehealth/MongoChainScheduleHealthAppointmentModel'
import MongoChainChangeModel from '../mongochainschedulehealth/MongoChainScheduleHealthChangeModel'

class MongoChainEntityController {

  async storeSender(req, res) {
    try {
      const sender = await MongoChainSenderModel.create(req.body)
      res.json(sender)
    } catch (err) {
      throw err
    }
  }

  async storeRecipient(req, res) {
    try {
      let recipient = await MongoChainRecipientModel.create(req.body)
      res.json(recipient)
    } catch (err) {
      throw err
    }
  }

  async updateTransference(req, res) {
    const sessionTransference = await mongoose.startSession()
    sessionTransference.startTransaction({
      readConcern: { level: 'snapshot' },
      writeConcern: { w: 'majority' }
    })
    try {
      let sender = await MongoChainSenderModel.findById(req.body.senderId)
      let recipient = await MongoChainRecipientModel.findById(req.body.recipientId)
      let transference = await MongoChainTransferenceModel.findById(req.params.id)
      sender.amount -= (req.body.amount - 0.25)
      recipient.amount += req.body.amount
      transference.status = 'Concluído'
      await MongoChainSenderModel.findByIdAndUpdate(req.body.senderId, sender).session(sessionTransference)
      await MongoChainRecipientModel.findByIdAndUpdate(req.body.recipientId, recipient).session(sessionTransference)
      await MongoChainTransferenceModel.findByIdAndUpdate(req.params.id, transference).session(sessionTransference)
      await sessionTransference.commitTransaction()
      res.json({ message: "OK" })
    } catch (err) {
      await sessionTransference.abortTransaction()
    } finally {
      sessionTransference.endSession()
    }
  }

  async showTransferenceBySenderId(req, res) {
    try {
      const transferences = await MongoChainTransferenceModel.find()
      let senders = transferences.filter(sender => {
        return sender.senderId = req.params.senderId
      })
      res.json(senders)
    } catch (err) {
      throw err
    }
  }

  async showTransferenceByRecipientId(req, res) {
    try {
      const transferences = await MongoChainTransferenceModel.find()
      let recipients = transferences.filter(recipient => {
        return recipient.recipientId == req.params.recipientId
      })
      res.json(recipients)
    } catch (err) {
      throw err
    }
  }

  async storePatient(req, res) {
    try {
      const patient = await MongoChainPatientModel.create(req.body)
      res.json(patient)
    } catch (err) {
      throw err
    }
  }

  async storeClinic(req, res) {
    try {
      const clinic = await MongoChainClinicModel.create(req.body)
      res.json(clinic)
    } catch (err) {
      throw err
    }
  }

  async indexAppointment(req, res) {
    try {
      const appointment = await MongoChainAppointmentModel.find()
      res.json(appointment)
    } catch (err) {
      throw err
    }
  }

  async updateAppointment(req, res) {
    const sessionAppointment = await mongoose.startSession()
    sessionAppointment.startTransaction({
      readConcern: { level: 'snapshot' }, writeConcern: { w: 'majority' }
    })
    try {
      let patient = await MongoChainPatientModel.findById(req.body.patientId)
      let appointment = await MongoChainAppointmentModel.findById(req.params.id)
      patient.score = 5
      appointment.status = 'scheduled'
      await MongoChainPatientModel.findByIdAndUpdate(req.body.patientId, patient)
        .session(sessionAppointment)
      await MongoChainAppointmentModel.findByIdAndUpdate(req.params.id, appointment)
        .session(sessionAppointment)
      await sessionAppointment.commitTransaction()
      res.json(appointment)
    } catch (err) {
      await sessionAppointment.abortTransaction()
    } finally {
      sessionAppointment.endSession()
    }
  }

  async updateChange(req, res) {
    const sessionChange = await mongoose.startSession()
    sessionChange.startTransaction({
      readConcern: { level: 'snapshot' },
      writeConcern: { w: 'majority' }
    })
    try {
      let appointment = await MongoChainAppointmentModel.findById(req.params.id)
      MongoChainChangeModel.createCollection()
      let change = await MongoChainChangeModel.create([{
        appointmentId: appointment.appointmentId,
        oldDate: appointment.date, newDate: req.body.newDate
      }], { session: sessionChange })
      appointment.date = req.body.newDate
      appointment.status = 'rescheduled'
      await MongoChainAppointmentModel.findByIdAndUpdate(appointment._id, appointment)
        .session(sessionChange)
      await sessionChange.commitTransaction()
      res.json(change)
    } catch (err) {
      await sessionChange.abortTransaction()
    } finally {
      sessionChange.endSession()
    }
  }

  async destroyAppointment(req, res) {
    const sessionAppointment = await mongoose.startSession()
    sessionAppointment.startTransaction({
      readConcern: { level: 'snapshot' },
      writeConcern: { w: 'majority' }
    })
    try {
      await MongoChainChangeModel.findByIdAndDelete(req.params.id).session(sessionAppointment)
      await sessionAppointment.commitTransaction()
      res.send()
    } catch (err) {
      await sessionAppointment.abortTransaction()
    } finally {
      sessionAppointment.endSession()
    }
  }

}

export default new MongoChainEntityController()
