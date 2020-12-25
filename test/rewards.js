const { expect } = require("chai");
const { BigNumber } = require("ethers");
const { exists } = require("fs");
const { ethers } = require("hardhat");

const log1 = console.log;
const bigNum = (item) => BigNumber.from(item);
const base = bigNum(10).pow(18);
//amount1 = bigNum(1285).mul(base);

const SECONDS_IN_A_DAY = 86400;
//const one1 = constants.One;
//const bnOne = bigNum(one1)
const fromWei = (weiAmount) => {
  weiAmountBn = BigNumber.from(weiAmount);
  return web3.utils.fromWei(weiAmountBn.toString(), "ether");
};
const toWei = (amount) => {
  amount = BigNumber.from(amount);
  return (weiAmount = web3.utils.toWei(amount.toString(), "ether"));
};
/*
  main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
  */
describe("describe1", function () {
  let factoryInstLpToken,
    erc20,
    lpToken,
    factoryInstRwToken,
    rwToken,
    instRewardsCtrt;
  let owner, user1, user2, addrs;

  beforeEach(async function () {
    [owner, user1, user2, ...addrs] = await ethers.getSigners();
    factoryInstLpToken = await ethers.getContractFactory("AriesCoin");
    lpToken = await factoryInstLpToken.deploy("LpToken");
    await lpToken.deployed();
    log1("token contract is deployed to:", lpToken.address);
    erc20 = lpToken;

    factoryInstRwToken = await ethers.getContractFactory("AriesCoin");
    rwToken = await factoryInstRwToken.deploy("RewardToken");
    await rwToken.deployed();
    log1("token contract is deployed to:", rwToken.address);

    factoryInstRewards = await ethers.getContractFactory("Rewards");
    instRewardsCtrt = await factoryInstRewards.deploy(
      lpToken.address,
      rwToken.address
    );
    await instRewardsCtrt.deployed();
    log1("rewards contract is deployed to:", instRewardsCtrt.address);
  });

  describe("Transactions erc20", function () {
    it("Should fail if sender doesn’t have enough tokens", async function () {
      const initialOwnerBalance = await erc20.balanceOf(owner.address);
      // Try to send 1 token from user1 (0 tokens) to owner (1000 tokens). `require` will evaluate false and revert the transaction.
      await expect(
        erc20.connect(user1).transfer(owner.address, 1)
      ).to.be.revertedWith("Not enough tokens");

      // Owner balance shouldn't have changed.
      expect(await erc20.balanceOf(owner.address)).to.equal(
        initialOwnerBalance
      );
    });

    it("transfer tokens", async function () {
      log1("\n----------------== Should transfer tokens between accounts");
      //expect(await erc20.owner()).to.equal(owner.address);
      const initialOwnerBalance = await erc20.balanceOf(owner.address);
      log1("initialOwnerBalance:", fromWei(initialOwnerBalance));

      // Transfer 50 tokens from owner to user1
      await erc20.transfer(user1.address, 100);
      let user1Balance = await erc20.balanceOf(user1.address);
      expect(user1Balance).to.equal(100);

      // Transfer 50 tokens from user1 to user2
      await erc20.connect(user1).transfer(user2.address, 50);
      let user2Balance = await erc20.balanceOf(user2.address);
      expect(user2Balance).to.equal(50);

      log1("\n----------------== Should update balances after transfers");

      // Transfer 100 tokens from owner to user1.
      await erc20.transfer(user1.address, 100);

      // Check balances.
      finalOwnerBalance = await erc20.balanceOf(owner.address);
      expect(finalOwnerBalance).to.equal(bn1.sub(200));

      user1Balance = await erc20.balanceOf(user1.address);
      log1("user1Balance:", fromWei(user1Balance));
      expect(user1Balance).to.equal(150);

      user2Balance = await erc20.balanceOf(user2.address);
      log1("user2Balance:", fromWei(user2Balance));
      expect(user2Balance).to.equal(50);
    });
  });
  // describe("Deployment", function () {
  //   it("Should ...", async function () {});
  // });

  //@@@
  describe("Rewards contract rewardsContract", function () {
    it("rewards contract run", async function () {
      let rewardToNotify = 9000;
      let stakedAmount1 = 1258;
      let stakedAmount2 = 2000;
      let lpTokenPrice = 33.00001;
      let rwTokenPrice = 33.00002;

      /**
APYx: 257
rewardRate: 14880952380952380
weeklyReward: 104166666666666660
value1: 10520833333333332660
TVL: 3258
AFIWeeklyROI: 3229230611827296
APY1: 167919991815019392

*/
      let rewardRate,
        isOwner,
        bool1,
        bn1,
        data = [];

      log1("\n----------------== Get tokens");
      expect(await lpToken.symbol()).to.equal("LpToken");
      let ownerBalance = await lpToken.balanceOf(owner.address);
      expect(await lpToken.totalSupply()).to.equal(ownerBalance);

      // Transfer tokens from owner to user1
      amount1 = 1285;
      await lpToken.transfer(user1.address, toWei(amount1));
      user1Balance = await lpToken.balanceOf(user1.address);
      expect(user1Balance).to.equal(toWei(amount1));
      log1("user1Balance:", fromWei(user1Balance));
      //10000000000000000000
      ownerBalance = await lpToken.balanceOf(owner.address);
      log1("ownerBalance:", fromWei(ownerBalance));
      //expect(ownerBalance).to.equal(amount1);

      // Transfer tokens from owner to user2
      amount2 = 5000;
      await lpToken.transfer(user2.address, toWei(amount2));
      user2Balance = await lpToken.balanceOf(user2.address);
      expect(user2Balance).to.equal(toWei(amount2));
      log1("user2Balance:", fromWei(user2Balance));
      ownerBalance = await lpToken.balanceOf(owner.address);
      log1("ownerBalance:", fromWei(ownerBalance));

      log1("\n----------------== admin sets rewardRate via notifyRewardAmount");
      rewardRate = await instRewardsCtrt.rewardRate();
      log1("rewardRate1:", rewardRate);
      expect(rewardRate).to.equal(0);

      log1("\n------------== isOnlyRewardDistribution");
      isOwner = await instRewardsCtrt.isOwner();
      log1("isOwner:", isOwner);
      bool1 = await instRewardsCtrt.isOnlyRewardDistribution();
      log1("isOnlyRewardDistribution1:", bool1);

      log1("\n------------== setOnlyRewardDistribution");
      log1("owner:", owner.address);
      await instRewardsCtrt.setRewardDistribution(owner.address);
      bool1 = await instRewardsCtrt.isOnlyRewardDistribution();
      log1("isOnlyRewardDistribution2:", bool1);
      expect(bool1).to.equal(true);

      dataRaw = await instRewardsCtrt.getData1();
      log1("blockTimestamp:", dataRaw[0].toString());
      log1("periodFinish:", dataRaw[1].toString());
      log1("rewardRate:", dataRaw[2].toString());
      blockTimestamp = dataRaw[0];
      periodFinish = dataRaw[1];
      rewardRate = dataRaw[2];

      log1("\n--------------------== calculateReward");
      //const exprewardToNotify = 9000
      // const rewardToNotify = 9000;
      // const stakedAmount1 = 1258;
      // const stakedAmount2 = 2000;
      expectedAPY = 372;
      expRwTotalSupply = 1258;
      expRewardToNotify = await calculateReward(
        expectedAPY,
        lpTokenPrice,
        rwTokenPrice,
        instRewardsCtrt,
        expRwTotalSupply
      );
      log1(
        "for given targets: APY =",
        expectedAPY,
        ", and expRwTotalSupply =",
        expRwTotalSupply
      );
      log1("expRewardToNotify:", fromWei(expRewardToNotify.toString())); //8999

      log1("\n--------------------== notifyRewardAmount");
      await instRewardsCtrt.notifyRewardAmount(toWei(rewardToNotify));

      dataRaw = await instRewardsCtrt.getData1();
      log1("blockTimestamp:", dataRaw[0].toString());
      log1("periodFinish:", dataRaw[1].toString());
      log1("rewardRate:", dataRaw[2].toString());
      blockTimestamp = dataRaw[0];
      periodFinish = dataRaw[1];
      rewardRate = dataRaw[2];

      //expect(rewardRate).to.equal(0);
      rewardsTotalSupply = await instRewardsCtrt.totalSupply();
      log1("rewardsTotalSupply:", fromWei(rewardsTotalSupply));
      //exit(0);

      log1("\n--------------------== user stakes tokens");
      log1("user1:", user1.address);
      rewardsTotalSupply = await instRewardsCtrt.totalSupply();
      stakedLpTokenUser1 = await instRewardsCtrt.balanceOf(user1.address);
      log1(
        "rwCtrtTotalStakedLpToken:",
        fromWei(rewardsTotalSupply),
        "\nstakedLpTokenUser1:",
        fromWei(stakedLpTokenUser1)
      );

      dataRaw = await instRewardsCtrt.getData2();
      log1("lastUpdateTime:", dataRaw[0].toString());
      log1("rewardPerTokenStored:", dataRaw[1].toString());
      log1("periodFinish:", dataRaw[2].toString());
      log1("rewardRate:", dataRaw[3].toString());
      blockTimestamp = dataRaw[0];
      periodFinish = dataRaw[1];
      rewardRate = dataRaw[2];

      log1("\n------------== pre stake: set allowance");
      log1("reward contract addr:", instRewardsCtrt.address);
      allowance1 = 1000000;
      ownerBalance = await lpToken
        .connect(user1)
        .approve(instRewardsCtrt.address, toWei(allowance1));
      //expect(await lpToken.totalSupply()).to.equal(ownerBalance);

      log1("\n------------== stake by user1");
      await instRewardsCtrt.connect(user1).stake(toWei(stakedAmount1));

      blockTimestamp = await instRewardsCtrt.getBlockTimestamp();
      log1("blockTimestamp:", blockTimestamp.toString());

      stakedLpTokenUser1 = await instRewardsCtrt.balanceOf(user1.address);
      log1("\nstakedLpTokenUser1:", fromWei(stakedLpTokenUser1));
      [APY, amp] = await calculateAPY(
        lpTokenPrice,
        rwTokenPrice,
        instRewardsCtrt
      );

      log1("\n------------== time forward 1 day");
      await timeTravel(SECONDS_IN_A_DAY * 1);
      blockTimestamp = await instRewardsCtrt.getBlockTimestamp();
      log1("blockTimestamp:", blockTimestamp.toString());

      earned1 = await instRewardsCtrt.earned(user1.address);
      log1("earned1Bn:", fromWei(earned1));

      rewardPerToken = await instRewardsCtrt.rewardPerToken();
      log1("rewardPerTokenBn:", fromWei(rewardPerToken));

      lastTimeRewardApplicable = await instRewardsCtrt.lastTimeRewardApplicable();
      log1("lastTimeRewardApplicable:", lastTimeRewardApplicable.toString());

      dataRaw = await instRewardsCtrt.getData2();
      log1("lastUpdateTime:", dataRaw[0].toString());
      log1("rewardPerTokenStored:", dataRaw[1].toString());
      log1("periodFinish:", dataRaw[2].toString());
      log1("rewardRate:", dataRaw[3].toString());
      blockTimestamp = dataRaw[0];
      periodFinish = dataRaw[1];
      rewardRate = dataRaw[2];

      //------------------------==
      log1("\n------------== pre stake: set allowance");
      log1("reward contract addr:", instRewardsCtrt.address);
      allowance1 = 1000000;
      ownerBalance = await lpToken
        .connect(user2)
        .approve(instRewardsCtrt.address, toWei(allowance1));
      //expect(await lpToken.totalSupply()).to.equal(ownerBalance);

      log1("\n------------== stake by user2");
      await instRewardsCtrt.connect(user2).stake(toWei(stakedAmount2));

      blockTimestamp = await instRewardsCtrt.getBlockTimestamp();
      log1("blockTimestamp:", blockTimestamp.toString());

      stakedLpTokenUser2 = await instRewardsCtrt.balanceOf(user2.address);
      log1("\nstakedLpTokenUser2:", fromWei(stakedLpTokenUser2));

      //-------------------==
      [APY, amp] = await calculateAPY(
        lpTokenPrice,
        rwTokenPrice,
        instRewardsCtrt
      );

      log1("\n------------== time forward 1 day");
      await timeTravel(SECONDS_IN_A_DAY * 1);
      blockTimestamp = await instRewardsCtrt.getBlockTimestamp();
      log1("blockTimestamp:", blockTimestamp.toString());

      earned1 = await instRewardsCtrt.earned(user1.address);
      log1("earned1:", fromWei(earned1));

      rewardPerToken = await instRewardsCtrt.rewardPerToken();
      log1("rewardPerToken:", fromWei(rewardPerToken));

      lastTimeRewardApplicable = await instRewardsCtrt.lastTimeRewardApplicable();
      log1("lastTimeRewardApplicable:", lastTimeRewardApplicable.toString());

      dataRaw = await instRewardsCtrt.getData2();
      log1("lastUpdateTime:", dataRaw[0].toString());
      log1("rewardPerTokenStored:", dataRaw[1].toString());
      log1("periodFinish:", dataRaw[2].toString());
      log1("rewardRate:", dataRaw[3].toString());
      blockTimestamp = dataRaw[0];
      periodFinish = dataRaw[1];
      rewardRate = dataRaw[2];

      //--------------------== calculateReward
      //const exprewardToNotify = 9000
      // const rewardToNotify = 9000;
      // const stakedAmount1 = 1258;
      // const stakedAmount2 = 2000;
      expectedAPY = 372; //372004124
      expRwTotalSupply = 3258;
      expRewardToNotify = await calculateReward(
        expectedAPY,
        lpTokenPrice,
        rwTokenPrice,
        instRewardsCtrt,
        expRwTotalSupply
      );
      log1(
        "for given targets: APY =",
        expectedAPY,
        ", and expRwTotalSupply =",
        expRwTotalSupply
      );
      log1("expRewardToNotify:", fromWei(expRewardToNotify.toString())); //8999

      log1("\n------------== notifyRewardAmount");
      rewardToNotify = 16879;
      await instRewardsCtrt.notifyRewardAmount(toWei(rewardToNotify));

      dataRaw = await instRewardsCtrt.getData1();
      log1("blockTimestamp:", dataRaw[0].toString());
      log1("periodFinish:", dataRaw[1].toString());
      log1("rewardRate:", dataRaw[2].toString());

      //-------------------==
      [APY, amp] = await calculateAPY(
        lpTokenPrice,
        rwTokenPrice,
        instRewardsCtrt
      );

      log1("\n------------== send rwTokens to RewardsCtrt");
      rewardsCtrtRwTokenBalance = await rwToken.balanceOf(
        instRewardsCtrt.address
      );
      log1("rewardsCtrtRwTokenBalance:", fromWei(rewardsCtrtRwTokenBalance));
      ownerRwTokenBalance = await rwToken.balanceOf(owner.address);
      log1("ownerRwTokenBalance:", fromWei(ownerRwTokenBalance));

      weiAmount = toWei(80000000);
      await rwToken.transfer(instRewardsCtrt.address, weiAmount);

      rewardsCtrtRwTokenBalance = await rwToken.balanceOf(
        instRewardsCtrt.address
      );
      log1("rewardsCtrtRwTokenBalance:", fromWei(rewardsCtrtRwTokenBalance));

      ownerRwTokenBalance = await rwToken.balanceOf(owner.address);
      log1("ownerRwTokenBalance:", fromWei(ownerRwTokenBalance));

      log1("\n------------== user1 calls getReward");
      user1BalanceRwToken = await rwToken.balanceOf(user1.address);
      //expect(user1Balance).to.equal(amount1);
      log1(
        "user1BalanceRwToken before getReward:",
        fromWei(user1BalanceRwToken)
      );
      rewardRate = await instRewardsCtrt.rewardRate();
      log1("rewardRate:", rewardRate.toString());

      rewardsTotalSupply = await instRewardsCtrt.totalSupply();
      log1("rewardsTotalSupply:", fromWei(rewardsTotalSupply));

      // days7duration = await instRewardsCtrt.DURATION();
      // log1("days7duration:", fromWei(days7duration));

      await instRewardsCtrt.connect(user1).getReward();
      /*
Sender balance: 3285000000000000000000 tokens
About to send   1788685289374501588245
      success: false , returndata length: 100
        */
      user1BalanceRwToken = await rwToken.balanceOf(user1.address);
      //expect(user1Balance).to.equal(amount1);
      log1(
        "user1BalanceRwToken after getReward():",
        fromWei(user1BalanceRwToken)
      );

      log1(
        "\n--------------------== user1 withdraws from reward contract by user1"
      );
      log1("user1:", user1.address);
      stakedLpTokenUser1 = await instRewardsCtrt.balanceOf(user1.address);
      log1("\nstakedLpTokenUser1:", fromWei(stakedLpTokenUser1));

      await instRewardsCtrt.connect(user1).withdraw(stakedLpTokenUser1);
      user1BalanceC = await lpToken.balanceOf(user1.address);
      //expect(user1Balance).to.equal(amount1);
      log1("user1BalanceC:", fromWei(user1BalanceC));
      /*
      Sender balance: 1496314710625498411755 tokens
      About to send   1285000000000000000000 tokens to 
        */

      log1("\n--------------------== Calculating APY");
      [APY, amp] = await calculateAPY(
        lpTokenPrice,
        rwTokenPrice,
        instRewardsCtrt
      ); //605994719

      //--------------------== calculateReward
      expectedAPY = 905; //372004124
      expRwTotalSupply = 2000;
      expRewardToNotify = await calculateReward(
        expectedAPY,
        lpTokenPrice,
        rwTokenPrice,
        instRewardsCtrt,
        expRwTotalSupply
      );
      log1(
        "for given targets: APY =",
        expectedAPY,
        ", and expRwTotalSupply =",
        expRwTotalSupply
      );
      log1("expRewardToNotify:", fromWei(expRewardToNotify.toString())); //8999

      log1("\n------------== notifyRewardAmount");
      rewardToNotify = 11500;
      await instRewardsCtrt.notifyRewardAmount(toWei(rewardToNotify));

      dataRaw = await instRewardsCtrt.getData1();
      log1("blockTimestamp:", dataRaw[0].toString());
      log1("periodFinish:", dataRaw[1].toString());
      log1("rewardRate:", dataRaw[2].toString());

      //-------------------==
      [APY, amp] = await calculateAPY(
        lpTokenPrice,
        rwTokenPrice,
        instRewardsCtrt
      );

      log1("\n--------------== ");
      log1("--------------== Decrease RewardRate");
      log1("------------== notifyRewardAmount");
      log1("\n--------==                     Day 0");
      log1("blockTimestamp:", dataRaw[0].toString());
      log1("periodFinish:", dataRaw[1].toString());
      log1("rewardRate:", dataRaw[2].toString());

      await timeTravelDecRewardRate(instRewardsCtrt, "1");

      await timeTravelDecRewardRate(instRewardsCtrt, "2");

      await timeTravelDecRewardRate(instRewardsCtrt, "3");

      await timeTravelDecRewardRate(instRewardsCtrt, "4");

      await timeTravelDecRewardRate(instRewardsCtrt, "5");

      await timeTravelDecRewardRate(instRewardsCtrt, "6");

      await timeTravelDecRewardRate(instRewardsCtrt, "7");

      log1("\n--------------== ");
      log1("--------------== rewardBalance");
      rewardBal1 = await instRewardsCtrt.getRewardBalance(user1.address);
      log1("rewardBal1:", rewardBal1.toString());

      await expect(
        instRewardsCtrt.connect(user1).addRewardBalance(user1.address, 100)
      ).to.be.revertedWith("Caller is not reward distribution");

      instRewardsCtrt.connect(owner).addRewardBalance(user1.address, 100);
      rewardBal1 = await instRewardsCtrt.getRewardBalance(user1.address);
      log1("rewardBal1:", rewardBal1.toString());

      await expect(
        instRewardsCtrt.connect(user1).reduceRewardBalance(user1.address, 10)
      ).to.be.revertedWith("Caller is not reward distribution");

      instRewardsCtrt.reduceRewardBalance(user1.address, 10);
      rewardBal1 = await instRewardsCtrt.getRewardBalance(user1.address);
      log1("rewardBal1:", rewardBal1.toString());
    });
  });
  /**


      // Owner balance shouldn't have changed.
      expect(await instRewardsCtrt.balanceOf(owner.address)).to.equal(
        initialOwnerBalance
      );
   */

  describe("rewardRate", function () {
    it("see rewardRate changes", async function () {
      log1("here");
    });
  });

  describe("yyy", function () {
    it("see  changes", async function () {});
  });

  /*
rewardRate: 14880952380952380
rewardsTotalSupply: 3258000000000000000000
lpTokenPrice: 33
rwTokenPrice: 33
weeklyReward: 8999999999999999424000
TVL: 107514000000000000000000
AFIWeeklyROI: 2762430
APY: 143646408

      stakedAmount1Bn = bigNum(stakedAmount1);
      days1yr = bigNum(365);
      period = days1yr.div(2);
      yearlyIncrease = user1BalanceRwToken.mul(period);
      APYx = yearlyIncrease.div(stakedAmount1Bn).div(base);
      //log1("user1BalanceRwToken:", user1BalanceRwToken);
      log1("APYx:", APYx.toString());

  updateReward: rewardPerTokenStored, lastUpdateTime
  rewardRate: rewardPerTime, periodFinish, lastUpdateTime

  describe("Deployment", function () {
    it("Should do xyz", async function () {

    });
  });*/
});

const timeTravelDecRewardRate = async (instRewardsCtrt, dayX) => {
  log1("\n--------== time forward 1 day. Day " + dayX);
  await timeTravel(SECONDS_IN_A_DAY * 1);
  rewardToNotify = 0;
  log1("calling notifyRewardAmount() with new reward = ", rewardToNotify);
  await instRewardsCtrt.notifyRewardAmount(toWei(rewardToNotify));

  dataRaw = await instRewardsCtrt.getData1();
  log1("blockTimestamp:", dataRaw[0].toString());
  log1("periodFinish:  ", dataRaw[1].toString());
  log1("rewardRate:    ", dataRaw[2].toString(), " => ", fromWei(dataRaw[2]));
};

/**
      var val = 37.435345;
      decimals = countDecimals(val);
      log1("decimals:", decimals)
 */
const countDecimals = (value) => {
  if (Math.floor(value) !== value)
    return value.toString().split(".")[1].length || 0;
  return 0;
};

function moveDecimalToLeft(n, firstM) {
  var l = n.toString().length - firstM;
  var v = n / Math.pow(10, l);
  log1("l:", l, ", v:", v);
  return v;
}

const calculateReward = async (
  expectedAPY,
  lpTokenPrice,
  rwTokenPrice,
  instRewardsCtrt,
  rewardsTotalSupply
) => {
  log1("\n------------== Calculating reward");
  expApyBI = bigNum(expectedAPY);

  const [lpTokenPriceBI, rwTokenPriceBI] = makePricesBI(
    lpTokenPrice,
    rwTokenPrice
  );

  //TVL = totalStakedAmount * lpTokenPrice
  if (rewardsTotalSupply === 0) {
    log1("\nget rewardsTotalSupply from contract");
    rewardsTotalSupply = await instRewardsCtrt.totalSupply();
  } else {
    log1("\nget rewardsTotalSupply by the given number");
    rewardsTotalSupply = bigNum(rewardsTotalSupply).mul(base);
  }
  log1("rewardsTotalSupply:", fromWei(rewardsTotalSupply));
  const TVL = rewardsTotalSupply.mul(lpTokenPriceBI);

  dataRaw = await instRewardsCtrt.getData1();
  log1("blockTimestamp:", dataRaw[0].toString());
  log1("periodFinish  :", dataRaw[1].toString());
  log1("rewardRate:", dataRaw[2].toString());
  blockTimestamp = dataRaw[0];
  periodFinish = dataRaw[1];
  rewardRate = dataRaw[2];

  if (blockTimestamp >= periodFinish) {
    log1("\ncase1");
    log1(
      "TVL:",
      TVL.toString(),
      ", rwTokenPriceBI:",
      rwTokenPriceBI.toString()
    );
    //reward = APY * TVL / (52 * AFI reward token price);
    reward = expApyBI.mul(TVL).div(52).div(rwTokenPriceBI);
    return reward;
  }

  log1("\ncase2");
  remaining = periodFinish.sub(blockTimestamp);
  /*reward = APY * TVL / (52 * AFI reward token price) - (remaining x rewardRate1)
   */
  //reward = APY * TVL / (52 * AFI reward token price) - (remaining x rewardRate1)
  value1 = expApyBI.mul(TVL).div(52).div(rwTokenPriceBI);
  log1("value1:", value1.toString());
  value2 = remaining.mul(rewardRate);
  log1("value2:", value2.toString());
  expRewardToNotify = value1.sub(value2);
  return expRewardToNotify;
};

const calculateAPY = async (lpTokenPrice, rwTokenPrice, instRewardsCtrt) => {
  log1("\n---------== Calculating APY");
  const [lpTokenPriceBI, rwTokenPriceBI] = makePricesBI(
    lpTokenPrice,
    rwTokenPrice
  );
  log1("\nlpTokenPriceBI:", lpTokenPriceBI.toString());
  log1("rwTokenPriceBI:", rwTokenPriceBI.toString());

  rewardRate = await instRewardsCtrt.rewardRate();
  log1("rewardRate:", rewardRate.toString());
  if (rewardRate <= 0) {
    log1("rewardRate cannot be zero or negative!");
    return [-1, -1];
  }

  rewardsTotalSupply = await instRewardsCtrt.totalSupply();
  log1("rewardsTotalSupply:", fromWei(rewardsTotalSupply));
  if (rewardsTotalSupply <= 0) {
    log1("rewardsTotalSupply cannot be zero or negative!");
    return [-1, -1];
  }

  weeklyReward = rewardRate.mul(bigNum(604800)); //9e21
  log1("weeklyReward:", weeklyReward.toString());
  //days7 = 7 * 24 * 60 * 60 / 1000000 // 0.6048
  //log1("days7duration:", days7duration);

  TVL = rewardsTotalSupply.mul(lpTokenPriceBI);
  log1("TVL:", TVL.toString());
  AFIWeeklyROI = weeklyReward.mul(ampBI).mul(rwTokenPriceBI).div(TVL);
  // AFIWeeklyROI = (weekly_reward * AFI reward token price/ (TVL = TotalSupply*LP token price))
  log1("AFIWeeklyROI:", AFIWeeklyROI.toString());

  APY = weeklyReward.mul(bigNum(52)).mul(ampBI).mul(rwTokenPriceBI).div(TVL);
  log1("APY:", APY.toString(), "\namp:  ", amp);
  return [APY, amp];
};

const makePricesBI = (lpTokenPrice, rwTokenPrice) => {
  log1("lpTokenPrice:", lpTokenPrice);
  if (lpTokenPrice <= 0) {
    log1("lpTokenPrice cannot be zero or negative!");
    return [-1, -1];
  }
  log1("rwTokenPrice:", rwTokenPrice);
  if (rwTokenPrice <= 0) {
    log1("rwTokenPrice cannot be zero or negative!");
    return [-1, -1];
  }

  dplpTokenPrice = countDecimals(lpTokenPrice);
  log1("dplpTokenPrice:", dplpTokenPrice);
  dprwTokenPrice = countDecimals(rwTokenPrice);
  log1("dprwTokenPrice:", dprwTokenPrice);

  const array1 = [dplpTokenPrice, dprwTokenPrice];
  maxDp = Math.max(...array1);
  log1("maxDp:", maxDp);

  lpTokenPriceF = lpTokenPrice * Math.pow(10, maxDp);
  log1("lpTokenPriceF:", lpTokenPriceF, typeof lpTokenPriceF);
  lpTokenPriceInt = Math.trunc(lpTokenPriceF);
  log1("lpTokenPriceInt:", lpTokenPriceInt, typeof lpTokenPriceInt);

  rwTokenPriceF = rwTokenPrice * Math.pow(10, maxDp);
  log1("rwTokenPriceF:", rwTokenPriceF, typeof rwTokenPriceF);
  rwTokenPriceInt = Math.trunc(rwTokenPriceF);
  log1("rwTokenPriceInt:", rwTokenPriceInt, typeof rwTokenPriceInt);

  amp = 1000000;
  log1("amp typeof:", typeof amp);
  log1("lpTokenPrice typeof:", typeof lpTokenPrice);
  ampBI = bigNum(amp);

  lpTokenPriceBI = bigNum(lpTokenPriceInt);
  rwTokenPriceBI = bigNum(rwTokenPriceInt);
  return [lpTokenPriceBI, rwTokenPriceBI];
};

const jsonrpc = "2.0";
const id = 0; //31337
const makeRPC = async (method, params = []) =>
  await network.provider.request({ id, jsonrpc, method, params });
//web3.currentProvider.makeRPC({ id, jsonrpc, method, params })
const timeTravel = async (seconds) => {
  await makeRPC("evm_increaseTime", [seconds]);
  await makeRPC("evm_mine");
}; //module.exports = timeTravel
/**
-await network.provider.request({
  method: "evm_increaseTime",
  params: []
})
 */
