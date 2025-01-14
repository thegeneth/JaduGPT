import { Addy } from "@/types/opensea";

export const config = {
  runtime: 'edge',
};
interface Asset {
  asset_contract: {
    address: string;
    
  };}

interface Asset2 {
  image_original_url: string;
  image_preview_url: string;
  token_id: string;
  asset_contract: {
  name: string;
  };}
  
const handler = async (req: Request): Promise<Response> => {
  try {  

    const  addy  = await req.json()

    const response = await fetch(`https://api.opensea.io/api/v1/assets?owner=${addy}&order_direction=desc&limit=200&include_orders=false`, {
      headers: {
        'Content-Type': 'application/json',
        'X-API-KEY': `${process.env.OPENSEA_API_KEY}`
      },
    });

    if (response.status === 401) {
      return new Response(response.body, {
        status: 500,
        headers: response.headers,
      });
    } else if (response.status !== 200) {
      console.error(
        `OpenAI API returned an error ${
          response.status
        }: ${await response.text()}`,
      );
      throw new Error('OpenAI API returned an error');
    }

    const json = await response.json();

    const JaduContractList = ["0xd0F0C40FCD1598721567F140eBf8aF436e7b97cF","0xeDa3b617646B5fc8C9c696e0356390128cE900F8","0x86fc6f6c6702ceF7d3BaE87eF41256715416DB71"].map((address) => address.toLowerCase());

    const jaduAssets = json.assets.filter((asset: Asset) => {
      const contract = asset.asset_contract.address.toLowerCase();
      return JaduContractList.includes(contract);
    });

    const extractedList = jaduAssets.map((obj: Asset2) => ({
      image_original_url: obj.image_original_url,
      image_preview_url: obj.image_preview_url,
      token_id: obj.token_id,
      collection_name: obj.asset_contract.name,
    }));
       

    return new Response(JSON.stringify(extractedList), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response('Error', { status: 500 });
  }
};

export default handler;
