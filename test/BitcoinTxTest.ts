import { sampleTx } from 'test/BitcoinData'
import { BitcoinTx } from '../src/BitcoinTx'

describe('BitcoinTx', () => {
    it('should create valid tx from raw tx hex', () => {
        // Arrange
        const tx = sampleTx
        const expectedOutputAddress1 = 'tb1qt4f3xlvyrswcynhl0mwr0u88npp4jwhltgmmse'
        const expectedValueOutputAddr1 = 2784940
        const expectedOutputAddress2 = 'tb1qly9s9x98rfkkgk207wg4q7k4vjlyxafnr2uuer'
        const expectedValueOutputAddr2 = 32004276

        // Act
        const output1 = tx.getOutputFromAddresses(new Set([expectedOutputAddress1]))
        const output2 = tx.getOutputFromAddresses(new Set([expectedOutputAddress2]))

        // Assert
        expect(tx.txId).toBe('5fe16e31615582a908f20b6b9354527e82f2ead5ae5156ad448397ef9734c8f6')
        expect(tx.outputs?.length).toBe(2)
        expect(output1?.address).toBe(expectedOutputAddress1)
        expect(output1?.value).toBe(expectedValueOutputAddr1)
        expect(output2?.address).toBe(expectedOutputAddress2)
        expect(output2?.value).toBe(expectedValueOutputAddr2)
    })
})
