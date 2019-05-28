export const enum NodeType {
    HOUSE_NUMBER,
    CORNER,
    BLOCK,
    IDENTIFIER,
    GROUP
}

export interface Node<NodeType> {
    type: NodeType
}

export interface HouseNumberNode extends Node<NodeType.HOUSE_NUMBER> {
    value: IdentifierNode
}

export interface IdentifierNode extends Node<NodeType.IDENTIFIER> {
    value: string;
    qualifier?: string
}

export interface BlockNode extends Node<NodeType.BLOCK> {
    value: [IdentifierNode, IdentifierNode]
}

export interface CornerNode extends Node<NodeType.CORNER> {
    value: IdentifierNode[]
}

export interface GroupNode extends Node<NodeType.GROUP> {
    members: Node<NodeType>[]
}

export interface AST {
    groups: GroupNode[]
}

export const create_house_number_node = (value: IdentifierNode): HouseNumberNode => ({
    type: NodeType.HOUSE_NUMBER,
    value
});

export const create_identifier_node = (value: string[]): IdentifierNode => ({
    type: NodeType.IDENTIFIER,
    value: value.join(' ')
});

export const create_between_node = (val1: IdentifierNode, val2: IdentifierNode): BlockNode => ({
    type: NodeType.BLOCK,
    value: [
        val1,
        val2
    ]
});

export const create_corner_node = (...args: [IdentifierNode] | [IdentifierNode, IdentifierNode]): CornerNode => ({
    type: NodeType.CORNER,
    value: [...args]
});

export const create_group_node = (members: Node<NodeType>[]): GroupNode => ({
    type: NodeType.GROUP,
    members
});
