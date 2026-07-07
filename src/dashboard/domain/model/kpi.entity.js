export class Kpi {
    constructor({value = 0, previousValue = 0, deltaPercentage = 0}) {
        this.value = value;
        this.previousValue = previousValue;
        this.deltaPercentage = deltaPercentage;
    }
}
