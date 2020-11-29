import { Pool } from '../src/Pool'
import { BitcoinStreamer } from '../src/BitcoinStreamer'
import { sampleBlock, sampleTx } from './BitcoinData'
import { mock, instance } from 'ts-mockito'
import { SQSSender } from '../src/AWS'

beforeEach(() => {
    Pool.addresses = new Set()
    Pool.unconfirmedTxs = new Map()
})

describe('handleTx', () => {
    it('should return tx when one of the outputs is in address pool', () => {
        // Arrange
        const sender = mock(SQSSender)
        const tx = sampleTx
        Pool.addresses.add(tx.outputs[0].address)

        // Act
        const retrievedTx = new BitcoinStreamer(instance(sender)).handleTx(tx)

        // Assert
        expect(retrievedTx?.txId).toBe(tx.txId)
        expect(retrievedTx?.output).toBe(tx.outputs[0])
        expect(Pool.addresses.size).toBe(0)
    })

    it('should return undefined when none of the output addresses is in the pool', () => {
        // Arrange
        const tx = sampleTx
        const sender = mock(SQSSender)

        // Act
        const retrievedTx = new BitcoinStreamer(instance(sender)).handleTx(tx)

        // Assert
        expect(retrievedTx).toBe(undefined)
    })
})

describe('handleBlock', () => {
    it('should handle block confirmations', () => {
        // Arrange
        const block = sampleBlock
        const sender = mock(SQSSender)
        const txInBlock = 'a31b9ca81f862e2f624ba37b46b654d6839a9f1418bd13b65812609d7b9772b3'
        const txNotInBlock = 'shouldstay'
        Pool.unconfirmedTxs.set(txInBlock, 'testaddr')
        Pool.unconfirmedTxs.set(txNotInBlock, 'testaddr')

        // Act
        new BitcoinStreamer(instance(sender)).handleBlock(block)

        // Assert
        expect(Pool.unconfirmedTxs.size).toBe(1)
        expect(Pool.unconfirmedTxs.get(txInBlock)).toBe(undefined)
        expect(Pool.unconfirmedTxs.get(txNotInBlock)).not.toBe(undefined)
    })
})
