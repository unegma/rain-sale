import * as rainSDK from "rain-sdk";

// todo having issues exporting this from a separate file
declare var process : {
  env: {
    REACT_APP_RESERVE_TOKEN_ADDRESS: string
    REACT_APP_RESERVE_ERC20_DECIMALS: string
    REACT_APP_REDEEMABLE_ERC20_DECIMALS: string
    REACT_APP_REDEEMABLE_WALLET_CAP: string
    REACT_APP_STATIC_RESERVE_PRICE_OF_REDEEMABLE: string
    REACT_APP_REDEEMABLE_INITIAL_SUPPLY: string
    REACT_APP_REDEEMABLE_NAME: string
    REACT_APP_REDEEMABLE_SYMBOL: string
    REACT_APP_CHAIN_ID: string
    REACT_APP_BASE_URL: string
    REACT_APP_TIER_GATING_ADDRESS: string
    REACT_APP_MINIMUM_TIER: string
  }
}

const SUBGRAPH_ENDPOINT = rainSDK.AddressBook.getSubgraphEndpoint(parseInt(process.env.REACT_APP_CHAIN_ID));

/**
 * Get the name of the reserve token to be used in the gui
 * @param reserveTokenAddress
 * @param setReserveSymbol
 */
export async function getReserveName(reserveTokenAddress: string, setReserveSymbol: any) {
  try {
    console.log(`calling with reserveTokenAddress: ${reserveTokenAddress}`)
    let subgraphData = await fetch(SUBGRAPH_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      // todo
      body: JSON.stringify({
        query: `
            query {
              emissionsERC20 (id: "${reserveTokenAddress.toLowerCase()}") {
                id
                name
                symbol
              }
            }
          `
      })
    });

    // the response will then come back as promise, the data of which will need to be accessed as such:
    subgraphData = await subgraphData.json();
    console.log(subgraphData);

    // @ts-ignore
    subgraphData = subgraphData.data.emissionsERC20; // should only be one here anyway. // todo--question is there potential for 'too quick' to cause it not to exist yet in the subgraph?
    if (subgraphData === undefined) throw new Error('NO_SUBGRAPH_DATA');

    console.log(`Result: data from subgraph with endpoint ${SUBGRAPH_ENDPOINT}:`);
    // @ts-ignore
    setReserveSymbol(subgraphData.symbol);

  } catch(err) {
    console.log(err);
    setReserveSymbol("");
  }
}

/**
 * Get SubgraphSaleData
 * @param saleAddress
 * @param setRTKNAvailable
 */
export async function getSubgraphSaleData(saleAddress: string, setRTKNAvailable: any) {
  try {
    let subgraphData = await fetch(SUBGRAPH_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: `
            query {
              sales (where: {id: "${saleAddress.toLowerCase()}"}) {
                id
                deployer
                startEvent {
                    timestamp
                }
                endEvent {
                  timestamp
                }
                token {
                  symbol
                  name
                  decimals
                }
                reserve {
                  symbol
                  name
                  decimals
                }
                minimumRaise
                unitsAvailable
                totalRaised
                percentRaised
                saleStatus
              }
            }
          `
      })
    });

    // the response will then come back as promise, the data of which will need to be accessed as such:
    subgraphData = await subgraphData.json();
    console.log(subgraphData);

    // @ts-ignore
    subgraphData = subgraphData.data.sales[0]; // should only be one here anyway. // todo--question is there potential for 'too quick' to cause it not to exist yet in the subgraph?
    if (subgraphData === undefined) throw new Error('NO_SUBGRAPH_DATA');

    console.log(`Result: data from subgraph with endpoint ${SUBGRAPH_ENDPOINT}:`);
    // @ts-ignore
    setRTKNAvailable(subgraphData.unitsAvailable/10**18); // todo add

  } catch(err) {
    console.log(err);
  }
}
