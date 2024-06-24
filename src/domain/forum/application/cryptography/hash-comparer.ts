/* eslint-disable prettier/prettier */
export abstract class HashComparer {
  abstract compare(plain: string, hash: string): Promise<boolean>
}
