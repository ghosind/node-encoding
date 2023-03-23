import assert from 'assert';
import { describe, it } from 'mocha';

import { Base32StdEncoder } from '../src/base32';
import { checkEncoder, checkPadChar } from '../src/utils';

describe('Test check encoder', () => {
  it('Test check encoder', () => {
    assert.doesNotThrow(() => checkEncoder(Base32StdEncoder, '=', 32));
    // @ts-ignore
    assert.throws(() => checkEncoder(undefined, '=', 32));
    assert.throws(() => checkEncoder(`${Base32StdEncoder},.`, '=', 32));
    assert.throws(() => checkEncoder('å∫ç∂´ƒ©˙ˆ∆˚¬µ˜øπœ®ß†¨√∑≈¥234567', '=', 32));
    assert.throws(() => checkEncoder(Base32StdEncoder, 'A', 32));
    assert.throws(() => checkEncoder('ABCDEFGHIJKLMNOPQRSTUVWXYZ23456\n', '=', 32));
    assert.throws(() => checkEncoder('ABCDEFGHIJKLMNOPQRSTUVWXYZ23456\r', '=', 32));
  });
});

describe('Test check pad char', () => {
  it('Test check valid pad char', () => {
    assert.doesNotThrow(() => {
      const padChar = checkPadChar('=');
      assert.equal(padChar, '=');
    });

    // get first character only
    assert.doesNotThrow(() => {
      const padChar = checkPadChar('=!');
      assert.equal(padChar, '=');
    });
  });

  it('Test check empty pad char', () => {
    assert.doesNotThrow(() => {
      const padChar = checkPadChar('');
      assert.equal(padChar, '');
    });
  });

  it('Test check invalid pad char', () => {
    assert.throws(() => checkPadChar('\n'));
    assert.throws(() => checkPadChar('\r'));
    assert.throws(() => checkPadChar('\uffff'));
  });

  it('Test check undefined or other types pad char', () => {
    assert.doesNotThrow(() => {
      // @ts-ignore
      const padChar = checkPadChar(undefined);
      assert.equal(padChar, undefined);
    });

    assert.doesNotThrow(() => {
      // @ts-ignore
      const padChar = checkPadChar(1);
      assert.equal(padChar, undefined);
    });

    assert.doesNotThrow(() => {
      // @ts-ignore
      const padChar = checkPadChar({});
      assert.equal(padChar, undefined);
    });
  });
});
