"use strict"
Object.defineProperty(exports, "__esModule", { value: true })
var greet_1 = require("./greet")
test("greet can say hello to a user", function () {
  var name = "Rhiele"
  expect(greet_1.greet(name)).toBe("Hello Rhiele!")
})
