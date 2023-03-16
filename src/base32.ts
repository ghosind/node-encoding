const base32StdEncoder = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';

interface Base32Options {
  padChar?: string;

  encoder?: string;
}

export class Base32Encoding {
  private padChar: string;

  private encoder: string;

  constructor(options?: Base32Options) {
    this.padChar = (options?.padChar && this.checkPadChar(options.padChar)) || '=';
    this.encoder = this.checkEncoder(
      options?.encoder ? options.encoder : base32StdEncoder,
      this.padChar,
    );
  }

  // eslint-disable-next-line class-methods-use-this
  encodeLength(len: number, padChar: string): number {
    return padChar === '' ? (len * 8 + 4) / 5 : ((len + 4) / 5) * 8;
  }

  // eslint-disable-next-line class-methods-use-this
  private checkEncoder(encoder: string, padChar: string): string {
    if (encoder?.length !== 32 || new TextEncoder().encode(encoder).length) {
      throw new Error('encoding alphabet is not 32-bytes.');
    }

    if (encoder.indexOf(padChar) >= 0) {
      throw new Error('padding character contained in alphabet');
    }

    return encoder;
  }

  // eslint-disable-next-line class-methods-use-this
  private checkPadChar(padChar: string): string | undefined {
    const padding = padChar[0];
    if (padding?.length <= 0) {
      return undefined;
    }

    if (padding === '\r'
      || padding === '\n'
      || padChar.charCodeAt(0) > 0xff
    ) {
      throw new Error('invalid padding character');
    }

    return padding;
  }
}

export const base32 = new Base32Encoding();
