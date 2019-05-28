import {BlockNode, CornerNode, HouseNumberNode, IdentifierNode, NodeType} from './nodes';
import {parse} from './parser';

export interface NormalizedAddress {
    number?: string;
    street?: StreetLike;
    between?: StreetLike[];
    corner?: StreetLike[];
    district?: string;
    municipality?: string;
}

export interface StreetLike {
    name: string;
}

const create_street_like = (node: IdentifierNode): StreetLike => ({
    name: node.value
});

export const create_address = (candidate: string): NormalizedAddress => {
    const {groups} = parse(candidate);
    let address: NormalizedAddress = {};
    for (let i = 0; i < groups.length; i++) {
        const group = groups[i];
        for (const p of group.members) {
            switch (p.type) {
                case NodeType.IDENTIFIER: {
                    const n = (<IdentifierNode>p);
                    if (i === 0 || n.qualifier) {
                        address.street = create_street_like(n);
                    } else if (i === groups.length - 1) {
                        address.municipality = n.value;
                    }
                    break;
                }
                case NodeType.CORNER: {
                    const n = (<CornerNode>p);
                    const corner_value = n.value.map(create_street_like);
                    if (corner_value.length === 1) {
                        corner_value.push(address.street);
                        delete address['street'];
                    }
                    address.corner = corner_value;
                    break;
                }
                case NodeType.HOUSE_NUMBER: {
                    address.number = (<HouseNumberNode>p).value.value;
                    break;
                }
                case NodeType.BLOCK: {
                    const {value} = <BlockNode>p;
                    if (value.length === 2) {
                        address.between = <[StreetLike, StreetLike]>value.map(create_street_like);
                    }
                    break;
                }
                default:
                // unknown node -> do nothing
            }
        }
    }

    return address;
};
