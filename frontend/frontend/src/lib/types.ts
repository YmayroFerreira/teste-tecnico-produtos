// src/lib/types.ts

export interface Product {
  id: number;
  nome: string;
  categoria: string;
  descricao: string;
  preco: number;
  quantidade_estoque: number;
}

export interface CreateProductDto {
  nome: string;
  categoria: string;
  descricao: string;
  preco: number;
  quantidade_estoque: number;
}

export interface ProductFilters {
  searchTerm: string;
  categoria: string;
  precoMin: number;
  precoMax: number;
  sortBy: 'nome' | 'preco' | 'categoria';
  sortOrder: 'asc' | 'desc';
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface ApiError {
  message: string;
  statusCode: number;
  error?: string;
}