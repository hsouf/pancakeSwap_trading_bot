const ethers = require("ethers");
const contracts = require("./my_contracts");
const bot = async function () {
  const addresses = {
    token_in: "0xe9e7cea3dedca5984780bafc599bd69add087d56", //BUSD address
    token_out: "", //address of the token you want to buy
    factory: "0xcA143Ce32Fe78f1f7019d7d551a6402fC5350c73",
    router: "0x10ED43C718714eb63d5aA57B78B54704E256024E",
    recipient: "", // your public key to be added here
  };
  const mnemonic = ""; // your mnemonic/private key goes here respect the spacing !

  const wallet = ethers.Wallet.fromMnemonic(mnemonic);

  let provider = new ethers.providers.JsonRpcProvider(
    "https://bsc-dataseed.binance.org/" 
  );
  const account = wallet.connect(provider);

  await provider.getBalance(addresses.recipient).then((data) => {
    console.log(
      ethers.utils.formatEther(data.toString(), { pad: true }) + " BNB"
    );
  });

  const router = new ethers.Contract(
    addresses.router,
    contracts.routerAdd,
    account
  );
  const BUSD = new ethers.Contract(
    addresses.token_in,
    contracts.token_in_ABI,
    account
  );

  const howMuchTokentoApprove = ethers.utils.parseUnits("1", "ether");

  console.log("Waiting for Approval receipt...");
  const txh = await BUSD.approve(addresses.router, howMuchTokentoApprove); 
  const receipt1 = await txh.wait();
  console.log("Transaction receipt"); //uncomment it to approve the router to withdraw busd

  //console.log(receipt1);

  const amountIn = ethers.utils.parseUnits("1", "ether"); //add the wanted amont of token in to purchase with

  const amounts = await router.getAmountsOut(
    amountIn,
    [addresses.token_in, addresses.token_out],
    {
      gasLimit: 80000,

      gasPrice: ethers.utils.parseUnits("2.0", "gwei"),
    }
  );

  const amountOutMin = amounts[1] - amounts[1] * 0.1; // setting up the slippage here 10% by default

  const tx = await router.swapExactTokensForTokens(
    amountIn,
    amountOutMin, //min amount
    [
      addresses.token_in, //address of the token in
      addresses.token_out, //address of the token out
    ],
    addresses.recipient,
    Date.now() + 1000 * 60 * 10,
    {
      gasLimit: 80000,

      gasPrice: ethers.utils.parseUnits("5.0", "gwei"),
    }
  );
  const receipt = await tx.wait();
  console.log(receipt);
};
bot();
