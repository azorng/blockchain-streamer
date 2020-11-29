import { SQSConsumer, SQS_QUEUES } from './AWS'

export class Pool {
    static addresses: Set<string> = new Set()
    static unconfirmedTxs: Map<string, string> = new Map()
}

export class AddressPoolListener {
    static listen() {
        new SQSConsumer(SQS_QUEUES.LISTEN_ADDRESS, async message => {
            if (message?.Body) {
                Pool.addresses.add(message.Body)
                console.log(Pool.addresses)
            }
        }).start()
        console.log('Listening for new addresses...')
    }
}
