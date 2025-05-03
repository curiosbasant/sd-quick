export type Literals = string | number | boolean
export type LiteralNullish = Literals | null | undefined

type APIResponse<Data> =
  | {
      success: true
      message?: string
      data: Data
    }
  | {
      success: false
      message?: string
      data?: null
    }

export const apiRequest = {
  get<T>(
    endpoint: string | URL,
    payload?:
      | string
      | Record<string, LiteralNullish | LiteralNullish[]>
      | [string, LiteralNullish | LiteralNullish[]][],
    headers?: Record<string, unknown>
  ) {
    const endpointURL = typeof endpoint === 'string' ? new URL(endpoint, location.origin) : endpoint
    if (payload) {
      if (typeof payload === 'string') {
        endpointURL.searchParams.set(payload, 'true')
      } else {
        for (const [key, value] of Array.isArray(payload) ? payload : Object.entries(payload)) {
          if (value === null || typeof value == 'undefined') continue

          if (Array.isArray(value)) {
            for (const v of value) {
              if (v === null || typeof v == 'undefined') continue

              endpointURL.searchParams.append(key, v.toString())
            }
          } else {
            endpointURL.searchParams.set(key, value.toString())
          }
        }
      }
    }

    return fetch(endpointURL, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        ...(headers ?? null),
      },
    }).then<APIResponse<T>>((res) => res.json())
  },

  post<T>(endpoint: string, payload?: Record<string, unknown>, headers?: Record<string, unknown>) {
    return fetch(endpoint, {
      method: 'POST',
      body: JSON.stringify(payload ?? null),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        ...(headers ?? null),
      },
    }).then<APIResponse<T>>((res) => res.json())
  },
}
