  /*
  // You can nest describe calls to create subsections.
  describe("Deployment", function () {
    // `it` is another Mocha function. This is the one you use to define your tests. It receives the test name, and a callback function.

    // If the callback function is async, Mocha will `await` it.
    // it("Should set the right owner", async function () {
    // Expect receives a value, and wraps it in an assertion objet. These objects have a lot of utility methods to assert values.
    //   expect(await token1.owner()).to.equal(owner.address);
    // });
    // it("Should ...", async function () {
    // });
  });


  describe("Transactions erc20", function () {
    log1('\n----------------==');
    it("Should transfer tokens between accounts", async function () {
      // Transfer 50 tokens from owner to user1
      await token1.transfer(user1.address, 50);
      const user1Balance = await token1.balanceOf(user1.address);
      expect(user1Balance).to.equal(50);

      // Transfer 50 tokens from user1 to user2
      // We use .connect(signer) to send a transaction from another account
      await token1.connect(user1).transfer(user2.address, 50);
      const user2Balance = await token1.balanceOf(user2.address);
      expect(user2Balance).to.equal(50);
    });

    it("Should fail if sender doesn’t have enough tokens", async function () {
      const initialOwnerBalance = await token1.balanceOf(owner.address);

      // Try to send 1 token from user1 (0 tokens) to owner (1000 tokens).
      // `require` will evaluate false and revert the transaction.
      await expect(
        token1.connect(user1).transfer(owner.address, 1)
      ).to.be.revertedWith("Not enough tokens");

      // Owner balance shouldn't have changed.
      expect(await token1.balanceOf(owner.address)).to.equal(
        initialOwnerBalance
      );
    });

    it("Should update balances after transfers", async function () {
      log1('\n----------------==');
      const initialOwnerBalance = await token1.balanceOf(owner.address);

      // Transfer 100 tokens from owner to user1.
      await token1.transfer(user1.address, 100);

      // Transfer another 50 tokens from owner to user2.
      await token1.transfer(user2.address, 50);

      // Check balances.
      const finalOwnerBalance = await token1.balanceOf(owner.address);

      let bn1 = bigNum(initialOwnerBalance)
      log1("finalOwnerBalance:", bn1.toString())
      
      expect(finalOwnerBalance).to.equal(bn1.sub(150));

      const user1Balance = await token1.balanceOf(user1.address);
      log1("user1Balance:", user1Balance.toString())
      expect(user1Balance).to.equal(100);

      const user2Balance = await token1.balanceOf(user2.address);
      log1("user2Balance:", user2Balance.toString())
      expect(user2Balance).to.equal(50);
    });
  });*/