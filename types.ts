
export interface City {
  id: string;
  name: string;
  engName: string;
  image: string;
  description: string;
  color: string;
}

export interface TravelItinerary {
  title: string;
  days: {
    day: number;
    activity: string;
    description: string;
  }[];
  tips: string[];
}
