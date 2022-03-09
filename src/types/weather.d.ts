export interface WeatherType {
  name: string;
  weather: { icon: string; description: string }[];
  main: { temp_min: number; temp_max: number };
}
