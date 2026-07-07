export class BadgeDefinition {
    constructor({id = null, agencyId = null, code = '', name = '', description = '', ruleType = '', ruleThreshold = 0}) {
        this.id = id;
        this.agencyId = agencyId;
        this.code = code;
        this.name = name;
        this.description = description;
        this.ruleType = ruleType;
        this.ruleThreshold = ruleThreshold;
    }
}
