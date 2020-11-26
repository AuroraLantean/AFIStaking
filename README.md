# AFIStaking
Test ERC20 staking into Rewards contract

## Installation
Install NodeJs v15.0.1 or above

Install dependencies:
$ yarn install
OR
$ npm install

## Run tests
$ yarn run test

## Manual tests / Workflow
Prepare 3 Ethereum addresses for 1 owner, user1 and user2
Notice: the token amount below are in Ether denomination

Use owner to deploy both ERC20 and AFIRewards contracts
Verify contracts in Etherscan

Verify deployed contracts by calling read functions:
- symbol and totalSupply function on ERC20 token contract
- DURATION function on AFIRewards contract
- User1 and user2 call the token contract the approve function:<br>
  approve(rewards_contract_address, 1000000)<br>
  1000000 is the allowance


Send Tokens to users
- Send 1285 tokens for user1, and 5000 tokens for user2
- Check their token balances

Set RewardDistribution to the owner
- owner calls setRewardDistribution(ower_address)<br>
confirm this by calling isOnlyRewardDistribution()
- owner calls notifyRewardAmount(9000)<br>
confirm periodFinish and rewardRate are not zeros


User1 calls reward contract stake function: stake(1285)

Wait for one day

User1 calls Rewards contract balanceOf and earned function
- Confirm total staked supply is 1285 tokens staked
- Confirm user1 has rewards balance of 1285
- Confirm user1 has earned result of 1285

User2 calls reward contract stake function: stake(2000)

Wait for one day

User2 calls Rewards contract balanceOf and earned function
- Confirm total staked supply is 3285 tokens staked
- Confirm user1 has rewards balance of 1285
- Confirm user1 has earned result of 1788

User1 claims the reward
- user1 calls getReward() function
- confirm user1's token balance is now 1788 tokens

User1 withdraw staked tokens
- user1 calls withdraw(user1's total token balance)
- confirm user1 now has total token balance of 3073
