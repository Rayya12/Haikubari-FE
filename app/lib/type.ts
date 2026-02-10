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

export type getByIDResponse = {
  haiku : Haiku,
  isMine : boolean,
  user : userResponse
}

export type userResponse = {
  username : String,
  email:String,
  photo_url : String | null,
  file_name : String | null,
  file_type : String | null,
  bio : String | null,
  age : number,
  address : String
}

export type ImageKitAuthResponse = {
  token: string
  expire: number // unix timestamp
  signature: string
  folder: string
}

export type ImageKitUploadSuccess = {
  fileId: string
  url: string
  name: string
  fileType?: string
}