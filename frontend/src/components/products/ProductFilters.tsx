'use client';

import { useProductStore } from '@/store/useProductStore';
import { Search, Filter, SortAsc, SortDesc, X } from 'lucide-react';
import { useState } from 'react';

export function ProductFilters() {
  const { filters, setFilters } = useProductStore();
  const [showAdvanced, setShowAdvanced] = useState(false);

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

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({ searchTerm: e.target.value });
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters({ categoria: e.target.value });
  };

  const handlePriceChange = (field: 'precoMin' | 'precoMax', value: string) => {
    const numValue = value === '' ? (field === 'precoMin' ? 0 : 999999) : Number(value);
    setFilters({ [field]: numValue });
  };

  const handleSortChange = (sortBy: 'nome' | 'preco' | 'categoria') => {
    if (filters.sortBy === sortBy) {
      setFilters({ sortOrder: filters.sortOrder === 'asc' ? 'desc' : 'asc' });
    } else {
      setFilters({ sortBy, sortOrder: 'asc' });
    }
  };

  const clearFilters = () => {
    setFilters({
      searchTerm: '',
      categoria: '',
      precoMin: 0,
      precoMax: 999999,
      sortBy: 'nome',
      sortOrder: 'asc',
    });
  };

  const hasActiveFilters = filters.searchTerm || filters.categoria || 
    filters.precoMin > 0 || filters.precoMax < 999999;

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Buscar produtos por nome..."
            value={filters.searchTerm}
            onChange={handleSearchChange}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          />
        </div>

        <div className="md:w-48">
          <select
            value={filters.categoria}
            onChange={handleCategoryChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          >
            <option value="">Todas as categorias</option>
            {categorias.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className={`px-4 py-3 border rounded-lg font-medium transition-colors flex items-center space-x-2 ${
            showAdvanced 
              ? 'bg-blue-600 text-white border-blue-600' 
              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
          }`}
        >
          <Filter className="w-5 h-5" />
          <span>Filtros</span>
        </button>
      </div>

      {showAdvanced && (
        <div className="border-t pt-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Faixa de Preço (R$)
            </label>
            <div className="flex items-center space-x-3">
              <input
                type="number"
                placeholder="Mín"
                value={filters.precoMin || ''}
                onChange={(e) => handlePriceChange('precoMin', e.target.value)}
                className="w-28 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                min="0"
                step="0.01"
              />
              <span className="text-gray-500">até</span>
              <input
                type="number"
                placeholder="Máx"
                value={filters.precoMax === 999999 ? '' : filters.precoMax}
                onChange={(e) => handlePriceChange('precoMax', e.target.value)}
                className="w-28 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                min="0"
                step="0.01"
              />
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-4 mt-4 pt-4 border-t">
        <div className="flex flex-wrap gap-2">
          <span className="text-sm text-gray-600 flex items-center mr-2">
            Ordenar por:
          </span>
          
          {(['nome', 'preco', 'categoria'] as const).map((field) => (
            <button
              key={field}
              onClick={() => handleSortChange(field)}
              className={`px-3 py-1.5 text-sm rounded-lg font-medium transition-colors flex items-center space-x-1 ${
                filters.sortBy === field
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <span>
                {field === 'nome' ? 'Nome' : field === 'preco' ? 'Preço' : 'Categoria'}
              </span>
              {filters.sortBy === field && (
                filters.sortOrder === 'asc' ? (
                  <SortAsc className="w-4 h-4" />
                ) : (
                  <SortDesc className="w-4 h-4" />
                )
              )}
            </button>
          ))}
        </div>

        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="px-4 py-2 text-sm text-red-600 hover:text-red-700 font-medium transition-colors flex items-center space-x-1"
          >
            <X className="w-4 h-4" />
            <span>Limpar filtros</span>
          </button>
        )}
      </div>

      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t">
          {filters.searchTerm && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              Busca: &quot;{filters.searchTerm}&quot;
            </span>
          )}
          {filters.categoria && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
              Categoria: {filters.categoria}
            </span>
          )}
          {filters.precoMin > 0 && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
              Min: R$ {filters.precoMin.toFixed(2)}
            </span>
          )}
          {filters.precoMax < 999999 && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
              Máx: R$ {filters.precoMax.toFixed(2)}
            </span>
          )}
        </div>
      )}
    </div>
  );
}