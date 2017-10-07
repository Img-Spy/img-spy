export class Sink<T = any> {
    private subsinksUsed: { [name: string]: boolean };

    constructor(private map: (input: T) => string = () => "default") {
        this.subsinksUsed = {};

        this.start = this.start.bind(this);
        this.end = this.end.bind(this);
    }

    public start(input: T): boolean {
        const hashValue = this.map(input);
        if (this.subsinksUsed[hashValue]) {
            console.log(`Filter ${hashValue}`);
            return false;
        }

        this.subsinksUsed[hashValue] = true;
        return true;
    }

    public end(input: T): () => boolean {
        return () => {
            const hashValue = this.map(input);
            delete this.subsinksUsed[hashValue];

            return true;
        };
    }
}
