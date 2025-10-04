import { AppError } from "@/lib/models/app-error"
import React, { PropsWithChildren } from "react"
import { TMDB } from "tmdb-ts"

const tmdb = new TMDB(import.meta.env.VITE_TMDB_API_KEY)

const TMDBContext = React.createContext<typeof tmdb>(tmdb)

export const useTMDB = () => {
  const tmdb = React.useContext(TMDBContext)
  if (!tmdb) {
    throw new AppError("useTMDB must be used within a TMDBProvider")
  }
  return tmdb
}

export const TMDBProvider: React.FC<PropsWithChildren> = ({ children }) => {
  return <TMDBContext.Provider value={tmdb}>{children}</TMDBContext.Provider>
}
