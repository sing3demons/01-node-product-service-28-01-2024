import { customAlphabet } from 'nanoid'

const ALPHABET: string = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'

export class NanoIdService {
  private readonly alphanum = ALPHABET
  private readonly len = 11

  randomNanoId(size?: number): string {
    const nanoid = customAlphabet(this.alphanum, size ?? this.len)
    return nanoid()
  }

  static randomNanoId(): string {
    const nanoid = customAlphabet(ALPHABET, 11)
    return nanoid()
  }

  randomNanoIdWithLen(len: number): string {
    const nanoid = customAlphabet(this.alphanum, len)
    return nanoid()
  }
}
