const ethers = require("ethers");
let mnemonic =
  "legend damage clinic resource birth maple avoid action clown female story invest";
let mnemonicWallet = ethers.Wallet.fromMnemonic(mnemonic);
console.log(mnemonicWallet.privateKey);
