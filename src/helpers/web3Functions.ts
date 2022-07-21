import * as rainSDK from "rain-sdk";
import {opcodeData} from "../opcodeData";
import {ethers} from "ethers";

const WARNING_MESSAGE="Are you connected with your Web3 Wallet? (Click the button at the top right)!";

/**
 * Get Sale Data from blockchain instead of .env
 * THIS WILL ALL BE AS IF THERE IS NO .ENV ON SALE LOAD
 * todo might want to abstract this function and the whole Sale into a different component
 * todo can this use subgraph instead?
 */
export async function getSaleData(
  signer: any, setReserveTokenAddress: any, setReserveSymbol: any, setRedeemableTokenAddress: any,
  setRedeemableName: any, setRedeemableSymbol: any, setRedeemableDecimals: any, setRedeemableInitialSupply: any,
  DESIRED_UNITS_OF_REDEEMABLE: number, redeemableDecimals: string, setStaticReservePriceOfRedeemable: any,
  setSaleView: any
) {
  try {
    // if (account === "" || typeof account === 'undefined') {
    //   alert(WARNING_MESSAGE);
    //   return;
    // }

    // @ts-ignore
    const saleContract = new rainSDK.Sale(saleAddress, signer);
    console.log(saleContract);
    const redeemable = await saleContract.getRedeemable(signer);
    console.log(redeemable);
    const reserve = await saleContract.getReserve(signer);
    console.log(reserve);

    setReserveTokenAddress(reserve.address);
    setReserveSymbol(await reserve.symbol());
    setRedeemableTokenAddress(redeemable.address);
    setRedeemableName(await redeemable.name());
    setRedeemableSymbol(await redeemable.symbol())
    setRedeemableDecimals((await redeemable.decimals()).toString());

    // todo does it need tier gating info too?

    // todo this might need to be removed becasue getting now from subgraph..
    const amountOfVouchersBN = await redeemable.totalSupply(); // todo change to get remaining amount from subgraph
    const amountOfVouchersDecimals = await redeemable.decimals();
    const amountOfVouchers = parseInt(amountOfVouchersBN.toString()) / 10 ** amountOfVouchersDecimals;
    console.log(`Vouchers in Sale: ${amountOfVouchers}`); // todo check if this changes when they are bought
    setRedeemableInitialSupply(amountOfVouchers.toString()); // TODO THIS SHOULD BE REMAINING SHOES NOT TOTAL SUPPLY

    // todo this will cause a giant number if signer has more than the walletcap
    const priceOfRedeemableInUnitsOfReserve = await saleContract.calculatePrice(DESIRED_UNITS_OF_REDEEMABLE); // THIS WILL CALCULATE THE PRICE FOR **YOU** AND WILL TAKE INTO CONSIDERATION THE WALLETCAP, if the user's wallet cap is passed, the price will be so high that the user can't buy the token (you will see a really long number as the price)
    let readablePrice = (parseInt(priceOfRedeemableInUnitsOfReserve.toString())/(10**parseInt(redeemableDecimals))).toString();
    setStaticReservePriceOfRedeemable(readablePrice);
    console.log(`Price for you: ${readablePrice}`);

    // @ts-ignore
    // setShowShoes(true); // todo removed this, but test how it works with it (could use it for showing the sale view, but no shoes, or could just hide the whole sale view)_
    setSaleView(true);
  } catch(err) {
    console.log('Error getting sale data', err);
  }
}

/**
 * Deploy a Sale and Start it (2txs)
 */
export async function deploySale(
  signer: any, setButtonLock: any, setLoading: any, saleTimeout: any, staticReservePriceOfRedeemable: string,
  redeemableWalletCap: string, redeemableDecimals: string, account: string, reserveTokenAddress: string,
  DESIRED_UNITS_OF_REDEEMABLE: number, redeemableName: string, redeemableSymbol: string, redeemableInitialSupply: string,
  tierGatingAddress: string, minimumTier: string, reserveDecimals: string
) {
  try {
    if (account === "" || typeof account === 'undefined') {
      alert(WARNING_MESSAGE);
      return;
    }
    setButtonLock(true);
    setLoading(true);

    const saleConfig = {
      canStartStateConfig: opcodeData.canStartStateConfig, // config for the start of the Sale (see opcodes section below)
      // canEndStateConfig: opcodeData.canEndStateConfig, // config for the end of the Sale (see opcodes section below)
      canEndStateConfig: new rainSDK.SaleDurationInTimestamp(saleTimeout), // config for the end of the Sale (see opcodes section below)
      calculatePriceStateConfig: opcodeData.calculatePriceStateConfig(
        ethers.utils.parseUnits(staticReservePriceOfRedeemable, parseInt(reserveDecimals)),
        ethers.utils.parseUnits(redeemableWalletCap, parseInt(redeemableDecimals)),
      ), // config for the `calculatePrice` function (see opcodes section below).
      recipient: account, // who will receive the RESERVE token (e.g. USDCC) after the Sale completes
      reserve: reserveTokenAddress, // the reserve token contract address (MUMBAI MATIC in this case)
      // saleTimeout: ethers.constants.MaxUint256, // this is not the duration of the Sale, but a setting for enabling the 'killswitch' to be triggered (i.e. call timeout() thus returning funds to participants). This is a security measure to stop bad actors creating Sales which can trap user funds
      saleTimeout: 10000, // this is not the duration of the Sale, but a setting for enabling the 'killswitch' to be triggered (i.e. call timeout() thus returning funds to participants). This is a security measure to stop bad actors creating Sales which can trap user funds. This can be obtained by checking the factory through which the sale was deployed // todo check difference between timeout and MaxTimout and whether the new deployment is 4 months, and how timeout interacts with maxtimout, and how maxtimout can be set (does it need a subgraph call?)
      cooldownDuration: 100, // this will be 100 blocks (10 mins on MUMBAI) // this will stay as blocks in upcoming releases
      // USING THE REDEEMABLE_INITIAL_SUPPLY HERE BECAUSE WE HAVE CONFIGURED 1 REDEEMABLE TO COST 1 RESERVE
      minimumRaise: ethers.utils.parseUnits(DESIRED_UNITS_OF_REDEEMABLE.toString(), reserveDecimals), // minimum to complete a Raise, setting to "1" here for example purposes
      dustSize: ethers.utils.parseUnits("0", reserveDecimals), // todo check this: for bonding curve price curves (that generate a few left in the contract at the end)
    };
    const redeemableConfig = {
      // todo can erc721 be used instead?
      erc20Config: { // config for the redeemable token (rTKN) which participants will get in exchange for reserve tokens
        name: redeemableName, // the name of the rTKN
        symbol: redeemableSymbol, // the symbol for your rTKN
        distributor: "0x0000000000000000000000000000000000000000", // distributor address
        initialSupply: ethers.utils.parseUnits(redeemableInitialSupply, redeemableDecimals), // initial rTKN supply
      },
      // todo why can't I decompile? https://mumbai.polygonscan.com/address/0xC064055DFf6De32f44bB7cCB0ca59Cbd8434B2de#code
      tier: tierGatingAddress, // tier contract address (used for gating)
      minimumTier: minimumTier, // minimum tier a user needs to take part
      distributionEndForwardingAddress: "0x0000000000000000000000000000000000000000" // the rTKNs that are not sold get forwarded here (0x00.. will burn them)
    }

    console.log("Info: Creating Sale with the following parameters:", saleConfig, redeemableConfig);
    // @ts-ignore
    const saleContract = await rainSDK.Sale.deploy(signer, saleConfig, redeemableConfig);
    console.log('Result: Sale Contract:', saleContract); // the Sale contract and corresponding address
    const redeemableContract = await saleContract.getRedeemable();
    console.log('Result: Redeemable Contract:', redeemableContract); // the Sale contract and corresponding address
    console.log('------------------------------'); // separator

    // ### Interact with the newly deployed ecosystem

    console.log('Info: Starting The Sale.');
    const startStatusTransaction = await saleContract.start();
    const startStatusReceipt = await startStatusTransaction.wait();
    console.log('Info: Sale Started Receipt:', startStatusReceipt);
    console.log('------------------------------'); // separator

    console.log(`Redirecting to Sale: ${saleContract.address}`);
    window.location.replace(`${window.location.origin}/${saleContract.address}`);
  } catch (err) {
    console.log(err);
    setLoading(false);
    setButtonLock(false);
    alert('Failed Deployment, please start again or manually activate start() if the Sale deployed.'); // todo add link to settings panel here
  }
}

/**
 * end Sale
 */
export async function endSale(
  signer: any, setButtonLock: any, setLoading: any, saleAddress: string, setConsoleData: any,
  setConsoleColor: any, setSaleComplete: any, account: string
) {
  try {
    if (account === "" || typeof account === 'undefined') {
      alert(WARNING_MESSAGE);
      return;
    }

    setButtonLock(true);
    setLoading(true);

    console.log(`Sale Address: ${saleAddress}`);
    // @ts-ignore
    const saleContract = new rainSDK.Sale(saleAddress, signer);

    // approval
    console.log(`Info: Ending Sale with Address: ${saleAddress}`);

    const endSaleTransaction = await saleContract.end();
    const endStatusReceipt = await endSaleTransaction.wait();
    console.log(`Info: End Receipt:`, endStatusReceipt);
    console.log('------------------------------'); // separator

    setConsoleData(`Sale Ended Successfully!`);
    setConsoleColor(`green`); // todo add to struct
    setSaleComplete(true);
    setButtonLock(false);
    setLoading(false);
  } catch(err) {
    setLoading(false);
    setButtonLock(false);
    setConsoleData(`Ending Sale Failed (Check console for more data).`);
    setConsoleColor(`red`); // todo add to struct
    console.log(`Info: Something went wrong:`, err);
  }
}

/**
 * start Sale
 */
export async function startSale(
  signer: any, setButtonLock: any, setLoading: any, saleAddress: string, setConsoleData: any,
  setConsoleColor: any, setSaleComplete: any, account: string
) {
  try {
    if (account === "" || typeof account === 'undefined') {
      alert(WARNING_MESSAGE);
      return;
    }

    setButtonLock(true);
    setLoading(true);

    console.log(`Sale Address: ${saleAddress}`);
    // @ts-ignore
    const saleContract = new rainSDK.Sale(saleAddress, signer);

    // approval
    console.log(`Info: Starting Sale with Address: ${saleAddress}`);

    const startSaleTransaction = await saleContract.start();
    const startStatusReceipt = await startSaleTransaction.wait();
    console.log(`Info: Start Receipt:`, startStatusReceipt);
    console.log('------------------------------'); // separator

    setConsoleData(`Sale Started Successfully!`);
    setConsoleColor(`green`); // todo add to struct
    setSaleComplete(true);
    setButtonLock(false);
    setLoading(false);
  } catch(err) {
    setLoading(false);
    setButtonLock(false);
    setConsoleData(`Starting Sale Failed (is it already running?).`);
    setConsoleColor(`red`); // todo add to struct
    console.log(`Info: Something went wrong:`, err);
  }
}


/**
 * Called within the modal for making a buy
 * THIS MUST NOT BE SHOWN BEFORE getSaleData() HAS FINISHED OR THE DATA WILL BE FROM .ENV
 */
export async function initiateBuy(
  signer: any, setButtonLock: any, setLoading: any, saleAddress: string, setConsoleData: any,
  setConsoleColor: any, setSaleComplete: any, staticReservePriceOfRedeemable: string, reserveSymbol: string,
  reserveTokenAddress: string, account: string, reserveDecimals: string, DESIRED_UNITS_OF_REDEEMABLE: number,
  redeemableDecimals: string, redeemableSymbol: string
) {
  try {
    if (account === "" || typeof account === 'undefined') {
      alert(WARNING_MESSAGE);
      return;
    }

    setButtonLock(true);
    setLoading(true);

    // @ts-ignore
    const reserveContract = new rainSDK.EmissionsERC20(reserveTokenAddress, signer);
    // const reserveContract = new rainSDK.ERC20(reserveTokenAddress, signer);
    // @ts-ignore
    const saleContract = new rainSDK.Sale(saleAddress, signer);

    // approval
    console.log(`Info: Connecting to Reserve token for approval of spend of ${staticReservePriceOfRedeemable}${reserveSymbol}:`, reserveTokenAddress); // this will have been gotten dynamically in getSaleData()

    // todo maybe create a toBigNumber() function instead of putting ethers everywhere
    const approveTransaction = await reserveContract.approve(saleContract.address, ethers.utils.parseUnits(staticReservePriceOfRedeemable.toString(), parseInt(reserveDecimals)));
    const approveReceipt = await approveTransaction.wait();
    console.log(`Info: Approve Receipt:`, approveReceipt);
    console.log('------------------------------'); // separator

    console.log(`Info: Price of tokens in the Sale: ${staticReservePriceOfRedeemable}${await reserveContract.symbol()} (${reserveContract.address})`);

    const buyConfig = {
      feeRecipient: account,
      fee: ethers.utils.parseUnits("0", parseInt(reserveDecimals)), // TODO DOES DECIMALS NEED CONVERTING TO INT? // fee to be taken by the frontend
      minimumUnits: ethers.utils.parseUnits(DESIRED_UNITS_OF_REDEEMABLE.toString(), parseInt(redeemableDecimals)), // this will cause the sale to fail if there are (DESIRED_UNITS - remainingUnits) left in the sale
      desiredUnits: ethers.utils.parseUnits(DESIRED_UNITS_OF_REDEEMABLE.toString(), parseInt(redeemableDecimals)),
      maximumPrice: ethers.constants.MaxUint256, // this is for preventing slippage (for static price curves, this isn't really needed and can be set to the same as staticPrice) // todo is this better as STATIC_RESERVE_PRICE_OF_REDEEMABLE?
    }

    console.log(`Info: Buying ${DESIRED_UNITS_OF_REDEEMABLE}${redeemableSymbol} from Sale with parameters:`, buyConfig);
    const buyStatusTransaction = await saleContract.buy(buyConfig);
    const buyStatusReceipt = await buyStatusTransaction.wait();
    console.log(`Info: Buy Receipt:`, buyStatusReceipt);
    console.log('------------------------------'); // separator

    setConsoleData(`Complete!`);
    setConsoleColor(`green`); // todo add to struct
    // getSubgraphSaleData(); // no point in doin this because it takes the subgraph a while to index the data
    setSaleComplete(true);
    setButtonLock(false);
    setLoading(false);
  } catch(err) {
    setLoading(false);
    setButtonLock(false);
    setConsoleData(`Buy Failed (Check console for more data).`);
    setConsoleColor(`red`); // todo add to struct
    console.log(`Info: Something went wrong:`, err);
  }
}
