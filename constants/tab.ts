type FeedType = "following" | "recommended";
type ViewType = "all" | "liked" | "bookmarked";

const VIEW_TYPE_ORDER: ViewType[] = ["all", "liked", "bookmarked"];

export { FeedType, VIEW_TYPE_ORDER, ViewType };
