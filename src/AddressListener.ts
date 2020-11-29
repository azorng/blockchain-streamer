import { Pool } from './Pool'
import { SQSConsumer, SQS_QUEUES } from './AWS'

export class AddressListener {
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
