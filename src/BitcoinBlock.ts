import * as bitcoinjs from 'bitcoinjs-lib'

export class BitcoinBlock {
    transactions
    constructor(rawBlockHex: string) {
        const block = bitcoinjs.Block.fromHex(rawBlockHex)
        this.transactions = block.transactions
    }

    containsTx(txId: string) {
        if (!this.transactions) return false
        return this.transactions.some(tx => tx.getId() == txId)
    }
}
