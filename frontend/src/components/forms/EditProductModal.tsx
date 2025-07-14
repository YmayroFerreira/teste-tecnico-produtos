'use client';

import { useState, useEffect } from 'react';
import { useProductStore } from '@/store/useProductStore';
import { Product, CreateProductDto } from '@/lib/types';
import { X, Save } from 'lucide-react';

interface EditProductModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
}

interface FormErrors {
  nome?: string;
  categoria?: string;
  descricao?: string;
  preco?: string;
  quantidade_estoque?: string;
}

export function EditProductModal({ product, isOpen, onClose }: EditProductModalProps) {
  const { updateProduct, isLoading } = useProductStore();
  
  const [formData, setFormData] = useState<CreateProductDto>({
    nome: '',
    categoria: '',
    descricao: '',
    preco: 0,
    quantidade_estoque: 0,
  });

  const [errors, setErrors] = useState<FormErrors>({});

  const categorias = [
    'Eletrônicos',
    'Informática', 
    'Áudio',
    'Casa e Jardim',
    'Esportes',
    'Livros',
    'Roupas',
    'Beleza',
    'Automotivo',
    'Outros'
  ];

  useEffect(() => {
    if (isOpen && product) {
      setFormData({
        nome: product.nome,
        categoria: product.categoria,
        descricao: product.descricao,
        preco: product.preco,
        quantidade_estoque: product.quantidade_estoque,
      });
      setErrors({});
    }
  }, [isOpen, product]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: name === 'preco' || name === 'quantidade_estoque' 
        ? Number(value) 
        : value
    }));

    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.nome.trim()) {
      newErrors.nome = 'Nome é obrigatório';
    } else if (formData.nome.length < 2) {
      newErrors.nome = 'Nome deve ter pelo menos 2 caracteres';
    }

    if (!formData.categoria) {
      newErrors.categoria = 'Categoria é obrigatória';
    }

    if (!formData.descricao.trim()) {
      newErrors.descricao = 'Descrição é obrigatória';
    } else if (formData.descricao.length < 10) {
      newErrors.descricao = 'Descrição deve ter pelo menos 10 caracteres';
    }

    if (formData.preco <= 0) {
      newErrors.preco = 'Preço deve ser maior que zero';
    }

    if (formData.quantidade_estoque < 0) {
      newErrors.quantidade_estoque = 'Quantidade não pode ser negativa';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      await updateProduct(product.id, formData);
      onClose();
      alert('Produto atualizado com sucesso!');
    } catch (error) {
      console.error('Erro ao atualizar produto:', error);
      alert('Erro ao atualizar produto. Tente novamente.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="bg-gradient-to-r from-green-600 to-blue-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Editar Produto</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-full transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          <p className="text-white/80 mt-1">Editando: {product.nome}</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label htmlFor="nome" className="block text-sm font-medium text-gray-700 mb-2">
              Nome do Produto *
            </label>
            <input
              type="text"
              id="nome"
              name="nome"
              value={formData.nome}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors ${
                errors.nome ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Ex: iPhone 15 Pro"
            />
            {errors.nome && (
              <p className="mt-1 text-sm text-red-600">{errors.nome}</p>
            )}
          </div>

          <div>
            <label htmlFor="categoria" className="block text-sm font-medium text-gray-700 mb-2">
              Categoria *
            </label>
            <select
              id="categoria"
              name="categoria"
              value={formData.categoria}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors ${
                errors.categoria ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Selecione uma categoria</option>
              {categorias.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            {errors.categoria && (
              <p className="mt-1 text-sm text-red-600">{errors.categoria}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="preco" className="block text-sm font-medium text-gray-700 mb-2">
                Preço (R$) *
              </label>
              <input
                type="number"
                id="preco"
                name="preco"
                value={formData.preco}
                onChange={handleInputChange}
                min="0"
                step="0.01"
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors ${
                  errors.preco ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="0,00"
              />
              {errors.preco && (
                <p className="mt-1 text-sm text-red-600">{errors.preco}</p>
              )}
            </div>

            <div>
              <label htmlFor="quantidade_estoque" className="block text-sm font-medium text-gray-700 mb-2">
                Quantidade em Estoque *
              </label>
              <input
                type="number"
                id="quantidade_estoque"
                name="quantidade_estoque"
                value={formData.quantidade_estoque}
                onChange={handleInputChange}
                min="0"
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors ${
                  errors.quantidade_estoque ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="0"
              />
              {errors.quantidade_estoque && (
                <p className="mt-1 text-sm text-red-600">{errors.quantidade_estoque}</p>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="descricao" className="block text-sm font-medium text-gray-700 mb-2">
              Descrição *
            </label>
            <textarea
              id="descricao"
              name="descricao"
              value={formData.descricao}
              onChange={handleInputChange}
              rows={4}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors resize-none ${
                errors.descricao ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Descreva o produto detalhadamente..."
            />
            {errors.descricao && (
              <p className="mt-1 text-sm text-red-600">{errors.descricao}</p>
            )}
          </div>

          <div className="flex flex-col-reverse md:flex-row gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
              disabled={isLoading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              <Save className="w-5 h-5" />
              <span>{isLoading ? 'Salvando...' : 'Salvar Alterações'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}