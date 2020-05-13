import bcoin from "bcoin"

bcoin.set("regtest")

const blocks = bcoin.blockstore.create({
  memory: true,
})
const chain = new bcoin.Chain({
  network: "regtest",
  memory: true,
  blocks: blocks,
})
const mempool = new bcoin.Mempool({
  chain: chain,
})
const miner = new bcoin.Miner({
  chain: chain,
  mempool: mempool,
  useWorkers: true,
})

;(async () => {
  await blocks.open()
  await chain.open()

  await miner.open()

  const job = await miner.createJob()

  const block = await job.mineAsync()

  console.log("Adding %s to the blockchain.", block.rhash())
  console.log(block)
  await chain.add(block)
  console.log("Added block!")
})().catch((err) => {
  console.error(err.stack)
  process.exit(1)
})
