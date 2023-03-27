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
}

/**
 * The builtin Base32 encoding instance with the standard encoder alphabets and the padding
 * character `'='`.
 */
export const base32 = new Base32Encoding();
