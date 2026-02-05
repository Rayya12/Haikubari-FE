export type Haiku = {
  id: string;
  user_id: string;
  title: string;
  hashigo: string;
  nakasichi: string;
  shimogo: string;
  description: string | null;
  created_at: string; // ISO string
  likes: number;
};

export type MyHaikusResponse = {
  page: number;
  page_size: number;
  q: string | null;
  sort: "created_at" | "likes";
  order: "asc" | "desc";
  total: number;
  total_pages: number;
  items: Haiku[];
};


export type Review = {
  id: string;
  user_id : string;
  haiku_id : string;
  create_at : string;
  likes : number;
  content :string;
};

export type reviewResponse = {
  reviews : Review[]
}