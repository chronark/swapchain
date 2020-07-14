import readline from "readline"

/**
 * Get input from stdin
 *
 * @param str - A question to ask the user.
 * @returns answer from the user
 */
export async function askUser(read: readline.Interface, str: string): Promise<string> {
  return new Promise((resolve) => read.question("\u001b[36;1m" + str + "\u001b[0m", resolve))
}
