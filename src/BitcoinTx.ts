import * as bitcoinjs from 'bitcoinjs-lib'

const NETWORK = bitcoinjs.networks.testnet

export interface Output {
    address: string
    value: number
}

export class BitcoinTx {
    txId: string
    outputs: Output[]

    constructor(txHex: string) {
        const rawTx = bitcoinjs.Transaction.fromHex(txHex)
        this.txId = rawTx.getId()
        this.outputs = this.constructOutputs(rawTx)
    }

    private constructOutputs(tx: bitcoinjs.Transaction) {
        return tx.outs.flatMap(output => {
            try {
                const address = bitcoinjs.address.fromOutputScript(output.script, NETWORK)
                return {
                    address,
                    value: output.value
                }
            } catch {
                return []
            }
        })
    }

    getOutputFromAddresses(addresses: Set<string>) {
        return this.outputs.find(output => addresses.has(output.address))
    }
}
