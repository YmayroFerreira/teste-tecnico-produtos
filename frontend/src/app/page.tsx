'use client';

import { useEffect } from 'react';
import { useProductStore } from '@/store/useProductStore';
import { ProductCard } from '@/components/products/ProductCard';
import { ProductFilters } from '@/components/products/ProductFilters';
import { ProductForm } from '@/components/forms/ProductForm';
import { Package, AlertCircle, Loader2 } from 'lucide-react';

export default function Home() {
  const { 
    products, 
    isLoading, 
    error, 
    fetchProducts, 
    filteredProducts,
    clearError 
  } = useProductStore();

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const filtered = filteredProducts();

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">Erro ao carregar</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <div className="space-x-3">
            <button
              onClick={fetchProducts}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Tentar novamente
            </button>
            <button
              onClick={clearError}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Limpar erro
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Package className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Gerenciador de Produtos
                </h1>
                <p className="text-gray-600">
                  {products.length} produtos cadastrados
                </p>
              </div>
            </div>
            
            <div className="hidden md:flex items-center space-x-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{products.length}</div>
                <div className="text-sm text-gray-500">Total</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {products.filter(p => p.quantidade_estoque > 0).length}
                </div>
                <div className="text-sm text-gray-500">Em estoque</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">
                  {products.filter(p => p.quantidade_estoque === 0).length}
                </div>
                <div className="text-sm text-gray-500">Sem estoque</div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ProductFilters />

        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-4" />
              <p className="text-gray-600">Carregando produtos...</p>
            </div>
          </div>
        )}

        {!isLoading && products.length === 0 && (
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              Nenhum produto cadastrado
            </h3>
            <p className="text-gray-600 mb-6">
              Comece adicionando seu primeiro produto
            </p>
          </div>
        )}

        {!isLoading && products.length > 0 && filtered.length === 0 && (
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              Nenhum produto encontrado
            </h3>
            <p className="text-gray-600 mb-6">
              Tente ajustar os filtros de busca
            </p>
          </div>
        )}

        {!isLoading && filtered.length > 0 && (
          <>
            <div className="mb-6">
              <p className="text-sm text-gray-600">
                Mostrando {filtered.length} de {products.length} produtos
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filtered.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </>
        )}
      </main>

      <ProductForm />
    </div>
  );
}