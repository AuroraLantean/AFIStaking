const { expect } = require("chai");
const { BigNumber } = require("ethers");
const { ethers } = require("hardhat");

const log1 = console.log
const bigNum = (item) => BigNumber.from(item);
const base = bigNum(10).pow(18)
const SECONDS_IN_A_DAY = 86400
//const one1 = constants.One;
//const bnOne = bigNum(one1)

/*
  main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
  */
describe("describe1", function() {
  let factoryInstERC20, token1, rewards;
  let owner, user1, user2, addrs;

  beforeEach(async function () {
    [owner, user1, user2, ...addrs] = await ethers.getSigners();
    factoryInstERC20 = await ethers.getContractFactory("AriesCoin");
    token1 = await factoryInstERC20.deploy("ARIC");
    await token1.deployed();
    log1("token contract is deployed to:", token1.address);

    factoryInstRewards = await ethers.getContractFactory("Rewards");
    rewards = await factoryInstRewards.deploy(token1.address);
    await rewards.deployed();
    log1("rewards contract is deployed to:",rewards.address);
  });



  describe("Reward contract rewardsContract", function () {
    it("rewards contract run", async function () {
      let rewardRate, isOwner, bool1, bn1, bn2, data = [];

      log1('\n----------------== Get tokens');
      expect(await token1.symbol()).to.equal("ARIC");
      let ownerBalance = await token1.balanceOf(owner.address);
      expect(await token1.totalSupply()).to.equal(ownerBalance);
  
      // Transfer tokens from owner to user1
      amount1 = bigNum(1285).mul(base)
      await token1.transfer(user1.address, amount1);
      user1Balance = await token1.balanceOf(user1.address);
      expect(user1Balance).to.equal(amount1);
      log1("user1Balance:", user1Balance.toString())      
      //10000000000000000000
      ownerBalance = await token1.balanceOf(owner.address);
      log1("ownerBalance:", ownerBalance.toString())      
      //expect(ownerBalance).to.equal(amount1);

      // Transfer tokens from owner to user2
      amount1 = bigNum(5000).mul(base)
      await token1.transfer(user2.address, amount1);
      user2Balance = await token1.balanceOf(user2.address);
      expect(user2Balance).to.equal(amount1);
      log1("user2Balance:", user2Balance.toString())      
      ownerBalance = await token1.balanceOf(owner.address);
      log1("ownerBalance:", ownerBalance.toString())      

      log1('\n----------------== admin sets rewardRate via notifyRewardAmount');
      rewardRate = await rewards.rewardRate();
      log1("rewardRate1:", rewardRate)
      expect(rewardRate).to.equal(0);

      log1("\n------------== isOnlyRewardDistribution")
      isOwner = await rewards.isOwner();
      log1("isOwner:", isOwner)
      bool1 = await rewards.isOnlyRewardDistribution();
      log1("isOnlyRewardDistribution1:", bool1)
      //expect(rewardRate).to.equal(0);

      log1("\n------------== isOnlyRewardDistribution")
      log1("owner:", owner.address)
      await rewards.setRewardDistribution(owner.address);
      bool1 = await rewards.isOnlyRewardDistribution();
      log1("isOnlyRewardDistribution2:", bool1)

      log1("\n------------== getData1")
      dataRaw = await rewards.getData1();
      dataRaw.forEach((item,_) => {
        bn1 = bigNum(item)
        data.push(bn1.toString())
      });
      log1("getData1:", data, "\nblock.timestamp:", data[0], "\nperiodFinish:", data[1], "\nrewardRate:", data[2], "\nDURATION:", data[3])
      /**
      block.timestamp: 1606303156 
      periodFinish: 0 
      rewardRate: 0 
      DURATION: 604800
      */
      log1("\n------------== notifyRewardAmount")
      let reward = bigNum(9000).mul(base)
      await rewards.notifyRewardAmount(reward);

      rewardRate = await rewards.rewardRate();
      log1("rewardRate2:", rewardRate)
      let rewardRateBN1 = bigNum(rewardRate)
      log1("rewardRate2BN:", rewardRateBN1.toString())

      data = [];
      log1("reset data:", data)
      dataRaw = await rewards.getData1();
      dataRaw.forEach((item,_) => {
        bn1 = bigNum(item)
        data.push(bn1.toString())
      });
      log1("getData1:", data, "\nblock.timestamp:", data[0], "\nperiodFinish:", data[1], "\nrewardRate:", data[2], "\nDURATION:", data[3])
      //expect(rewardRate).to.equal(0);

      log1("\n--------------------== user stakes tokens")
      log1("user1:", user1.address)
      rewardsTotalSupply = await rewards.totalSupply();
      rwBalanceOf1 = await rewards.balanceOf(user1.address);
      rwTotalSupplyBn = bigNum(rewardsTotalSupply)
      rwBalanceOf1Bn = bigNum(rwBalanceOf1)
      log1("rwTotalSupplyBn:", rwTotalSupplyBn.toString(), "\nrewardsBalanceOf1Bn:", rwBalanceOf1Bn.toString())

      data = [];
      log1("reset data:", data)
      dataRaw = await rewards.getData2();
      dataRaw.forEach((item,_) => {
        //console.log(`cur= ${item}, idx= ${idx}`);
        bn1 = bigNum(item)
        data.push(bn1.toString())
      });
      log1("getData2:", data, "\nlastUpdateTime:", data[0], "\nrewardPerTokenStored:", data[1], "\nperiodFinish:", data[2], "\nrewardRate:", data[3])

      log1("\n------------== pre stake: set allowance")
      log1("reward contract addr:", rewards.address)
      allowance1 = bigNum(1000000).mul(base)
      ownerBalance = await token1.connect(user1).approve(rewards.address, allowance1);
      //expect(await token1.totalSupply()).to.equal(ownerBalance);

      log1("\n------------== stake by user1")
      bn1 = bigNum(1285).mul(base)
      await rewards.connect(user1).stake(bn1);

      blockTimestamp= await rewards.getBlockTimestamp()
      blockTimestampBn = bigNum(blockTimestamp)
      log1("blockTimestampBn:",blockTimestampBn.toString())
      await timeTravel(SECONDS_IN_A_DAY * 1)
      blockTimestamp= await rewards.getBlockTimestamp()      
      blockTimestampBn = bigNum(blockTimestamp)
      log1("blockTimestampBn:",blockTimestampBn.toString())
      
      rewardsTotalSupply = await rewards.totalSupply();
      rwBalanceOf1 = await rewards.balanceOf(user1.address);
      rwTotalSupplyBn = bigNum(rewardsTotalSupply)
      rwBalanceOf1Bn = bigNum(rwBalanceOf1)
      log1("\nrwTotalSupplyBn:", rwTotalSupplyBn.div(base).toString(), "\nrewardsBalanceOf1Bn:", rwBalanceOf1Bn.div(base).toString());

      earned1 = await rewards.earned(user1.address);
      earned1Bn = bigNum(earned1)
      log1("earned1Bn:", earned1Bn.div(base).toString());

      rewardPerToken = await rewards.rewardPerToken();
      rewardPerTokenBn = bigNum(rewardPerToken)
      log1("rewardPerTokenBn:", rewardPerTokenBn.div(base).toString());

      lastTimeRewardApplicable = await rewards.lastTimeRewardApplicable();
      lastTimeRewardApplicableBn = bigNum(lastTimeRewardApplicable)
      log1("lastTimeRewardApplicableBn:", lastTimeRewardApplicableBn.toString());

      data = [];
      log1("\nreset data:", data)
      dataRaw = await rewards.getData2();
      dataRaw.forEach((item,_) => {
        bn1 = bigNum(item)
        data.push(bn1.toString())
      });
      log1("getData2:", data, "\nlastUpdateTime:", data[0], "\nrewardPerTokenStored:", data[1], "\nperiodFinish:", data[2], "\nrewardRate:", data[3], "\nblockTimestamp:", data[4])

      //------------------------==
      log1("\n------------== pre stake: set allowance")
      log1("reward contract addr:", rewards.address)
      allowance1 = bigNum(1000000).mul(base)
      ownerBalance = await token1.connect(user2).approve(rewards.address, allowance1);
      //expect(await token1.totalSupply()).to.equal(ownerBalance);

      log1("\n------------== stake by user2")
      bn1 = bigNum(2000).mul(base)
      await rewards.connect(user2).stake(bn1);

      blockTimestamp= await rewards.getBlockTimestamp()
      blockTimestampBn = bigNum(blockTimestamp)
      log1("blockTimestampBn:",blockTimestampBn.toString())
      await timeTravel(SECONDS_IN_A_DAY * 1)
      blockTimestamp= await rewards.getBlockTimestamp()      
      blockTimestampBn = bigNum(blockTimestamp)
      log1("blockTimestampBn:",blockTimestampBn.toString())
      
      rewardsTotalSupply = await rewards.totalSupply();
      rwBalanceOf1 = await rewards.balanceOf(user1.address);
      rwTotalSupplyBn = bigNum(rewardsTotalSupply)
      rwBalanceOf1Bn = bigNum(rwBalanceOf1)
      log1("\nrwTotalSupplyBn:", rwTotalSupplyBn.div(base).toString(), "\nrewardsBalanceOf1Bn:", rwBalanceOf1Bn.div(base).toString());

      earned1 = await rewards.earned(user1.address);
      earned1Bn = bigNum(earned1)
      log1("earned1Bn:", earned1Bn.div(base).toString());

      rewardPerToken = await rewards.rewardPerToken();
      rewardPerTokenBn = bigNum(rewardPerToken)
      log1("rewardPerTokenBn:", rewardPerTokenBn.div(base).toString());

      lastTimeRewardApplicable = await rewards.lastTimeRewardApplicable();
      lastTimeRewardApplicableBn = bigNum(lastTimeRewardApplicable)
      log1("lastTimeRewardApplicableBn:", lastTimeRewardApplicableBn.toString());

      data = [];
      log1("\nreset data:", data)
      dataRaw = await rewards.getData2();
      dataRaw.forEach((item,_) => {
        //console.log(`cur= ${item}, idx= ${idx}`);
        bn1 = bigNum(item)
        data.push(bn1.toString())
      });
      log1("getData2:", data, "\nlastUpdateTime:", data[0], "\nrewardPerTokenStored:", data[1], "\nperiodFinish:", data[2], "\nrewardRate:", data[3], "\nblockTimestamp:", data[4])

      /**
      rewardPerTokenStored.add(
        lastTimeRewardApplicable()
        .sub(lastUpdateTime)
        .mul(rewardRate)
        .mul(1e18)
        .div(totalSupply())
      );
       */

      log1("\n------------== getReward")
      user1BalanceA = await token1.balanceOf(user1.address);
      //expect(user1Balance).to.equal(amount1);
      log1("user1BalanceA:", user1BalanceA.toString())      

      await rewards.connect(user1).getReward();
      /*
Sender balance: 3285000000000000000000 tokens
About to send   1788685289374501588245
      success: false , returndata length: 100
        */
      user1BalanceB = await token1.balanceOf(user1.address);
      //expect(user1Balance).to.equal(amount1);
      log1("user1BalanceB:", user1BalanceB.toString())      

      log1("\n--------------------== withdraw from reward contract by user1")
      log1("user1:", user1.address)
      rewardsTotalSupply = await rewards.totalSupply();
      rwBalanceOf1 = await rewards.balanceOf(user1.address);
      rwTotalSupplyBn = bigNum(rewardsTotalSupply)
      rwBalanceOf1Bn = bigNum(rwBalanceOf1)
      log1("rwTotalSupplyBn:", rwTotalSupplyBn.toString(), "\nrewardsBalanceOf1Bn:", rwBalanceOf1Bn.toString())

      rewardsTotalSupply = await rewards.connect(user1).withdraw(rwBalanceOf1);
      user1BalanceC = await token1.balanceOf(user1.address);
      //expect(user1Balance).to.equal(amount1);
      log1("user1BalanceC:", user1BalanceC.toString())      
      /*
      Sender balance: 1496314710625498411755 tokens
      About to send   1285000000000000000000 tokens to 
        */
    });
  });


  /*
  updateReward: rewardPerTokenStored, lastUpdateTime
  rewardRate: rewardPerTime, periodFinish, lastUpdateTime

  describe("Deployment", function () {
    it("Should do xyz", async function () {

    });
  });*/
});


const jsonrpc = '2.0'
const id = 0 //31337
const send = async (method, params = []) => await network.provider.request({ id, jsonrpc, method, params })
//web3.currentProvider.send({ id, jsonrpc, method, params })
const timeTravel = async seconds => {
  await send('evm_increaseTime', [seconds])
  await send('evm_mine')
}//module.exports = timeTravel
/**
-await network.provider.request({
  method: "evm_increaseTime",
  params: []
})
 */
