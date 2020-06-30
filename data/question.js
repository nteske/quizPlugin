class Question {
    constructor(data = {}) {
        this.isActive = data.isActive || true;
        this.createdOn = data.createdOn || new Date();
        this.createdBy = data.createdBy || null;
        this.lastUpdatedOn = data.lastUpdatedOn || null;
        this.lastUpdatedBy = data.lastUpdatedBy || null;
        this.deletedOn = data.deletedOn || null;
        this.deletedBy = data.deletedBy || null;
        this.title = data.title || null;
        this.body = data.body || null;
        this.type = data.type || null;
        this.answersArray = data.answersArray || [];
        this.points = data.points || null;
    }
}