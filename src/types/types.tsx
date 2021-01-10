export type DeckTypes = {
  commander_image: string;
  commander_name: string;
  deck_name: string;
  list: [];
  user_id: string;
  tag: string;
  timestamp: any;
};

export type CardItemTypes = {
  name: string;
  cmc: number;
  quantity: number;
  board: string;
  type: string;
  layout: string;
  mana_cost: string;
  image: string;
};
