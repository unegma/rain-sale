import * as rainSDK from "rain-sdk";

const SUBGRAPH_ENDPOINT = rainSDK.AddressBook.getSubgraphEndpoint(parseInt(process.env.REACT_APP_CHAIN_ID as string));

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
 * getSubgraphSaleData
 */
export async function getSubgraphSaleData(
  setReserveTokenAddress: any,setReserveSymbol: any,setRedeemableTokenAddress: any,
  setRedeemableName: any,setRedeemableSymbol: any, setRedeemableDecimals: any,setRedeemableInitialSupply: any,redeemableDecimals: string,
  setStaticReservePriceOfRedeemable: any, setSaleView: any,saleAddress: string, setRTKNAvailable: any, setSaleStatus: any, setEndTimestamp:any
) {
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
                  id
                  symbol
                  name
                  decimals
                  totalSupply
                }
                reserve {
                  id
                  symbol
                  name
                  decimals
                }
                minimumRaise
                unitsAvailable
                totalRaised
                percentRaised
                saleStatus
                canEndStateConfig {
                  constants
                }
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
    setReserveTokenAddress(subgraphData.reserve.id);
    // @ts-ignore
    setReserveSymbol(subgraphData.reserve.symbol);
    // @ts-ignore
    setRedeemableTokenAddress(subgraphData.token.id);
    // @ts-ignore
    setRedeemableName(subgraphData.token.name);
    // @ts-ignore
    setRedeemableSymbol(subgraphData.token.symbol)
    // @ts-ignore
    setRedeemableDecimals((subgraphData.token.decimals).toString());
    // @ts-ignore
    setRTKNAvailable(subgraphData.unitsAvailable/10**18); // todo add
    // @ts-ignore
    setSaleStatus(subgraphData.saleStatus);
    // @ts-ignore
    setEndTimestamp(parseInt(subgraphData.canEndStateConfig.constants));
    setSaleView(true); // todo might want to move this somewhere else so loads the frontend quicker
  } catch(err) {
    console.log(err);
  }
}
