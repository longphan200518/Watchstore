import apiClient from './apiClient'

export const getCategories = async () => {
  const res = await apiClient.get('/categories')
  return res.data
}

export const getCategoryById = async (id) => {
  const res = await apiClient.get(`/categories/${id}`)
  return res.data
}

export const createCategory = async (dto) => {
  const res = await apiClient.post('/categories', dto)
  return res.data
}

export const updateCategory = async (id, dto) => {
  const res = await apiClient.put(`/categories/${id}`, dto)
  return res.data
}

export const deleteCategory = async (id) => {
  const res = await apiClient.delete(`/categories/${id}`)
  return res.data
}
