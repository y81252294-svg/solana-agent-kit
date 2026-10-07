// NOTE: see https://docs.helius.dev/compression-and-das-api/digital-asset-standard-das-api/get-assets-by-owner

export interface SortOptions {
  sortBy?: "created" | "recent_action" | "updated" | "none";
  sortDirection?: "asc" | "desc";
}

export interface DisplayOptions {
  showUnverifiedCollections?: boolean;
  showCollectionMetadata?: boolean;
  showGrandTotal?: boolean;
  showFungible?: boolean;
  showNativeBalance?: boolean;
  showInscription?: boolean;
  showZeroBalance?: boolean;
}
