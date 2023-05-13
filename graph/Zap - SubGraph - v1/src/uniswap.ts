import { RewardsSent as RewardsSentEvent } from "../generated/Uniswap/Uniswap"
import { RewardsSent } from "../generated/schema"

export function handleRewardsSent(event: RewardsSentEvent): void {
  let entity = new RewardsSent(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.amount = event.params.amount

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}
