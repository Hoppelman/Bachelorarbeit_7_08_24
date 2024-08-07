class Session {
    constructor(socketID, role) {
        this.sessionMap = new Map();
    }

    getSessionByID(id) {
        return this.sessionMap.get(id);
    }

    addSession(id, session) {
        this.sessionMap.set(id, session);
    }

    getAll() {
        return [...this.sessionMap.values()];
    }

    clearAll() {
        this.sessionMap.clear();
    }
}

module.exports = Session;