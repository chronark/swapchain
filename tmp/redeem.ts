/* eslint-disable @typescript-eslint/camelcase */
import { Apis } from "bitsharesjs-ws"
import { ChainStore, FetchChain, TransactionBuilder } from "bitsharesjs"
import { getSecret } from "./secret"

/**
 * Redeems an HTLC
 *
 * @param to The Bitshares account to which is sent.
 * @param pKey A private key of the sender account.
 * @param node The websocket address of a Bitshares node.
 * @param htlcObject The HTLC that is about to be unlocked.
 */
export async function btsRedeemHtlc(to: string, pKey: string, node: string, htlcObject: string): Promise<void> {
  await Apis.instance(node, true).init_promise

  await ChainStore.init(false)

  const preimage = getSecret(32) // wir brauchen genau das Preimage, was bei Nico im createHtlc schon erstellt wird

  const res: any = await Promise.all([FetchChain("getAccount", to), FetchChain("getObject", htlcObject)])

  const [toAccount, transaction] = res

  const tr = new TransactionBuilder()
  tr.add_type_operation("htlc_redeem", {
    to: toAccount.get("id"),
    preimage_secret: [2, preimage.secret],
    htlc_id: transaction.get("id"), // For sure not the right ID but a start ;-)
  })

  await tr.set_required_fees()
  tr.add_signer(pKey)
  tr.broadcast()
}
