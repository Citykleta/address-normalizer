# address-normalizer

[![CircleCI](https://circleci.com/gh/Citykleta/address-normalizer.svg?style=svg)](https://circleci.com/gh/Citykleta/address-normalizer)

Javascript address normalizer for cuban address schema (tested on Havana data set).
Creates structured addresses from raw address strings.

## Installation

``npm run install --save``

or can be loaded from the [unpkg cdn](https://unpkg.com/@citykleta/habana-address-normalizer@0.1.1/dist/bundle/citykleta_address_normalizer.js)

## Usage

### create_address

The main function is ``create_address`` which takes as argument an address string and 
returns a normalized address

```typescript
interface NormalizedAddress {
    number?: string;
    street?: StreetLike;
    between?: StreetLike[];
    corner?: StreetLike[];
    district?: string;
    municipality?: string;
}

interface StreetLike {
    name: string;
}
```

It uses a basic grammar parser following the common way to define an address in Cuba

examples:
```javascript
import {create_address} from 'path/to/this/module';

create_address('Calle San Ignacio e/ Chacón y Empedrado, Havana Vieja')
// {"street":{"name":"calle san ignacio"},"between":[{"name":"chacón"},{"name":"empedrado"}],"municipality":"havana vieja"}
create_address('Calle 47 #3417 e/ 34 y 36, Playa');
// {"street":{"name":"calle 47"},"number":"3417","between":[{"name":"34"},{"name":"36"}],"municipality":"playa"}
create_address('Sta. Catalina #213 esq. Luz Caballero, Diez de Octubre')
// {"number":"213","corner":[{"name":"luz caballero"},{"name":"santa catalina"}],"municipality":"diez de octubre"}
````

**Note that <i lang="es">"municipios"</i> must be separated from the rest thanks to a punctuation sign such as comma** 

### Tokenizer

For further processing or as extension point you can directly use the tokenizer.
The ``tokenize`` function takes a string an return an iterable iterator of tokens (to see the definition of tokens refers to the types declaration files)

```javascript
import {tokenize} from 'path/to/this/module';

for (const t of tokenize('Calle San Ignacio e/ Chacón y Empedrado, Havana Vieja')){
    console.log(t);
}

/*
{ category: 2, value: 'calle' }
{ category: 0, value: ' ' }
{ category: 2, value: 'san' }
{ category: 0, value: ' ' }
{ category: 2, value: 'ignacio' }
{ category: 0, value: ' ' }
{ category: 3, value: 'e/' }
{ category: 0, value: ' ' }
{ category: 2, value: 'chacón' }
{ category: 0, value: ' ' }
{ category: 3, value: 'y' }
{ category: 0, value: ' ' }
{ category: 2, value: 'empedrado' }
{ category: 1, value: ',' }
{ category: 0, value: ' ' }
{ category: 2, value: 'havana' }
{ category: 0, value: ' ' }
{ category: 2, value: 'vieja' }
 */
````
### Parser

You can also get the abstract tree of the *very* simplified grammar using the ``parse`` function

```javascript
const ast = parse('Sta. Catalina #213 esq. Luz Caballero, Diez de Octubre');

/*
{
    'groups': [{
        'type': 4,
        'members': [
            {'type': 3, 'value': 'santa catalina'},
            {'type': 0, 'value': {'type': 3, 'value': '213'}},
            {'type': 1, 'value': [{'type': 3, 'value': 'luz caballero'}]}
        ]
    }, {
        'type': 4,
        'members': [{'type': 3, 'value': 'diez de octubre'}]
    }]
};
 */
```
