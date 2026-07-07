export class AwardedBadge {
    constructor({id = null, badgeDefinitionId = null, code = '', name = '', description = '', awardedAt = ''}) {
        this.id = id;
        this.badgeDefinitionId = badgeDefinitionId;
        this.code = code;
        this.name = name;
        this.description = description;
        this.awardedAt = awardedAt;
    }
}
