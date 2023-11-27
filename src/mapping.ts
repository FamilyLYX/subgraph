// import { BigInt } from "@graphprotocol/graph-ts";
import { store } from "@graphprotocol/graph-ts";
import {
  Dispute,
  ItemDelisted,
  ItemListed,
  Received,
  Sent,
  TradeInitiated,
} from "../generated/Marketplace/Marketplace";
import { Listing, Trade } from "../generated/schema";
// import { fetchMetadata, fetchTokenDetails } from "./utils";
// import { IPFS_GATEWAY } from "./utils/constants";

// // export function handleNewGravatar(event: NewGravatar): void {
// //   let gravatar = new Gravatar(event.params.id.toHex())
// //   gravatar.owner = event.params.owner
// //   gravatar.displayName = event.params.displayName
// //   gravatar.imageUrl = event.params.imageUrl
// //   gravatar.save()
// // }
// // ItemListed(indexed address,bytes32,indexed uint256)

export function handleItemListing(event: ItemListed): void {
  // const { tokenId, collection, price, listingURl } = event.params;
  let listing = new Listing(
    event.params.collection.toHex() + ":" + event.params.tokenId.toHex()
  );
  listing.tokenId = event.params.tokenId;
  listing.collection = event.params.collection;
  listing.price = event.params.price;
  listing.url = event.params.listingURl;
  listing.collectionType = event.params.param5 === 0 ? "digital" : "phygital";
  listing.acceptFiat = event.params.ItemListed;
  listing.save();
}

export function handleDelisting(event: ItemDelisted): void {
  let listing = Listing.load(
    event.params.collection.toHex() + ":" + event.params.tokenId.toHex()
  );
  if (listing) {
    store.remove(
      "Listing",
      event.params.collection.toHex() + ":" + event.params.tokenId.toHex()
    );
  }
}

export function handleTradeInit(event: TradeInitiated): void {
  let trade = new Trade(event.params.tradeId.toHexString());
  let listing = Listing.load(
    event.params.collection.toHex() + ":" + event.params.tokenId.toHex()
  );
  trade.collection = event.params.collection;
  trade.tokenId = event.params.tokenId;
  trade.seller = event.params.seller;
  trade.buyer = event.params.buyer;
  trade.escrow = event.params.escrow;
  trade.status = "open";
  trade.url = event.params.tradeUrl;
  if (listing) {
    trade.price = listing.price;
    trade.listingURL = listing.url;
    trade.trackingId = "";
    trade.acceptFiat = listing.acceptFiat;
    trade.collectionType = listing.collectionType;
    store.remove("Listing", listing.id);
  }
  trade.save();
}

export function handleSent(event: Sent): void {
  let trade = Trade.load(event.params.tradeId.toHexString());
  if (trade) {
    trade.trackingId = event.params.trackingId.toString();
    trade.save();
  }
}

export function handleReceived(event: Received): void {
  let trade = Trade.load(event.params.tradeId.toString());
  if (trade) {
    trade.status = "confirmed";
    trade.save();
  }
}
// // - Dispute(indexed bytes32,indexed string)
// // - Dissolved(bytes32)
// // - Resolved(bytes32)
