import { abi } from "../../abis/token.json";
import axios from "axios";
import { TokenId } from "./objects";
import { useContract } from "../hooks";
import { decodeKeyValue } from "@erc725/erc725.js/build/main/src/lib/utils";

const IPFS_GATEWAY = "https://2eff.lukso.dev/ipfs/";

export const fetchMetadata = async (url: string) => {
  let response = await axios.get(url);
  return response.data;
};

export const fetchTokenDetails = async (
  _collection: string,
  _tokenId: string
) => {
  const tokenId = TokenId.parseTokenId(_tokenId);
  const metadataKey = `0x1339e76a390b7b9ec9010000${tokenId.collectionId.slice(
    2
  )}0000${tokenId.variantId.slice(2)}`;
  const collection = useContract(_collection, abi);
  const dataValue = await collection.getData(metadataKey);
  const { url } = decodeKeyValue("JSONURL", "bytes", dataValue, "metadata");
  const data = await axios
    .get(url.replace("ipfs://", IPFS_GATEWAY))
    .then((res) => res.data);
  //   const data;
  return {
    ...data.LSP4Metadata,
    image: data.LSP4Metadata.images[0][0].url.replace("ipfs://", IPFS_GATEWAY),
  };
};
