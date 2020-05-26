import {Apis} from "bitsharesjs-ws"
import {ChainStore, FetchChain, TransactionBuilder} from "bitsharesjs"

/**
 * Creates a transfer with Bitshares
 * 
 * @param from The Bitshares account from which is sent.
 * @param to The Bitshares account to which is sent.
 * @param amount The amount of assets to sent.
 * @param asset The asset to sent.
 * @param pKey A private key of the sender account.
 * @param node The websocket address of a Bitshares node.
 */
export async function btsTransfer(from: string, to: string, amount: number, asset: string, pKey: string, node: string): Promise<void> {
    await Apis.instance(node, true).init_promise

    await ChainStore.init(false)

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
    tr.add_type_operation( "transfer", {
            from: fromAccount.get("id"),
            to: toAccount.get("id"),
            amount: { amount: sendAmount.amount, asset_id: sendAsset.get("id") }
    } )

    await tr.set_required_fees()
    tr.add_signer(pKey);
    tr.broadcast();
}