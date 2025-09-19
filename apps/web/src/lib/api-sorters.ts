export type SortValue =
  | "popularity.desc"
  | "release_date.desc"
  | "revenue.desc"
  | "vote_average.desc"
  | "popularity.asc"
  | "release_date.asc"
  | "revenue.asc"
  | "vote_average.asc"

export const sortNames: Record<SortValue, string> = {
  "popularity.desc": "Popularity Descending",
  "release_date.desc": "Release Date Descending",
  "revenue.desc": "Revenue Descending",
  "vote_average.desc": "Vote Average Descending",
  "popularity.asc": "Popularity Ascending",
  "release_date.asc": "Release Date Ascending",
  "revenue.asc": "Revenue Ascending",
  "vote_average.asc": "Vote Average Ascending",
}
