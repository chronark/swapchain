/**
 * A class for handling Animals and their legs.
 *
 * @class Animal
 */
export class Animal {
  private legCount: number
  constructor(legCount: number) {
    this.legCount = legCount
  }

  /**
   * Return the number of legs this animal has.
   *
   * @returns The number of legs of the animal.
   * @memberof Animal
   */
  public getLegCount(): number {
    return this.legCount
  }
}
