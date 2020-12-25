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
Notice: For all amounts below, 18 zeros are omitted. Users have to add 18 zeros additionally.

Prepare 3 Ethereum addresses for 1 owner, user1 and user2
Notice: the token amount below are in Ether denomination

Use owner to deploy both ERC20 and AFIRewards contracts
Verify contracts in Etherscan

Use Remix IDE to read and write to deployed smart contracts:<br>
Verify deployed contracts by calling read functions:<br>
- symbol and totalSupply function on ERC20 token contract
- DURATION function on AFIRewards contract
- User1 and user2 call the token contract the approve function:<br>
  approve(rewards_contract_address, 1000000)<br>
  1000000 is the allowance<br>

Send Tokens to users<br>
- Send 1285 tokens for user1, and 5000 tokens for user2
- Check their token balances

Use owner to deploy Rewards contract<br>
Verify contracts in Etherscan<br>

Use Remix IDE to read and write to deployed smart contracts:<br>
Set RewardDistribution to the owner(for new Rewards contract)<br>
- owner calls setRewardDistribution(ower_address)<br>
confirm this by calling isOnlyRewardDistribution()
- owner calls notifyRewardAmount(9000)<br>
confirm periodFinish and rewardRate are not zeros

Test rewardBalance mapping<br>
- owner calls getRewardBalance(user1)
- owner invokes addRewardBalance(user1, 100)
- owner calls getRewardBalance(user1) to get "100"
- owner invokes reduceRewardBalance(user1, 10)
- owner calls getRewardBalance(user1) to get "90"
<br><br>

User1 calls reward contract stake function: stake(1285)<br>

Wait for one day<br>

User1 calls Rewards contract balanceOf and earned function
- Confirm total staked supply is 1285 tokens staked
- Confirm user1 has rewards balance of 1285
- Confirm user1 has earned result of 1285

User2 calls reward contract stake function: stake(2000)

Wait for one day<br>

User2 calls Rewards contract balanceOf and earned function
- Confirm total staked supply is 3285 tokens staked
- Confirm user1 has rewards balance of 1285
- Confirm user1 has earned result of 1788

User1 claims the reward<br>
- user1 calls getReward() function
- confirm user1's token balance is now 1788 tokens

User1 withdraws staked tokens<br>
- user1 calls withdraw(user1's total token balance)
- confirm user1 now has total token balance of 3073
