import assert from 'assert';
import { describe, it } from 'mocha';

import { base32, Base32Encoding, Base32HexEncoder } from '../src';

describe('Test base32 encode', () => {
  it('Test encode with builtin base32 encoder', () => {
    assert.equal(base32.encode(''), '');
    assert.equal(base32.encode('f'), 'MY======');
    assert.equal(base32.encode('fo'), 'MZXQ====');
    assert.equal(base32.encode('foo'), 'MZXW6===');
    assert.equal(base32.encode('foob'), 'MZXW6YQ=');
    assert.equal(base32.encode('fooba'), 'MZXW6YTB');
    assert.equal(base32.encode('foobar'), 'MZXW6YTBOI======');
  });

  it('Test base32 encode with standard encoder and default padding character', () => {
    const encoder = new Base32Encoding();

    assert.equal(encoder.encode(''), '');
    assert.equal(encoder.encode('f'), 'MY======');
    assert.equal(encoder.encode('fo'), 'MZXQ====');
    assert.equal(encoder.encode('foo'), 'MZXW6===');
    assert.equal(encoder.encode('foob'), 'MZXW6YQ=');
    assert.equal(encoder.encode('fooba'), 'MZXW6YTB');
    assert.equal(encoder.encode('foobar'), 'MZXW6YTBOI======');
  });

  it('Test base32 encode with standard encoder and no padding character', () => {
    const encoder = new Base32Encoding({
      padChar: '',
    });

    assert.equal(encoder.encode(''), '');
    assert.equal(encoder.encode('f'), 'MY');
    assert.equal(encoder.encode('fo'), 'MZXQ');
    assert.equal(encoder.encode('foo'), 'MZXW6');
    assert.equal(encoder.encode('foob'), 'MZXW6YQ');
    assert.equal(encoder.encode('fooba'), 'MZXW6YTB');
    assert.equal(encoder.encode('foobar'), 'MZXW6YTBOI');
  });

  it('Test base32 encode with hex encoder and default padding character', () => {
    const encoder = new Base32Encoding({
      encoder: Base32HexEncoder,
    });

    assert.equal(encoder.encode(''), '');
    assert.equal(encoder.encode('f'), 'CO======');
    assert.equal(encoder.encode('fo'), 'CPNG====');
    assert.equal(encoder.encode('foo'), 'CPNMU===');
    assert.equal(encoder.encode('foob'), 'CPNMUOG=');
    assert.equal(encoder.encode('fooba'), 'CPNMUOJ1');
    assert.equal(encoder.encode('foobar'), 'CPNMUOJ1E8======');
  });

  it('Test base32 encode with hex encoder and no padding character', () => {
    const encoder = new Base32Encoding({
      encoder: Base32HexEncoder,
      padChar: '',
    });

    assert.equal(encoder.encode(''), '');
    assert.equal(encoder.encode('f'), 'CO');
    assert.equal(encoder.encode('fo'), 'CPNG');
    assert.equal(encoder.encode('foo'), 'CPNMU');
    assert.equal(encoder.encode('foob'), 'CPNMUOG');
    assert.equal(encoder.encode('fooba'), 'CPNMUOJ1');
    assert.equal(encoder.encode('foobar'), 'CPNMUOJ1E8');
  });

  it('Test base32 encode with parameter', () => {
    const encoder = new Base32Encoding();
    const options: any = {
      encoder: Base32HexEncoder,
    };

    assert.equal(encoder.encode('', options), '');
    assert.equal(encoder.encode('f', options), 'CO======');
    assert.equal(encoder.encode('fo', options), 'CPNG====');

    options.padChar = '+';
    assert.equal(encoder.encode('foo', options), 'CPNMU+++');
    assert.equal(encoder.encode('foob', options), 'CPNMUOG+');

    options.padChar = '';
    assert.equal(encoder.encode('fooba', options), 'CPNMUOJ1');
    assert.equal(encoder.encode('foobar', options), 'CPNMUOJ1E8');
  });
});

describe('Test base32 decode', () => {
  it('Test decode with builtin base32 encoder', () => {
    assert.equal(base32.decode(''), '');
    assert.equal(base32.decode('MY======'), 'f');
    assert.equal(base32.decode('MZXQ===='), 'fo');
    assert.equal(base32.decode('MZXW6==='), 'foo');
    assert.equal(base32.decode('MZXW6YQ='), 'foob');
    assert.equal(base32.decode('MZXW6YTB'), 'fooba');
    assert.equal(base32.decode('MZXW6YTBOI======'), 'foobar');
  });

  it('Test base32 decode with standard encoder and default padding character', () => {
    const decoder = new Base32Encoding();

    assert.equal(decoder.decode(''), '');
    assert.equal(decoder.decode('MY======'), 'f');
    assert.equal(decoder.decode('MZXQ===='), 'fo');
    assert.equal(decoder.decode('MZXW6==='), 'foo');
    assert.equal(decoder.decode('MZXW6YQ='), 'foob');
    assert.equal(decoder.decode('MZXW6YTB'), 'fooba');
    assert.equal(decoder.decode('MZXW6YTBOI======'), 'foobar');
  });

  it('Test base32 decode decode with standard encoder and no padding character', () => {
    const decoder = new Base32Encoding({
      padChar: '',
    });

    assert.equal(decoder.decode(''), '');
    assert.equal(decoder.decode('MY'), 'f');
    assert.equal(decoder.decode('MZXQ'), 'fo');
    assert.equal(decoder.decode('MZXW6'), 'foo');
    assert.equal(decoder.decode('MZXW6YQ'), 'foob');
    assert.equal(decoder.decode('MZXW6YTB'), 'fooba');
    assert.equal(decoder.decode('MZXW6YTBOI'), 'foobar');
  });

  it('Test base32 decode with hex encoder and default padding character', () => {
    const decoder = new Base32Encoding({
      encoder: Base32HexEncoder,
    });

    assert.equal(decoder.decode(''), '');
    assert.equal(decoder.decode('CO======'), 'f');
    assert.equal(decoder.decode('CPNG===='), 'fo');
    assert.equal(decoder.decode('CPNMU==='), 'foo');
    assert.equal(decoder.decode('CPNMUOG='), 'foob');
    assert.equal(decoder.decode('CPNMUOJ1'), 'fooba');
    assert.equal(decoder.decode('CPNMUOJ1E8======'), 'foobar');
  });

  it('Test base32 decode with hex encoder and no padding character', () => {
    const decoder = new Base32Encoding({
      encoder: Base32HexEncoder,
      padChar: '',
    });

    assert.equal(decoder.decode(''), '');
    assert.equal(decoder.decode('CO'), 'f');
    assert.equal(decoder.decode('CPNG'), 'fo');
    assert.equal(decoder.decode('CPNMU'), 'foo');
    assert.equal(decoder.decode('CPNMUOG'), 'foob');
    assert.equal(decoder.decode('CPNMUOJ1'), 'fooba');
    assert.equal(decoder.decode('CPNMUOJ1E8'), 'foobar');
  });

  it('Test base32 decode with parameter', () => {
    const decoder = new Base32Encoding();
    const options: any = {
      encoder: Base32HexEncoder,
    };

    assert.equal(decoder.decode('', options), '');
    assert.equal(decoder.decode('CO======', options), 'f');
    assert.equal(decoder.decode('CPNG====', options), 'fo');

    options.padChar = '+';
    assert.equal(decoder.decode('CPNMU+++', options), 'foo');
    assert.equal(decoder.decode('CPNMUOG+', options), 'foob');

    options.padChar = '';
    assert.equal(decoder.decode('CPNMUOJ1', options), 'fooba');
    assert.equal(decoder.decode('CPNMUOJ1E8', options), 'foobar');
  });
});
