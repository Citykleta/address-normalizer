import {stream} from '../src';

const serie = function* (limit = 10) {
    let i = 0;
    while (i < limit) {
        yield {value: i.toString()};
        i++;
    }
};
export default function (test) {
    test('stream should be an iterable iterator', t => {
        const s = stream(serie());
        t.ok(s[Symbol.iterator], 'symbol.iterator should be defined');
        t.ok(s.next, 'next should be defined');
        t.eq([...s], [...serie()]);
    });

    test('seeNext method: should show the coming value without advancing the stream', t => {
        const s = stream(serie());
        t.eq(s.seeNext().value, {value: '0'});
        t.eq(s.seeNext().value, {value: '0'});
        t.eq(s.next().value, {value: '0'});
        t.eq(s.seeNext().value, {value: '1'});
        t.eq(s.seeNext().value, {value: '1'});
        t.eq(s.next().value, {value: '1'});
    });

    test('eat method: should advance the stream', t => {
        const s = stream(serie());
        s.eat();
        t.eq(s.seeNext().value, {value: '1'});
        s.eat(2);
        t.eq(s.seeNext().value, {value: '3'});
    });

    test('expect method: should check the next value matches an input and advance the stream in case of success', t => {
        const s = stream(serie());
        s.expect('0');
        t.eq(s.seeNext().value, {value: '1'});
        s.expect('1');
        t.eq(s.seeNext().value, {value: '2'});
    });

    test('expect method: should throw if the argument does not match the next value in the stream', t => {
        const s = stream(serie());
        t.throws(() => {
            s.expect('1');
        }, 'expected 0 but got 1');
    });

    test('eventually method: should advance the stream if the next value matches the argument', t => {
        const s = stream(serie());
        t.ok(s.eventually('0'));
        t.eq(s.seeNext().value, {value: '1'});
    });

    test('eventually method: should not advance the stream if the next value does not matche the argument', t => {
        const s = stream(serie());
        t.falsy(s.eventually('4'));
        t.eq(s.seeNext().value, {value: '0'});
    });
};
