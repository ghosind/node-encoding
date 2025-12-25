/* eslint-disable no-bitwise */
import { checkEncoder, checkPadChar, decodeBytes } from './utils';

/**
 * The standard Base32 encoding alphabets.
 */
export const Base32StdEncoder = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';

/**
 * The "Extended Hex" Base32 encoding alphabets.
 */
export const Base32HexEncoder = '0123456789ABCDEFGHIJKLMNOPQRSTUV';

const BITS_PER_BYTE = 8;
const BITS_PER_CHAR = 5;
const BLOCK_BYTES = 5; // 5 bytes -> 8 Base32 chars
const BLOCK_CHARS = 8; // 8 Base32 chars per 5 bytes
const CHAR_MASK = (1 << BITS_PER_CHAR) - 1; // 0b11111 (31)
const BYTE_MASK = 0xff;
const ENCODER_LENGTH = 32;

export interface Base32Options {
  /**
   * Encoding alphabets, and it must be 32-byte string. Default `Base32StdEncoder`.
   */
  encoder?: string;

  /**
   * Padding character for padding when the encoded string in bytes is not a number to a multiple
   * of 8, or set it to empty string to disable padding. The padding character must not be newline
   * character ('\r' and '\n'), and cannot be contained in the encoding alphabets. Default '='.
   */
  padChar?: string;
}

export class Base32Encoding {
  /**
   * The default encoder alphabets.
   */
  private encoder: string;

  /**
   * The default padding character.
   */
  private padChar: string;

  /**
   * Creates a Base32 encoding instance with the optional encoder alphabets and padding character
   * settings.
   *
   * ```js
   * const base32 = new Base32Encoding({
   *   encoder: Base32HexEncoder,
   * });
   * ```
   *
   * @param options Optional settings for Base32 encoding.
   */
  constructor(options?: Base32Options) {
    let padChar: string | undefined;
    if (options?.padChar !== undefined) {
      padChar = checkPadChar(options.padChar);
    }
    this.padChar = padChar !== undefined ? padChar : '=';

    this.encoder = checkEncoder(
      options?.encoder ? options.encoder : Base32StdEncoder,
      this.padChar,
      ENCODER_LENGTH,
    );
  }

  /**
   * Encoding data with Base32 that using 33-character subset of US-ASCII, and enabling
   * 5 bits to be represented per printable character.
   *
   * ```js
   * base32.encode('foo');
   * // MZXW6===
   * ```
   *
   * @param data String to encoding.
   * @param options Optional settings about encoder string and padding character.
   * @returns The encoded string of data.
   */
  encode(data: string, options?: Base32Options): string {
    if (!data || data.length === 0) {
      return '';
    }

    const { encoder, padChar } = this.getEncoderAndPadChar(options);
    const destLen = this.getEncodeLength(data.length, padChar);
    const dest = new Uint8Array(destLen);

    let bits = 0;
    let value = 0;
    let offset = 0;

    for (let i = 0; i < data.length; i++) {
      value = (value << 8) | data.charCodeAt(i);
      bits += 8;

      while (bits >= BITS_PER_CHAR) {
        dest[offset] = encoder[(value >>> (bits - BITS_PER_CHAR)) & CHAR_MASK].charCodeAt(0);
        offset++;
        bits -= BITS_PER_CHAR;
      }
    }

    if (bits > 0) {
      dest[offset] = encoder[(value << (BITS_PER_CHAR - bits)) & CHAR_MASK].charCodeAt(0);
      offset++;
    }

    if (padChar !== '') {
      while (offset < destLen) {
        dest[offset] = padChar.charCodeAt(0);
        offset++;
      }
    }

    return decodeBytes(dest);
  }

  /**
   * Decoding a encoded string to the original data.
   *
   * ```js
   * base32.decode('MZXW6===');
   * // foo
   * ```
   *
   * @param data String to encoding.
   * @param options Optional settings about encoder string and padding character.
   * @returns The encoded string of data.
   */
  decode(str: string, options?: Base32Options): string {
    if (!str || str.length === 0) {
      return '';
    }

    const { encoder, padChar } = this.getEncoderAndPadChar(options);
    const [cleanedLength, destLen] = this.getDecodeLength(str, padChar);
    const dest = new Uint8Array(destLen);

    let bits = 0;
    let value = 0;
    let offset = 0;

    for (let i = 0; i < cleanedLength; i++) {
      const idx = encoder.indexOf(str.charAt(i));
      if (idx === -1) {
        throw new Error(`Invalid character found: ${str.charAt(i)}`);
      }

      value = (value << BITS_PER_CHAR) | idx;
      bits += BITS_PER_CHAR;

      if (bits >= BITS_PER_BYTE) {
        dest[offset] = (value >>> (bits - BITS_PER_BYTE)) & BYTE_MASK;
        offset++;
        bits -= BITS_PER_BYTE;
      }
    }

    return decodeBytes(dest);
  }

  /**
   * Returns the length in bytes of the base32 encoding data.
   *
   * @param len The length in bytes of the input data.
   * @param padChar The padding character of encoding, and empty string for no padding.
   * @returns The length in bytes of the base32 encoded data.
   */
  private getEncodeLength(len: number, padChar: string): number {
    if (padChar === '') {
      return Math.floor((len * BITS_PER_BYTE + (BITS_PER_CHAR - 1)) / BITS_PER_CHAR);
    }
    return Math.floor(Math.floor((len + (BLOCK_BYTES - 1)) / BLOCK_BYTES) * BLOCK_CHARS);
  }

  /**
   * Returns the length in bytes of cleaned string and decoded data.
   *
   * @param str The string that to decode.
   * @param padChar The padding character of decoding, and empty string for no padding.
   * @returns The length in bytes of cleaned string and decoded data.
   */
  private getDecodeLength(str: string, padChar: string): [number, number] {
    const cleanedLength = str.endsWith(padChar) && padChar !== ''
      ? str.indexOf(padChar)
      : str.length;
    const destLen = Math.floor((cleanedLength * BITS_PER_CHAR) / BITS_PER_BYTE);

    return [cleanedLength, destLen];
  }

  /**
   * Gets encoder string and padding character by options or default values.
   *
   * @param options The settings of encoder string and padding character.
   * @returns The encoder string and padding character.
   */
  private getEncoderAndPadChar(options?: Base32Options): { encoder: string, padChar: string } {
    let padChar;
    let encoder;

    if (!options || options.padChar === undefined || checkPadChar(options.padChar) === undefined) {
      padChar = this.padChar;
    } else {
      padChar = options.padChar;
    }

    if (!options || !options.encoder) {
      encoder = this.encoder;
    } else {
      encoder = options.encoder;
    }

    encoder = checkEncoder(encoder, padChar, 32);

    return {
      encoder,
      padChar,
    };
  }
}

/**
 * The builtin Base32 encoding instance with the standard encoder alphabets and the padding
 * character `'='`.
 */
export const base32 = new Base32Encoding();
