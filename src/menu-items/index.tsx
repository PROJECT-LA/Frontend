import { dashboard, configuration } from "./dashboard";
import pages from "./authentication";
import { Item } from "@/types";

const menuItems: { items: Array<Item> } = {
  items: [dashboard, configuration, pages],
};

export default menuItems;
