import AWS from 'aws-sdk'
import { Consumer } from 'sqs-consumer'
import { Secrets } from './Secrets'

const AWS_PUB = 'AKIATORPHGZDABHE26V7'
const AWS_REGION = 'eu-west-3'

export const SQS_QUEUES = {
    NEW_TX: 'https://sqs.eu-west-3.amazonaws.com/237395981894/new-tx.fifo',
    LISTEN_ADDRESS: 'https://sqs.eu-west-3.amazonaws.com/237395981894/listen-address',
    TX_CONFIRMED: 'https://sqs.eu-west-3.amazonaws.com/237395981894/tx-confirmed.fifo'
}

AWS.config.update({
    accessKeyId: AWS_PUB,
    secretAccessKey: Secrets.get('aws_secret'),
    region: AWS_REGION
})

const SQS = new AWS.SQS()

export class SQSSender {
    send(queueUrl: string, message: string, groupId: string) {
        SQS.sendMessage({
            MessageBody: message,
            QueueUrl: queueUrl,
            MessageGroupId: groupId
        }).promise()
    }
}

export class SQSConsumer {
    consumer: Consumer

    constructor(queueUrl: string, handleMessage: (message: AWS.SQS.Message) => Promise<void>) {
        this.consumer = Consumer.create({
            queueUrl,
            handleMessage,
            sqs: SQS
        })
        this.setOnErrors()
    }

    public start() {
        this.consumer.start()
        return this
    }

    private setOnErrors() {
        this.consumer.on('error', err => {
            console.error(err.message)
        })

        this.consumer.on('processing_error', err => {
            console.error(err.message)
        })

        this.consumer.on('timeout_error', err => {
            console.error(err.message)
        })
    }
}
