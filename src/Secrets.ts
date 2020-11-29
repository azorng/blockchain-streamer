import fs from 'fs'

export class Secrets {
    static get(name: string) {
        try {
            return fs.readFileSync(`/run/secrets/${name}`, 'utf8').trim()
        } catch {
            return ''
        }
    }
}
