export class Page {
    constructor(public page: number, public size: number) {
    }

    skip() {
        return (this.page - 1) * this.size;
    }
}