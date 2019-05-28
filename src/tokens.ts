export const enum TokenCategory {
    WHITE_SPACE,
    PUNCTUATOR,
    IDENTIFIER,
    KEYWORD
}

export interface Token {
    category: TokenCategory,
    value: string
}
