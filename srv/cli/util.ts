import readline from "readline"

/**
 * Get input from stdin
 *
 * @param str - A question to ask the user.
 * @returns answer from the user
 */
export async function askUser(str: string): Promise<string> {
  const read = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  })

  return new Promise((resolve) => read.question("\u001b[36;1m" + str + "\u001b[0m", resolve))
}
