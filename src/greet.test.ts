import {greet} from "./greet"
test("greet can say hello to a user", function () {
  var name = "Rhiele"
  expect(greet(name)).toBe("Hello Rhiele!")
})
