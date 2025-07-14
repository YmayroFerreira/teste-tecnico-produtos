'use client';

import { Product } from '@/lib/types';
import { useProductStore } from '@/store/useProductStore';
import { Edit2, Trash2, Package, Eye } from 'lucide-react';
import { useState } from 'react';
import { EditProductModal } from '@/components/forms/EditProductModal';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { deleteProduct } = useProductStore();
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price);
  };

  const handleDelete = async () => {
    if (window.confirm(`Tem certeza que deseja deletar "${product.nome}"?`)) {
      setIsDeleting(true);
      try {
        await deleteProduct(product.id);
      } catch (error) {
        console.error('Erro ao deletar produto:', error);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const handleViewDetails = () => {
    setShowDetails(!showDetails);
  };

  const handleEdit = () => {
    setShowEditModal(true);
  };

  return (
    <>
      <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100">
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Package className="w-6 h-6" />
              <span className="text-sm font-medium bg-white/20 px-2 py-1 rounded-full">
                {product.categoria}
              </span>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={handleEdit}
                className="p-1 hover:bg-white/20 rounded-full transition-colors"
                title="Editar produto"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="p-1 hover:bg-red-500/50 rounded-full transition-colors disabled:opacity-50"
                title="Deletar produto"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
            {product.nome}
          </h3>
          
          <p className={`text-gray-600 text-sm mb-4 ${showDetails ? '' : 'line-clamp-3'}`}>
            {product.descricao}
          </p>
          
          {showDetails && (
            <div className="bg-gray-50 rounded-lg p-4 mb-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-sm font-medium text-gray-700">ID:</span>
                <span className="text-sm text-gray-600">#{product.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium text-gray-700">Categoria:</span>
                <span className="text-sm text-gray-600">{product.categoria}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium text-gray-700">Preço:</span>
                <span className="text-sm text-gray-600">{formatPrice(product.preco)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium text-gray-700">Estoque:</span>
                <span className="text-sm text-gray-600">{product.quantidade_estoque} unidades</span>
              </div>
            </div>
          )}
          
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="text-3xl font-bold text-green-600">
                {formatPrice(product.preco)}
              </span>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500">Estoque</div>
              <div className={`text-lg font-semibold ${
                product.quantidade_estoque > 10 
                  ? 'text-green-600' 
                  : product.quantidade_estoque > 0 
                  ? 'text-yellow-600' 
                  : 'text-red-600'
              }`}>
                {product.quantidade_estoque} un.
              </div>
            </div>
          </div>

          <div className="mb-4">
            {product.quantidade_estoque > 10 && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Em estoque
              </span>
            )}
            {product.quantidade_estoque <= 10 && product.quantidade_estoque > 0 && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                Estoque baixo
              </span>
            )}
            {product.quantidade_estoque === 0 && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                Fora de estoque
              </span>
            )}
          </div>

          <div className="flex space-x-2">
            <button 
              onClick={handleViewDetails}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
            >
              <Eye className="w-4 h-4" />
              <span>{showDetails ? 'Ocultar' : 'Detalhes'}</span>
            </button>
            <button 
              onClick={handleEdit}
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
            >
              <Edit2 className="w-4 h-4" />
              <span>Editar</span>
            </button>
          </div>
        </div>
      </div>

      <EditProductModal
        product={product}
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
      />
    </>
  );
}