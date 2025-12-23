/* eslint-disable no-bitwise */
import { checkEncoder, checkPadChar } from './utils';

/**
 * The standard Base32 encoding alphabets.
 */
export const Base32StdEncoder = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';

/**
 * The "Extended Hex" Base32 encoding alphabets.
 */
export const Base32HexEncoder = '0123456789ABCDEFGHIJKLMNOPQRSTUV';

interface Base32Options {
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
      32,
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
    const destLen = this.encodeLength(data.length, padChar);
    const dest = Buffer.alloc(destLen, padChar);

    let bits = 0;
    let value = 0;
    let offset = 0;

    for (let i = 0; i < data.length; i++) {
      value = (value << 8) | data.charCodeAt(i);
      bits += 8;

      while (bits >= 5) {
        dest.writeUInt8(encoder[(value >>> (bits - 5)) & 31].charCodeAt(0), offset);
        offset++;
        bits -= 5;
      }
    }

    if (bits > 0) {
      dest.writeUInt8(encoder[(value << (5 - bits)) & 31].charCodeAt(0), offset);
      offset++;
    }

    if (padChar !== '') {
      while (offset < destLen) {
        dest.writeUInt8(padChar.charCodeAt(0), offset);
        offset++;
      }
    }

    return dest.toString();
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
    const cleanedLength = str.endsWith(padChar) && padChar !== ''
      ? str.indexOf(padChar)
      : str.length;
    const destLen = Math.floor((cleanedLength * 5) / 8);
    const dest = Buffer.alloc(destLen);

    let bits = 0;
    let value = 0;
    let offset = 0;

    for (let i = 0; i < cleanedLength; i++) {
      const idx = encoder.indexOf(str.charAt(i));
      if (idx === -1) {
        throw new Error(`Invalid character found: ${str.charAt(i)}`);
      }

      value = (value << 5) | idx;
      bits += 5;

      if (bits >= 8) {
        dest.writeUInt8((value >>> (bits - 8)) & 0xff, offset);
        offset++;
        bits -= 8;
      }
    }

    return dest.toString();
  }

  /**
   * Returns the length in bytes of the base32 encoding data.
   *
   * @param len The length in bytes of the input data.
   * @param padChar The padding character of encoding, and empty string for no padding.
   * @returns The length in bytes of the base32 encoded data.
   */
  // eslint-disable-next-line class-methods-use-this
  encodeLength(len: number, padChar: string): number {
    if (padChar === '') {
      return Math.floor((len * 8 + 4) / 5);
    }
    return Math.floor(Math.floor((len + 4) / 5) * 8);
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
