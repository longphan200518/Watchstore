import apiClient from './apiClient'

export const getInventory = async (params = {}) => {
  const res = await apiClient.get('/admin/inventory', { params })
  return res.data
}

export const getInventoryTransactions = async (params = {}) => {
  const res = await apiClient.get('/admin/inventory/transactions', { params })
  return res.data
}

export const adjustStock = async (dto) => {
  const res = await apiClient.post('/admin/inventory/adjust', dto)
  return res.data
}
