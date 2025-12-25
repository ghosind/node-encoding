/**
 * Check the encoding alphabets for BaseXX. The length in bytes of the encoder alphabets must be
 * equal to the base number, and the encoder alphabets must not be a newline character (`'\r'` or
 * `'\n'`) or the padding character.
 *
 * @param encoder The encoding alphabets for BaseXX encoding.
 * @param padChar The padding character.
 * @param base The base number.
 * @returns The valid encoder alphabets.
 * @throws The length in bytes of encoder alphabets is not equals to the base number.
 * @throws The encoder alphabets contains the padding character.
 * @throws The encoder alphabets contains the newline character ('\r' or '\n').
 */
export const checkEncoder = (encoder: string, padChar: string, base: number): string => {
  if (encoder?.length !== base || new TextEncoder().encode(encoder).length !== base) {
    throw new Error(`encoding alphabet is not ${base}-bytes.`);
  }

  for (let i = 0; i < encoder.length; i += 1) {
    const c = encoder.charAt(i);
    if (c === padChar) {
      throw new Error('encoding alphabet contains padding character');
    } else if (c === '\n' || c === '\r') {
      throw new Error('encoding alphabet contains newline character');
    }
  }

  return encoder;
};

/**
 * Check the padding character for BaseXX encoding. The character must not be the newline
 * character (`'\r'` or `'\n'`). The character can be an empty string to disabling padding.
 *
 * @param padChar The padding character.
 * @returns The padding character if it's a string, or `undefined` for no padding character set.
 * @throws The padding character is invalid.
 */
export const checkPadChar = (padChar: string): string | undefined => {
  if (typeof padChar !== 'string') {
    return undefined;
  }

  if (padChar.length <= 0) {
    return ''; // empty string for disable padding.
  }

  const padding = padChar[0];

  if (padding === '\r'
    || padding === '\n'
    || padChar.charCodeAt(0) > 0xff
  ) {
    throw new Error('invalid padding character');
  }

  return padding;
};

/**
 * Decode the Uint8Array bytes to string.
 *
 * @param bytes The bytes to decode.
 * @returns The decoded string.
 */
export const decodeBytes = (bytes: Uint8Array): string => {
  if (typeof TextDecoder !== 'undefined') {
    return new TextDecoder().decode(bytes);
  }

  if (typeof globalThis.Buffer !== 'undefined') {
    return globalThis.Buffer.from(bytes).toString();
  }

  return Array.from(bytes).map((b) => String.fromCharCode(b)).join('');
}
