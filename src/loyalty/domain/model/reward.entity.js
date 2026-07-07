export class Reward {
    constructor({id = null, name = '', description = '', pointsCost = 0, stock = null, isActive = true}) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.pointsCost = pointsCost;
        this.stock = stock;
        this.isActive = isActive;
    }
}
