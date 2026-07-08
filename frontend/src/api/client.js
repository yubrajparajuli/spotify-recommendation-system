const BASE_URL =
  import.meta.env.VITE_API_URL || "http://127.0.0.1:8000"

async function request(endpoint, options = {}) {
  const token = localStorage.getItem("token")

  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  const response = await fetch(
    `${BASE_URL}${endpoint}`,
    {
      ...options,
      headers,
    }
  )

  if (!response.ok) {
    const errorBody = await response
      .json()
      .catch(() => ({}))

    throw new Error(
      errorBody.detail ||
      `Request failed with status ${response.status}`
    )
  }

  return response.json()
}

export function get(endpoint) {
  return request(endpoint, {
    method: "GET",
  })
}

export function post(endpoint, body) {
  return request(endpoint, {
    method: "POST",
    body: JSON.stringify(body),
  })
}

export function put(endpoint, body) {
  return request(endpoint, {
    method: "PUT",
    body: JSON.stringify(body),
  })
}

export function del(endpoint) {
  return request(endpoint, {
    method: "DELETE",
  })
}