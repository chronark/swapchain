import { Apis as btsWebsocketApi } from "bitsharesjs-ws"
import { ChainStore } from "bitsharesjs"


interface BitsharesAccount {
    id: string
}

export class BitsharesAPI {
    private static instance: BitsharesAPI

    private constructor(){}

    public static async getInstance(node: string): Promise<BitsharesAPI> {
        if (!BitsharesAPI.instance) {
            BitsharesAPI.instance = await btsWebsocketApi.instance(node, true).init_promise
            await ChainStore.init(false)
        }
        return BitsharesAPI.instance
    }


    public async getAccounts(sender: string, receiver: string): Promise<BitsharesAccount[]>{
        return await this.db.get_accounts([sender, receiver])
    }

    public async getHistory(receiver: string, limit: number): Promise<BitsharesAccount[]>{
        return await btsWebsocketApi.history.get_relative_account_history(receiver, 0, limit, 0)
    }

    

}