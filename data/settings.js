class Settings {
    constructor(data = {}) {
        this.isActive = data.isActive || true;
        this.createdOn = data.createdOn || new Date();
        this.createdBy = data.createdBy || null;
        this.lastUpdatedOn = data.lastUpdatedOn || null;
        this.lastUpdatedBy = data.lastUpdatedBy || null;
        this.deletedOn = data.deletedOn || null;
        this.deletedBy = data.deletedBy || null;
        this.useCustomColor = data.useCustomColor || null;
        this.Color = data.Color || null;
    }
}