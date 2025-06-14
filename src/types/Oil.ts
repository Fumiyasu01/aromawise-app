export interface Oil {
  id: string;
  name: string;
  category: 'citrus' | 'floral' | 'herbal' | 'blend' | 'popular';
  benefits: string[];
  symptoms: string[];
  aroma: string;
  safetyInfo: {
    pregnancy: boolean;
    children: boolean;
    notes: string;
  };
  usage: string[];
  description: string;
}

export interface Symptom {
  id: string;
  name: string;
  category: string;
  relatedOils: string[];
}