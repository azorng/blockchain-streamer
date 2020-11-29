import fs from 'fs'

export class Secrets {
    static get(name: string) {
        return fs.readFileSync(`/run/secrets/${name}`, 'utf8').trim()
    }
}
