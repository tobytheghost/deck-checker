export type DeckTypes = {
  commander_id: string;
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
  quantity: number;
  board: string;
  type: string;
  image: string;
  mana_cost: string;
};
