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

    let si = -1; // source index
    let di = 0; // destination index
    let tmp = 0;
    let remainBits = 0;
    let c = 0;

    while (si < data.length) {
      const bits = remainBits <= 5 ? 5 - remainBits : 0;
      if (remainBits < 5) {
        si += 1;
        if (si === data.length) {
          if (remainBits === 0) {
            break;
          }
          c = 0;
        } else {
          c = data.charCodeAt(si);
        }

        remainBits = 0;
      }

      if (bits > 0) {
        tmp |= (c >> (8 - bits)) & 0x1f;
      }

      dest.write(encoder.charAt(tmp), di);
      di += 1;

      remainBits = remainBits < 5 ? 8 - bits - remainBits : remainBits - 5;
      tmp = (remainBits <= 5 ? (c << (5 - remainBits)) : (c >> (remainBits - 5))) & 0x1f;
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
