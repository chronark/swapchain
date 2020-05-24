import { Apis } from "bitsharesjs-ws"
import { ChainStore, FetchChain, TransactionBuilder } from "bitsharesjs"
import { getSecret } from "./secret"

/**
 * Creates a HTLC with Bitshares
 * 
 * @param from The Bitshares account from which is sent.
 * @param to The Bitshares account to which is sent.
 * @param amount The amount of assets to sent.
 * @param asset The asset to sent.
 * @param time The time in seconds for the timelock.
 * @param pKey A private key of the sender account.
 * @param node The websocket address of a Bitshares node.
 */
export async function btsCreateHtlc(from: string, to: string, amount: number, asset: string, time: number, pKey: string, node: string): Promise<void> {
    await Apis.instance(node, true).init_promise

    await ChainStore.init(false)

    const preimage = getSecret(32)

    console.log("Secret: " + preimage.secret)

    const sendAmount = {
            amount,
            asset
        }

    const res: any = await Promise.all([
            FetchChain("getAccount", from),
            FetchChain("getAccount", to),
            FetchChain("getAsset", sendAmount.asset)
            ])
            
    const [fromAccount, toAccount, sendAsset] = res;

    const tr = new TransactionBuilder()
    tr.add_type_operation( "htlc_create", {
            from: fromAccount.get("id"),
            to: toAccount.get("id"),
            amount: { amount: sendAmount.amount, asset_id: sendAsset.get("id") },
            preimage_hash: [2, preimage.hash],
            preimage_size: preimage.secret.length,
            claim_period_seconds: time
    } )

    await tr.set_required_fees()
    tr.add_signer(pKey);
    tr.broadcast();
}