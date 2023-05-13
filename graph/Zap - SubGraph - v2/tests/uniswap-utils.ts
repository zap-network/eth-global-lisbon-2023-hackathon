import { newMockEvent } from "matchstick-as"
import { ethereum, BigInt } from "@graphprotocol/graph-ts"
import { RewardsSent } from "../generated/Uniswap/Uniswap"

export function createRewardsSentEvent(amount: BigInt): RewardsSent {
  let rewardsSentEvent = changetype<RewardsSent>(newMockEvent())

  rewardsSentEvent.parameters = new Array()

  rewardsSentEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )

  return rewardsSentEvent
}
