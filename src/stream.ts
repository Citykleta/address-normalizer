export interface Stream<T extends { value: string }> extends IterableIterator<T> {
    seeNext(offset?: number): IteratorResult<T>;

    eat(offset?: number): this;

    expect(value: string): this;

    eventually(value: string): Boolean;
}

export const stream = <T extends { value: string }>(iterator: Iterator<T>): Stream<T> => {
    let buffer = [];
    return {
        [Symbol.iterator]() {
            return this;
        },
        next() {
            return buffer.length ? buffer.shift() : iterator.next();
        },
        seeNext(offset = 0) {
            if (buffer.length > offset) {
                return buffer[offset];
            }
            const next = iterator.next();
            buffer.push(next);
            return this.seeNext(offset);
        },
        eat(number = 1) {
            this.next();
            number--;
            return number === 0 ? this : this.eat(number);
        },
        expect(value) {
            const {value: next_value} = this.seeNext();
            if (next_value.value !== value) {
                throw new Error(`expected ${value} but got ${next_value.value}`);
            }
            return this.eat();
        },
        eventually(value) {
            const {value: next_value} = this.seeNext();
            const match = next_value && next_value.value === value;

            if (match) {
                this.eat();
            }

            return match;
        }
    };
};
