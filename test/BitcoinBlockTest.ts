import { sampleBlock } from 'test/BitcoinData'

describe('BitcoinBlock', () => {
    it('should parse block', () => {
        // Arrange
        const block = sampleBlock

        // Assert
        expect(block.transactions?.length).toBe(148)
        expect(block.containsTx('f6ca07b8e3bf35402bcdb4f223de012befa18f3443f939e62c3cd4084a764c53')).toBe(true)
        expect(block.containsTx('shouldbefalse')).toBe(false)
    })
})
