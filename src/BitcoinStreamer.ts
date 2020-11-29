import { socket } from 'zeromq/v5-compat'
import { BitcoinTx } from './BitcoinTx'
import { Pool } from './AddressPool'
import { SQSSender, SQS_QUEUES } from './AWS'
import { BitcoinBlock } from './BitcoinBlock'

const ADDRESS = process.env.ZMQ_ADDR as string

export class BitcoinStreamer {
    constructor(private sqsSender: SQSSender = new SQSSender()) {}

    listen() {
        socket('sub')
            .connect(ADDRESS)
            .subscribe('rawtx')
            .subscribe('rawblock')
            .on('message', (topic, message) => {
                if (topic.toString() === 'rawtx') {
                    const rawTx = message.toString('hex')
                    const tx = new BitcoinTx(rawTx)
                    this.handleTx(tx)
                }

                if (topic.toString() === 'rawblock') {
                    const rawBlock = message.toString('hex')
                    const block = new BitcoinBlock(rawBlock)
                    this.handleBlock(block)
                }
            })
        console.log('Listening for new transactions...')
    }

    handleTx(tx: BitcoinTx) {
        const paymentOutput = tx.getOutputFromAddresses(Pool.addresses)
        if (paymentOutput) {
            const res = {
                txId: tx.txId,
                output: paymentOutput
            }
            this.sqsSender.send(SQS_QUEUES.NEW_TX, JSON.stringify(res), 'new-tx')
            Pool.addresses.delete(paymentOutput.address)
            Pool.unconfirmedTxs.set(res.txId, res.output.address)
            console.log('New tx:')
            console.log(res)
            return res
        }
    }

    handleBlock(block: BitcoinBlock) {
        const txs = Pool.unconfirmedTxs
        Array.from(txs.keys()).forEach(txId => {
            if (block.containsTx(txId)) {
                const address = txs.get(txId)
                if (address) {
                    const res = {
                        txId,
                        address
                    }
                    this.sqsSender.send(SQS_QUEUES.TX_CONFIRMED, JSON.stringify(res), 'tx-confirmed')
                    Pool.unconfirmedTxs.delete(txId)
                    console.log('TX confirmed: ' + txId)
                }
            }
        })
    }
}
