import {Token, TokenCategory} from './tokens';

const keywords = [
    'esquina',
    'esq', // although it should be expanded, it is often used without the dot. hence its presence in keywords
    'entre',
    'y',
    'no', // same as esq
    'numero',
    'número',
    // from here, not exactly "words" as they might be attached: "e/calle 10 y 3"
    // or "#123"
    'e/',
    '#'
];

// example "Ave. de los presidentes" -> "avenida de los presidentes"
// example "Sta. Catalina" -> "santa catalina"
const expansions = {
    av: 'avenida',
    ave: 'avenida',
    sto: 'santo',
    sta: 'santa',
    stos: 'santos',
    stas: 'santas',
    no: 'número',
    esq: 'esquina'
};

const punctuators = [',', ';'];

const white_space_regexp = /\s/;


const create_token_from_category = (category: TokenCategory) => (value: string): Token => ({
    category,
    value
});

const create_white_space_token = create_token_from_category(TokenCategory.WHITE_SPACE);
const create_punctuator_token = create_token_from_category(TokenCategory.PUNCTUATOR);
const create_identifier_token = create_token_from_category(TokenCategory.IDENTIFIER);
const create_keyword_token = create_token_from_category(TokenCategory.KEYWORD);

export function* tokenize(candidate: string): IterableIterator<Token> {

    const source = candidate
        .toLowerCase()
        .trim();

    let buffer: string = '';

    const purge_buffer = (): Token => {
        const token = keywords.includes(buffer) ? create_keyword_token(buffer) : create_identifier_token(buffer);
        buffer = '';
        return token;
    };

    for (const c of source) {
        const is_white_space = white_space_regexp.test(c);
        const is_punctuator = punctuators.includes(c);

        if (is_white_space || is_punctuator) {
            const token = purge_buffer();

            if (token.value.length) {
                yield token;
            }

            yield is_white_space ? create_white_space_token(c) :
                create_punctuator_token(c);

            continue;
        }

        if (c === '.') {
            const is_expansion = buffer in expansions;

            if (is_expansion) {
                buffer = expansions[buffer];
            }

            yield purge_buffer();

            if (!is_expansion) {
                yield create_punctuator_token(c);
            }
            continue;
        }

        buffer += c;

        if (buffer === 'e/') {
            yield purge_buffer();
        }

        if (buffer === '#') {
            yield purge_buffer();
        }
    }

    if (buffer.length) {
        yield purge_buffer();
    }
}
