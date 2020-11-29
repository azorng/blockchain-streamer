import { AddressPoolListener } from './AddressPool'
import { BitcoinStreamer } from './BitcoinStreamer'

AddressPoolListener.listen()
new BitcoinStreamer().listen()
