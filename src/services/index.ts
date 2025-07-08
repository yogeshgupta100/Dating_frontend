export interface LocationResponse {
  id: number;
  name: string;
  slug: string;
  heading: string;
  sub_heading: string;
  description: string;
  content: string;
  phone_number?: string;
  created_at: string;
  updated_at: string;
  seo_title?: string;
  seo_desc?: string;
  seo_keyword?: string[];
  faq?: string;
}

export interface Model {
  id: number;
  name: string;
  slug: string;
  heading: string;
  phone_number: string;
  state_id: string;
  description: string;
  profile_img: string | File | undefined;
  banner_img: string | File | undefined;
  services: string[];
  seo_title?: string;
  seo_desc?: string;
  seo_keywords?: string[];
}

export interface Faq {
  id: number;
  name: string;
  slug: string;
}

export interface LocationFormProps {
  location?: LocationResponse;
  onSubmit: (location: LocationResponse) => void;
  onCancel: () => void;
}

export interface ModelFormProps {
  model?: Model;
  locations: LocationResponse[];
  onSubmit: (data: Omit<Model, "id">) => void;
  onCancel: () => void;
}

export interface FaqFormProps {
  faq?: Faq;
  onSubmit: (data: Faq) => void;
  onCancel: () => void;
}
