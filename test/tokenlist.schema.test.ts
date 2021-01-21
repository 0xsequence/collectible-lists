import Ajv from 'ajv';
import { schema } from '../src';
import exampleList from './schema/example.collectiblelist.json';
import exampleNameSymbolSpecialCharacters from './schema/example-name-symbol-special-characters.collectiblelist.json';
import bigExampleList from './schema/bigexample.collectiblelist.json';
import exampleListMinimum from './schema/exampleminimum.collectiblelist.json';
import emptyList from './schema/empty.collectiblelist.json';
import bigWords from './schema/bigwords.collectiblelist.json';
import invalidTokenAddress from './schema/invalidtokenaddress.collectiblelist.json';
import invalidTimestamp from './schema/invalidtimestamp.collectiblelist.json';
import invalidmetadatabaseuri from './schema/invalidmetadatabaseuri.1.collectiblelist.json';
import invalidLogoURI1 from './schema/invalidlogouri.1.collectiblelist.json';
import invalidLogoURI2 from './schema/invalidlogouri.2.collectiblelist.json';
import invalidVersion1 from './schema/invalidversion.1.collectiblelist.json';
import invalidVersion2 from './schema/invalidversion.2.collectiblelist.json';
import invalidVersion3 from './schema/invalidversion.3.collectiblelist.json';
import extensionsValid from './schema/extensions-valid.collectiblelist.json';
import extensionsInvalid from './schema/extensions-invalid.collectiblelist.json';

const ajv = new Ajv({ allErrors: true, format: 'full' });
const validator = ajv.compile(schema);

describe('schema', () => {
  it('is valid', () => {
    expect(ajv.validateSchema(schema)).toEqual(true);
  });

  function checkSchema(schema: any, valid: boolean): void {
    const isValid = validator(schema);
    expect(validator.errors).toMatchSnapshot();
    expect(isValid).toEqual(valid);
  }

  it('works for example schema', () => {
    checkSchema(exampleList, true);
  });

  it('works for special characters schema', () => {
    checkSchema(exampleNameSymbolSpecialCharacters, true);
  });

  it('works for big example schema', () => {
    checkSchema(bigExampleList, true);
  });

  it('minimum example schema', () => {
    checkSchema(exampleListMinimum, true);
  });

  it('requires name, timestamp, version, tokens', () => {
    checkSchema({}, false);
  });

  it('empty list fails', () => {
    checkSchema(emptyList, false);
  });

  it('fails with big names', () => {
    checkSchema(bigWords, false);
  });

  it('checks token address', () => {
    checkSchema(invalidTokenAddress, false);
  });

  it('invalid timestamp', () => {
    checkSchema(invalidTimestamp, false);
  });

  it('invalid metadata URI', () => {
    checkSchema(invalidmetadatabaseuri, false);
  });

  it('invalid logo URI', () => {
    checkSchema(invalidLogoURI1, false);
    checkSchema(invalidLogoURI2, false);
  });

  it('checks version', () => {
    checkSchema(invalidVersion1, false);
    checkSchema(invalidVersion2, false);
    checkSchema(invalidVersion3, false);
  });

  it('checks extensions', () => {
    checkSchema(extensionsValid, true);
    checkSchema(extensionsInvalid, false);
  });

  it('allows up to 10k tokens', () => {
    const exampleListWith10kTokens = {
      ...exampleList,
      tokens: [...Array(10000)].map(() => exampleList.tokens[0]),
    };
    checkSchema(exampleListWith10kTokens, true);
  });

  it('fails with 10001 tokens', () => {
    const exampleListWith10kTokensPlusOne = {
      ...exampleList,
      tokens: [...Array(10001)].map(() => exampleList.tokens[0]),
    };
    checkSchema(exampleListWith10kTokensPlusOne, false);
  });
});
