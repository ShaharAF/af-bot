module.exports = class Issue {
    //build issue from JSON

    constructor(json) {
        try {
            this.title = json.title
            this.state = json.state
            this.locked = json.locked
            this.lastUpdate = new Date(json.updated_at)
            this.deltaDays = this.getDeltaDaysSinceLastUpdate()
            this.number = json.number
            // console.log(json)
        } catch (e) {
            console.log('JSON error in initializing Issue object')
        }
    }

    getDeltaDaysSinceLastUpdate() {
        const now = new Date()
        const delta = now - this.lastUpdate
        return Math.floor(delta / (1000 * 60 * 60 * 24))
    }
}