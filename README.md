# @0xsequence/collectible-lists (beta)
[![npm](https://img.shields.io/npm/v/@0xsequence/collectible-lists)](https://unpkg.com/@0xsequence/collectible-lists@latest/)

This package includes a JSON schema for token lists, and TypeScript utilities for working with collectible lists.

The JSON schema represents the technical specification for a collectible list which can be used in a dApp interface, such as Opensea Interface.

## What are collectible lists?

Sequence Collectible Lists is a specification for lists of collectible token metadata (e.g. address, name, ...) that can be used by any dApp interfaces that needs one or more lists of collectibles. This specification is a fork of https://github.com/Uniswap/token-lists for tokens that comply with the ERC-721 and ERC-1155 token standards.

Anyone can create and maintain a collectible list, as long as they follow the specification. 

Specifically an instance of a token list is a [JSON](https://www.json.org/json-en.html) blob that contains a list of 
[ERC-721](https://github.com/ethereum/EIPs/blob/master/EIPS/eip-721.md) or [ERC-1155](https://github.com/ethereum/EIPs/blob/master/EIPS/eip-1155.md) token metadata for use in dApp user interfaces.
Token list JSON must validate against the [JSON schema](https://json-schema.org/) in order to be used.
Tokens on collectible lists, and collectible lists themselves, are tagged so that users can more easily find collectibles.
Names of tokens are not validated against any pattern to allow token names in multiple languages. It's up to collectible list creators to ensure information integrity

## JSON Schema $id

The JSON schema ID is [https://github.com/0xsequence/collectible-lists/blob/master/src/tokenlist.schema.json](https://github.com/0xsequence/collectible-lists/blob/master/src/tokenlist.schema.json).

## Validating token lists

This package does not include code for token list validation. You can easily do this by including a library such as 
[ajv](https://ajv.js.org/) to perform the validation against the JSON schema. The schema is exported from the package
for ease of use.

## Authoring token lists

### Manual

The best way to manually author token lists is to use an editor that supports JSON schema validation. Most popular
code editors do, such as [IntelliJ](https://www.jetbrains.com/help/idea/json.html#ws_json_schema_add_custom) or 
[VSCode](https://code.visualstudio.com/docs/languages/json#_json-schemas-and-settings). Other editors
can be found [here](https://json-schema.org/implementations.html#editors).

The schema is registered in the [SchemaStore](https://github.com/SchemaStore/schemastore), and any file that matches
the pattern `*.tokenlist.json` should 
[automatically utilize](https://www.jetbrains.com/help/idea/json.html#ws_json_using_schemas) 
the JSON schema for the [supported text editors](https://www.schemastore.org/json/#editors).

In order for your token list to be able to be used, it must pass all JSON schema validation.

### Automated

If you want to automate token listing, e.g. by pulling from a smart contract, or other sources, you can use this
npm package to take advantage of the JSON schema for validation and the TypeScript types.
Otherwise, you are simply working with JSON. All the usual tools apply, e.g.:

```typescript
import { CollectibleList, schema } from '@0xsequence/collectible-lists'

// generate your collectible list however you like.
const myList: CollectibleList = generateMyCollectibleList();

// use a tool like `ajv` to validate your generated token list
validateMyCollectibleList(myList, schema);

// print the resulting JSON to stdout
process.stdout.write(JSON.stringify(myList));
```

## Semantic versioning

Lists include a `version` field, which follows [semantic versioning](https://semver.org/).

List versions must follow the rules:

- Increment major version when tokens are removed
- Increment minor version when tokens are added
- Increment patch version when tokens already on the list have minor details changed (name, symbol, logo URL, metadataBaseURI)

Changing a token address or chain ID is considered both a remove and an add, and should be a major version update.

Note that list versioning is used to improve the user experience, but not for security, i.e. list versions are not meant
to provide protection against malicious updates to a token list; i.e. the list semver is used as a lossy compression
of the diff of list updates. List updates may still be diffed in the client dApp.

## Deploying your list

Once you have authored the list, you can make it available at any URI. Prefer pinning your list to IPFS 
(e.g. via [pinata.cloud](https://pinata.cloud)) and referencing the list by an ENS name that resolves to the 
[contenthash](https://eips.ethereum.org/EIPS/eip-1577).

If hosted on HTTPS, make sure the endpoint is configured to send an access-control-allow-origin header to avoid CORS errors.

### Linking an ENS name to the list

An ENS name can be assigned to an IPFS hash via the [contenthash](https://eips.ethereum.org/EIPS/eip-1577) text record.
This is the preferred way of referencing your list.

## Examples

You can find a simple example of a token list in [test/schema/example.tokenlist.json](test/schema/example.tokenlist.json).

A snapshot of the Sequence default list encoded as a token list is found in [test/schema/bigexample.tokenlist.json](test/schema/bigexample.tokenlist.json).
