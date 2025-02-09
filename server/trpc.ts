import { initTRPC } from '@trpc/server'
import { FetchCreateContextFnOptions } from '@trpc/server/adapters/fetch'

export const createContext = async (_opts: FetchCreateContextFnOptions) => {
  return {}
}

const t = initTRPC.context<typeof createContext>().create()

export const router = t.router
export const publicProcedure = t.procedure