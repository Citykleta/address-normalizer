import {tokenize} from './tokenizer';
import {stream, Stream} from './stream';
import {Token, TokenCategory} from './tokens';
import {
    AST,
    BlockNode,
    CornerNode, create_between_node, create_corner_node, create_group_node,
    create_house_number_node, create_identifier_node,
    GroupNode,
    HouseNumberNode,
    IdentifierNode,
} from './nodes';

const lazy_filter = <T>(filterFunc: (item: T) => Boolean) => function* (iterable: Iterable<T>): IterableIterator<T> {
    for (const item of iterable) {
        if (filterFunc(item)) {
            yield item;
        }
    }
};

const filter_out_white_space = lazy_filter<Token>(item => item.category !== TokenCategory.WHITE_SPACE);

const parse_dash = (token_stream: Stream<Token>): HouseNumberNode => {
    token_stream.expect('#');
    return create_house_number_node(parse_identifier(token_stream));
};

const parse_no = (token_stream: Stream<Token>): HouseNumberNode => {
    token_stream.expect('no');
    token_stream.eventually('.');
    return create_house_number_node(parse_identifier(token_stream));
};

const parse_numero = (token_stream: Stream<Token>): HouseNumberNode => {
    const has_advanced = token_stream.eventually('numero') ||
        token_stream.eventually('número');

    if (!has_advanced) {
        throw new Error('Should have seen a variation of "numero"');
    }
    return create_house_number_node(parse_identifier(token_stream));
};

const parse_entre = (token_stream: Stream<Token>): BlockNode => {
    token_stream.expect('entre');
    const first = parse_identifier(token_stream);
    token_stream.expect('y');
    const second = parse_identifier(token_stream);
    return create_between_node(first, second);
};

const parse_e_slash = (token_stream: Stream<Token>): BlockNode => {
    token_stream.expect('e/');
    const first = parse_identifier(token_stream);
    token_stream.expect('y');
    const second = parse_identifier(token_stream);

    return create_between_node(first, second);
};

const parse_identifier = (token_stream: Stream<Token>, content: string[] = []): IdentifierNode => {
    const {value: next, done} = token_stream.seeNext();

    if (done === true || next.category !== TokenCategory.IDENTIFIER) {
        return create_identifier_node(content);
    }

    token_stream.eat();
    content.push(next.value);

    return parse_identifier(token_stream, content);
};

const parse_esquina = (token_stream: Stream<Token>): CornerNode => {
    token_stream.expect('esquina');
    token_stream.eventually('a');
    const first = parse_identifier(token_stream);
    if (token_stream.eventually('y')) {
        return create_corner_node(first, parse_identifier(token_stream));
    }

    return create_corner_node(first);
};

const parse_esq = (token_stream: Stream<Token>): CornerNode => {
    token_stream.expect('esq');
    token_stream.eventually('.');
    token_stream.eventually('a');
    const first = parse_identifier(token_stream);
    if (token_stream.eventually('y')) {
        return create_corner_node(first, parse_identifier(token_stream));
    }

    return create_corner_node(first);
};

const parse_y = (token_stream: Stream<Token>): CornerNode => {
    token_stream.expect('y');
    return create_corner_node(parse_identifier(token_stream));
};

const parse_group_members = (token_stream: Stream<Token>, members = []): GroupNode => {
    const {value: nextValue, done} = token_stream.seeNext();

    if (done) {
        return create_group_node(members);
    }

    const {value, category} = nextValue;

    switch (category) {
        case TokenCategory.IDENTIFIER:
            members.push(parse_identifier(token_stream));
            break;
        case TokenCategory.KEYWORD: {
            switch (value) {
                case 'no':
                    members.push(parse_no(token_stream));
                    break;
                case 'numero':
                case 'número':
                    members.push(parse_numero(token_stream));
                    break;
                case '#':
                    members.push(parse_dash(token_stream));
                    break;
                case 'entre':
                    members.push(parse_entre(token_stream));
                    break;
                case 'e/':
                    members.push(parse_e_slash(token_stream));
                    break;
                case 'esquina':
                    members.push(parse_esquina(token_stream));
                    break;
                case 'esq':
                    members.push(parse_esq(token_stream));
                    break;
                case 'y':
                    members.push(parse_y(token_stream));
                    break;
            }
            break;
        }
        case TokenCategory.PUNCTUATOR: {
            token_stream.eat();
            if (value !== '.') { // dots are ignored as they may by expansion shortcut
                return create_group_node(members);
            }
            break;
        }
        default:
            token_stream.eat(); // unkown token: skip
    }

    return parse_group_members(token_stream, members);
};

const parse_stream = (token_stream: Stream<Token>, groups: GroupNode[]): AST => {
    const {done} = token_stream.seeNext();
    if (done) {
        return {
            groups
        };
    }

    groups.push(parse_group_members(token_stream));
    return parse_stream(token_stream, groups);
};

export const parse = (source: string, groups: GroupNode[] = []): AST =>
    parse_stream(stream(filter_out_white_space(tokenize(source))), groups);
