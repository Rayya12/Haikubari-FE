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
