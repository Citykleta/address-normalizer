import {create_address, parse, tokenize} from '../src/index';

export default function (test) {
    test('parse a single identifier as a street name', t => {
        t.eq(create_address('10'), {
            street: {
                name: '10'
            }
        });

        t.eq(create_address('10 de Octubre'), {
            street: {
                name: '10 de octubre'
            }
        }, 'should have lower cased the identifier members');

        t.eq(create_address('calle Zanja'), {
            street: {
                name: 'calle zanja'
            }
        });

        t.eq(create_address('avenida 5ta'), {
            street: {
                name: 'avenida 5ta'
            }
        });

        t.eq(create_address('5ta avenida'), {
            street: {
                name: '5ta avenida',
            }
        });

        t.eq(create_address('ave 5ta'), {
            street: {
                name: 'ave 5ta',
            }
        });

        t.eq(create_address('Ave. 5ta'), {
            street: {
                name: 'avenida 5ta',
            }
        });

        t.eq(create_address('Sta. Catalina'), {
            street: {
                name: 'santa catalina'
            }
        });

        t.eq(create_address('callejon de Hammel'), {
            street: {
                name: 'callejon de hammel',
            }
        });

        t.eq(create_address('calzada de Linea'), {
            street: {
                name: 'calzada de linea',
            }
        });

    });

    test('parse number: should recognize number starting with "#"', t => {
        t.eq(create_address('#123'), {number: '123'});
        t.eq(create_address('# 123'), {number: '123'});
        t.eq(create_address('# 123a'), {number: '123a'});
        t.eq(create_address('# 123 a'), {number: '123 a'});
    });

    test('parse number: should recognize number starting with "no"', t => {
        t.eq(create_address('no 123'), {number: '123'});
        t.eq(create_address('No 123'), {number: '123'});
        t.eq(create_address('No. 123'), {number: '123'});
        t.eq(create_address('no. 123'), {number: '123'});
        t.eq(create_address('no 123a'), {number: '123a'});
        t.eq(create_address('no 123 a'), {number: '123 a'});
    });

    test('parse block: should recognize the form with "e/"', t => {
        t.eq(create_address('e/ 1ra y 3'), {
            between: [{name: '1ra'}, {name: '3'}]
        });

        t.eq(create_address('e/ calle 10 y 12'), {
            between: [{name: 'calle 10'}, {name: '12'}]
        });

        t.eq(create_address('e/calle 10 y 12'), {
            between: [{name: 'calle 10'}, {name: '12'}]
        });

    });

    test('parse block: should recognize the form with "entre"', t => {
        t.eq(create_address('entre 1ra y 3'), {
            between: [{name: '1ra'}, {name: '3'}]
        });

        t.eq(create_address('entre calle 10 y 12'), {
            between: [{name: 'calle 10'}, {name: '12'}]
        });
    });

    test('parse corner: should find out the street before', t => {
        t.eq(create_address('calle 10 esq 1ra'), {
            corner: [
                {name: '1ra'},
                {name: 'calle 10'}
            ]
        });
        t.eq(create_address('calle 10 esq a 1ra'), {
            corner: [
                {name: '1ra'},
                {name: 'calle 10'}
            ]
        });
        t.eq(create_address('calle 10 esq. a 1ra'), {
            corner: [
                {name: '1ra'},
                {name: 'calle 10'}
            ]
        });
        t.eq(create_address('calle 10 esquina a 1ra avenida'), {
            corner: [
                {name: '1ra avenida'},
                {name: 'calle 10'}
            ]
        });
    });

    test('parse corner: should recognize the form with "y"', t => {
        t.eq(create_address('esq calle 10 y 1ra'), {
            corner: [
                {name: 'calle 10'},
                {name: '1ra'}
            ]
        });
        t.eq(create_address('esq. calle 10 y 1ra'), {
            corner: [
                {name: 'calle 10'},
                {name: '1ra'}
            ]
        });
        t.eq(create_address('esquina calle 10 y 1ra'), {
            corner: [
                {name: 'calle 10'},
                {name: '1ra'}
            ]
        });
    });

    test('parse a street within a municipality', t => {
        t.eq(create_address('calle 10, Playa'), {
            street: {
                name: 'calle 10'
            },
            municipality: 'playa'
        });
    });

    test('parse a street, corner within a municipality', t => {
        t.eq(create_address('calle 10 esq. 1ra, plaza de la revolucion'), {
            corner: [{
                name: '1ra'
            }, {
                name: 'calle 10'
            }],
            municipality: 'plaza de la revolucion'
        });
    });

    test('parse street, block within municipality', t => {
        const expected = {
            between: [{
                name: '1ra'
            }, {
                name: '3'
            }],
            municipality: 'playa',
            street: {
                name: 'calle 10'
            }
        };
        t.eq(create_address('calle 10 e/1ra y 3, Playa'), expected);
    });

    test('parse street with number', t => {
        const expected = {
            number: '123',
            street: {
                name: 'calle 10'
            }
        };
        t.eq(create_address('calle 10 #123'), expected);
        t.eq(create_address('calle 10 no. 123'), expected);
        t.eq(create_address('calle 10 # 123'), expected);
    });

    test('parse corner as "S1 y s2"', t => {
        const expected = {
            corner: [
                {name: '1ra'},
                {name: 'calle 10'}
            ]
        };
        const input = 'calle 10 y 1ra';
        t.eq(create_address(input), expected);
    });

    test('parse corner as as "S1 y s2" within municipality', t => {
        const expected = {
            corner: [
                {name: '1ra'},
                {name: 'calle 10'}
            ],
            municipality: 'playa'
        };
        const input = 'calle 10 y 1ra, playa';
        t.eq(create_address(input), expected);
    });


}
