import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Search } from 'lucide-react'
import AdminSidebar from '../components/admin/AdminSidebar'
import { fetchAdminProducts } from '../store/slices/adminSlice'
import Loader from '../components/common/Loader'

export default function AdminProductsPage() {
  const dispatch = useDispatch()
  const { products, loading } = useSelector((state) => state.admin)
  const [query, setQuery] = useState('')

  useEffect(() => {
    dispatch(fetchAdminProducts())
  }, [dispatch])

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(query.toLowerCase()) ||
    product.sku.toLowerCase().includes(query.toLowerCase())
  )

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <main className="flex-1 bg-gray-100 p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">Products</h1>
        </div>

        <div className="bg-white rounded-lg shadow-md">
          <div className="p-4 border-b">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search products..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
            </div>
          </div>

          {loading ? <Loader className="h-64" /> : (
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stock</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredProducts.map((product) => (
                  <tr key={product.id}>
                    <td className="px-6 py-4 flex items-center">
                      <img src={product.primary_image?.image || '/placeholder.jpg'} alt="" className="w-10 h-10 rounded object-cover mr-3" />
                      <span className="font-medium">{product.name}</span>
                    </td>
                    <td className="px-6 py-4">${product.price}</td>
                    <td className="px-6 py-4">{product.stock_quantity}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${product.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                        {product.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  )
}
