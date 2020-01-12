import Blockchain from '../utils/blockchain'
import mongoose from 'mongoose'
import rp from 'request-promise'
import uuid from 'uuid/v1'
const nodeAddress = uuid().split('-').join('');
import ACIDNoSQLChainBlockModel from './ACIDNoSQLChainBlockModel'
import ACIDNoSQLChainSchedulePatientModel from '../acidnosqlchainschedule/ACIDNoSQLChainSchedulePatientModel'
import ACIDNoSQLChainScheduleClinicalModel from '../acidnosqlchainschedule/ACIDNoSQLChainScheduleClinicalModel'
import ACIDNoSQLChainScheduleAppointmentModel from '../acidnosqlchainschedule/ACIDNoSQLChainScheduleAppointmentModel'
import ACIDNoSQLChainScheduleRegistryModel from '../acidnosqlchainschedule/ACIDNoSQLChainScheduleRegistryModel'
const ACIDNoSQLChain = new Blockchain();

class ACIDNoSQLChainController {

	//create a new blockchain call blocks in MongoDB for user admin framework
	async storeBlockchainMongo(req, res) {
		//se não houver documentos adiciona o lastBlock.
		const lastBlock = ACIDNoSQLChain.getLastBlock();
		let documents = await ACIDNoSQLChainBlockModel.find()
		if (documents.length == 0) {
			await ACIDNoSQLChainBlockModel.create({ block: lastBlock })
		}
		res.json({ note: `Collection Chain created and add genesis block` })
	}

	//get entire blockchain in MongoDB to clients 
	async indexBlockchainMongo(req, res) {
		const chain = await ACIDNoSQLChainBlockModel.find()
		return res.json(chain)
	}

	// get entire blockchain current in server
	async indexBlockchain(req, res) {
		res.send(ACIDNoSQLChain);
	}

	// register a node with the network
	async storeNode(req, res) {
		const newNodeUrl = req.body.newNodeUrl;
		const nodeNotAlreadyPresent = ACIDNoSQLChain.networkNodes.indexOf(newNodeUrl) == -1;
		const notCurrentNode = ACIDNoSQLChain.currentNodeUrl !== newNodeUrl;
		if (nodeNotAlreadyPresent && notCurrentNode) {
			ACIDNoSQLChain.networkNodes.push(newNodeUrl)
		}
		res.json({ note: 'New node registered successfully.' });
	}

	// register multiple nodes at once
	async storeNodeMultiple(req, res) {
		const allNetworkNodes = req.body.allNetworkNodes;
		allNetworkNodes.forEach(networkNodeUrl => {
			const nodeNotAlreadyPresent = ACIDNoSQLChain.networkNodes.indexOf(networkNodeUrl) == -1;
			const notCurrentNode = ACIDNoSQLChain.currentNodeUrl !== networkNodeUrl;
			if (nodeNotAlreadyPresent && notCurrentNode) ACIDNoSQLChain.networkNodes.push(networkNodeUrl);
		});
		res.json({ note: 'Bulk registration successful.' });
	}

	// register a node and broadcast it the network
	async storeBroadcastNode(req, res) {
		const newNodeUrl = req.body.newNodeUrl;
		if (ACIDNoSQLChain.networkNodes.indexOf(newNodeUrl) == -1) {
			ACIDNoSQLChain.networkNodes.push(newNodeUrl)
		}
		const regNodesPromises = [];
		ACIDNoSQLChain.networkNodes.forEach(networkNodeUrl => {
			const requestOptions = {
				uri: networkNodeUrl + '/node',
				method: 'POST',
				body: { newNodeUrl: newNodeUrl },
				json: true
			};
			regNodesPromises.push(rp(requestOptions));
		})
		Promise.all(regNodesPromises)
			.then(data => {
				const bulkRegisterOptions = {
					uri: newNodeUrl + '/node/multiple',
					method: 'POST',
					body: { allNetworkNodes: [...ACIDNoSQLChain.networkNodes, ACIDNoSQLChain.currentNodeUrl] },
					json: true
				};
				return rp(bulkRegisterOptions);
			})
			.then(data => {
				res.json({ note: 'New node registered with network successfully.' });
			});
	}

	// create a new transaction
	async storeTransaction(req, res) {
		const newTransaction = req.body;
		const blockIndex = ACIDNoSQLChain.addTransactionToPendingTransactions(newTransaction);
		res.json({ note: `Transaction will be added in block ${blockIndex}.` });
	}

	// broadcast transaction
	async storeBroadcastTransaction(req, res) {
		const newTransaction = ACIDNoSQLChain.createNewTransaction(
			req.body.name, req.body.patientId, req.body.clinicalId, req.body.date,
			1.5, nodeAddress);
		ACIDNoSQLChain.addTransactionToPendingTransactions(newTransaction);
		const requestPromises = [];
		ACIDNoSQLChain.networkNodes.forEach(networkNodeUrl => {
			const requestOptions = {
				uri: networkNodeUrl + '/transaction',
				method: 'POST',
				body: newTransaction,
				json: true
			};
			requestPromises.push(rp(requestOptions));
		})
		Promise.all(requestPromises)
			.then(data => {
				res.json({ note: 'Transaction created and broadcast successfully.' });
			});
	}

	// receive new block
	async storeBlock(req, res) {
		const newBlock = req.body.newBlock;
		const lastBlock = ACIDNoSQLChain.getLastBlock();
		const correctHash = lastBlock.hash === newBlock.previousBlockHash;
		const correctIndex = lastBlock['index'] + 1 === newBlock['index'];

		if (correctHash && correctIndex) {
			ACIDNoSQLChain.chain.push(newBlock);
			ACIDNoSQLChain.pendingTransactions = [];
			res.json({
				note: 'New block received and accepted.',
				newBlock: newBlock
			});
		} else {
			res.json({
				note: 'New block rejected.',
				newBlock: newBlock
			});
		}

	}

	// indexConsensu
	async indexConsensu(req, res) {
		const requestPromises = [];
		ACIDNoSQLChain.networkNodes.forEach(networkNodeUrl => {
			const requestOptions = {
				uri: networkNodeUrl + '/blockchain/server',
				method: 'GET',
				json: true
			};
			requestPromises.push(rp(requestOptions));
		});
		Promise.all(requestPromises)
			.then(blockchains => {
				const currentChainLength = ACIDNoSQLChain.chain.length;
				let maxChainLength = currentChainLength;
				let newLongestChain = null;
				let newPendingTransactions = null;

				blockchains.forEach(blockchain => {
					if (blockchain.chain.length > maxChainLength) {
						maxChainLength = blockchain.chain.length;
						newLongestChain = blockchain.chain;
						newPendingTransactions = blockchain.pendingTransactions;
					};
				});

				if (!newLongestChain || (newLongestChain && !ACIDNoSQLChain.chainIsValid(newLongestChain))) {
					res.json({
						note: 'Current chain has not been replaced.',
						chain: ACIDNoSQLChain.chain
					});
				}
				else {
					ACIDNoSQLChain.chain = newLongestChain;
					ACIDNoSQLChain.pendingTransactions = newPendingTransactions;
					res.json({
						note: 'This chain has been replaced.',
						chain: ACIDNoSQLChain.chain
					});
				}
			});
	}

	// mine a block
	async indexMine(req, res) {

		const lastBlock = ACIDNoSQLChain.getLastBlock();
		const previousBlockHash = lastBlock['hash'];
		const currentBlockData = {
			transactions: ACIDNoSQLChain.pendingTransactions,
			index: lastBlock['index'] + 1
		};
		const nonce = ACIDNoSQLChain.proofOfWork(previousBlockHash, currentBlockData);
		const blockHash = ACIDNoSQLChain.hashBlock(previousBlockHash, currentBlockData, nonce);
		const newBlock = ACIDNoSQLChain.createNewBlock(nonce, previousBlockHash, blockHash);
		const requestPromises = [];
		ACIDNoSQLChain.networkNodes.forEach(networkNodeUrl => {
			const requestOptions = {
				uri: networkNodeUrl + '/block',
				method: 'POST',
				body: { newBlock: newBlock },
				json: true
			};
			requestPromises.push(rp(requestOptions));
		});
		Promise.all(requestPromises)
			.then(data => {
				const requestOptions = {
					uri: ACIDNoSQLChain.currentNodeUrl + '/transaction/broadcast',
					method: 'POST',
					body: {
						rate: 1.5,
						sender: "00",
						mine: nodeAddress
					},
					json: true
				};
				return rp(requestOptions);
			})
			.then(data => {
				res.json({
					note: "New block mined & broadcast successfully",
					block: newBlock
				});
			})
		let blocks = []
		let arrayBlockHash = []
		let newBlockTransactions = newBlock.transactions.filter(e => {
			return e.patientId != undefined
		})
		let blockchain = await ACIDNoSQLChainBlockModel.find()
		blockchain.forEach(e => {
			arrayBlockHash.push(e.block.hash)
			blocks.push(e.block.index)
		})
		function arrayMax(arr) {
			return arr.reduce(function (p, v) {
				return (p > v ? p : v);
			});
		}
		newBlock.index = arrayMax(blocks) + 1
		newBlock.previousBlockHash = arrayBlockHash.pop()

		//Add transactions Blockchain + ACID
		const session = await mongoose.startSession({ readConcern: { level: 'snapshot' }, writeConcern: { w: 'majority' } })
		session.startTransaction()
		try {
			await ACIDNoSQLChainBlockModel.create([{ block: newBlock }]).then(() => {
				newBlockTransactions.forEach(e => {
					ACIDNoSQLChainScheduleAppointmentModel.create(e).then(() => { })
				})
			}, { session })
			await session.commitTransaction()
		} catch (err) {
			await session.abortTransaction()
		} finally {
			session.endSession()
		}
	}

	async storePatient(req, res) {
		try {
			const patient = await ACIDNoSQLChainSchedulePatientModel.create(req.body)
			res.json(patient)
		} catch (err) {
			throw err
		}
	}

	async storeClinical(req, res) {
		try {
			const clinical = await ACIDNoSQLChainScheduleClinicalModel.create(req.body)
			res.json(clinical)
		} catch (err) {
			throw err
		}
	}


	async updateAppointment(req, res) {
		const sessionAppointment = await mongoose.startSession()
		sessionAppointment.startTransaction({
			readConcern: { level: 'snapshot' },
			writeConcern: { w: 'majority' }
		})
		try {
			let appointments = await ACIDNoSQLChainScheduleAppointmentModel.find().session(sessionAppointment)
			let doctors = appointments.filter(e => {
				return e.name == req.params.name
			})
			doctors.forEach(async e => {
				e.date = req.body.date
				if (e.name == req.params.name) {
					await ACIDNoSQLChainScheduleAppointmentModel.updateMany({ date: e.date }).session(sessionAppointment)
					await sessionAppointment.commitTransaction()
				}
			})
			res.json({ message: "OK" })
		} catch (err) {
			await sessionAppointment.abortTransaction()
		} finally {
			sessionAppointment.endSession()
		}
	}


	async storeRegistry(req, res) {
		const sessionRegistry = await mongoose.startSession()
		sessionRegistry.startTransaction({
			readConcern: { level: 'snapshot' },
			writeConcern: { w: 'majority' }
		})
		try {
			let appointments = await ACIDNoSQLChainScheduleAppointmentModel.find().session(sessionRegistry)
			let appointment = appointments.filter(e => {
				return e.patientId == req.body.patientId && e.date == req.body.oldDate
					&& req.body.clinicalId == e.clinicalId
			})
			appointment.forEach(e => {
				e.date = req.body.newDate
			})
			await ACIDNoSQLChainScheduleAppointmentModel.findByIdAndUpdate(appointment[0]._id, appointment[0])
				.session(sessionRegistry)
			let registry = await ACIDNoSQLChainScheduleRegistryModel.create([req.body], { sessionRegistry })
			await sessionRegistry.commitTransaction()
			res.json(registry)
		} catch (err) {
			await sessionRegistry.abortTransaction()
		} finally {
			sessionRegistry.endSession()
		}
	}

	async criaRegistro(req, res) {
		try {
			let c = await ACIDNoSQLChainScheduleRegistryModel.create(req.body)
			res.json(c)
		} catch (err) {
			throw err
		}
	}

	async storeAppointment(req, res) {
		try {
			let appointment = await ACIDNoSQLChainScheduleAppointmentModel.create(req.body)
			res.json(appointment)
		} catch (err) {
			throw err
		}
	}

	async destroyTransference(req, res) {
		const sessionTransference = await mongoose.startSession()
		sessionTransference.startTransaction({ readConcern: { level: 'snapshot' }, writeConcern: { w: 'majority' } })
		try {
			await ACIDNoSQLChainTransferenceModel.findByIdAndDelete(req.params.id).session(sessionTransference)
			await sessionTransference.commitTransaction()
			res.send()
		} catch (err) {
			await sessionTransference.abortTransaction()
		} finally {
			sessionTransference.endSession()
		}
	}

	async indexTransference(req, res) {
		try {
			const transference = await ACIDNoSQLChainTransferenceModel.find()
			res.json(transference)
		} catch (err) {
			throw err
		}
	}
}





export default new ACIDNoSQLChainController()