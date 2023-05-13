import axios from 'axios';

interface Swap {
    id: string;
    amount0: string;
    amount1: string;
    timestamp: string;
}

interface SwapResponse {
    data: {
        swaps: Swap[];
    };
}

async function getSwapsForAccount(accountAddress: string): Promise<Swap[]> {
    // GraphQL query to retrieve swaps for an account
    const query = `
    {
        swaps(where: { origin: "${accountAddress}" }){
            origin
            amount0
            amount1
            amountUSD
            recipient
            transaction{
              id 
              blockNumber
              timestamp
              gasUsed
              gasPrice
            }
            pool{
              id 
              token0{
                symbol
              }
              token1{
                symbol
              }
              volumeToken0
              volumeToken1
          }
        }
    }
  `;

    try {
        // Send a POST request to the Uniswap subgraph endpoint
        const response = await axios.post<SwapResponse>(
            'https://api.thegraph.com/subgraphs/name/hamzabhatti125/niswapv3mumbai',
            { query }
        );

        // Extract the swaps from the response data
        const swaps = response.data.data.swaps;
        return swaps;
    } catch (error) {
        console.error('Failed to fetch swaps:', error);
        throw error;
    }
}

//Uniswap Polygon Mumbai Contract address
//0x4648a43B2C14Da09FdF82B161150d3F634f40491


// Replace with your account address
const accountAddress = '0x7c87243a79059BC592e5EcfF5B4776A179eBEc22';

// Call the function to get swaps for the account
getSwapsForAccount(accountAddress)
    .then((swaps) => {
        console.log('Swaps:', JSON.stringify(swaps, null, 2));
        // Process the swaps as needed
    })
    .catch((error) => {
        console.error('Error:', error);
    });
