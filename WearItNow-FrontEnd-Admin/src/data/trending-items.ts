// import homeDecorRange from 'assets/images/trending-now/home-decor-range.jpg';
// import disneyPrincessDress from 'assets/images/trending-now/disney-princess-dresses.jpg';
// import bathroomEssentials from 'assets/images/trending-now/bathroom-essentials.jpg';
// import appleSmartwatch from 'assets/images/trending-now/apple-smartwatch.jpg';

export interface TrendingItem {
  id?: number;
  name: string;
  imgsrc: string;
  popularity: number;
  users: string[];
}

export const trendingItems: TrendingItem[] = [
  
];
