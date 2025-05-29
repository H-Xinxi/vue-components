import { type AppType } from '../server'
import { hc } from 'hono/client'

export const apiClient = hc<AppType>('/api')
