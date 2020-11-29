import { AddressListener } from './AddressListener'
import { BitcoinStreamer } from './BitcoinStreamer'

AddressListener.listen()
new BitcoinStreamer().listen()
