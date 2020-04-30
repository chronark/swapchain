import { Animal } from "./animal"

for (let i = 0; i < 10; i++) {
  test(`should have ${i} legs`, () => {
    const animal = new Animal(i)
    expect(animal.getLegCount()).toBe(i)
  })
}
