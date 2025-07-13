import { create } from 'zustand';
import { Product, CreateProductDto, ProductFilters } from '@/lib/types';
import { api } from '@/lib/api';

interface ProductStore {
  products: Product[];
  isLoading: boolean;
  error: string | null;
  filters: ProductFilters;

  fetchProducts: () => Promise<void>;
  createProduct: (product: CreateProductDto) => Promise<void>;
  updateProduct: (id: number, product: Partial<CreateProductDto>) => Promise<void>;
  deleteProduct: (id: number) => Promise<void>;
  setFilters: (filters: Partial<ProductFilters>) => void;
  clearError: () => void;

  filteredProducts: () => Product[];
}

export const useProductStore = create<ProductStore>((set, get) => ({
  products: [],
  isLoading: false,
  error: null,
  filters: {
    searchTerm: '',
    categoria: '',
    precoMin: 0,
    precoMax: 999999,
    sortBy: 'nome',
    sortOrder: 'asc',
  },

  fetchProducts: async () => {
    set({ isLoading: true, error: null });
    try {
      const products = await api.getProducts();
      set({ products, isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Erro ao carregar produtos',
        isLoading: false 
      });
    }
  },

  createProduct: async (productData) => {
    set({ isLoading: true, error: null });
    try {
      const newProduct = await api.createProduct(productData);
      set((state) => ({
        products: [...state.products, newProduct],
        isLoading: false,
      }));
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Erro ao criar produto',
        isLoading: false 
      });
      throw error;
    }
  },

  updateProduct: async (id, productData) => {
    set({ isLoading: true, error: null });
    try {
      const updatedProduct = await api.updateProduct(id, productData);
      set((state) => ({
        products: state.products.map((p) => 
          p.id === id ? updatedProduct : p
        ),
        isLoading: false,
      }));
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Erro ao atualizar produto',
        isLoading: false 
      });
      throw error;
    }
  },

  deleteProduct: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await api.deleteProduct(id);
      set((state) => ({
        products: state.products.filter((p) => p.id !== id),
        isLoading: false,
      }));
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Erro ao deletar produto',
        isLoading: false 
      });
      throw error;
    }
  },

  setFilters: (newFilters) => {
    set((state) => ({
      filters: { ...state.filters, ...newFilters },
    }));
  },

  clearError: () => set({ error: null }),

  filteredProducts: () => {
    const { products, filters } = get();
    
    return products
      .filter((product) => {
        const matchesSearch = product.nome
          .toLowerCase()
          .includes(filters.searchTerm.toLowerCase());
        
        const matchesCategory = !filters.categoria || 
          product.categoria === filters.categoria;
        
        const matchesPrice = product.preco >= filters.precoMin && 
          product.preco <= filters.precoMax;
        
        return matchesSearch && matchesCategory && matchesPrice;
      })
      .sort((a, b) => {
        const aValue = a[filters.sortBy];
        const bValue = b[filters.sortBy];
        const multiplier = filters.sortOrder === 'asc' ? 1 : -1;
        
        if (typeof aValue === 'string') {
          return aValue.localeCompare(bValue as string) * multiplier;
        }
        return ((aValue as number) - (bValue as number)) * multiplier;
      });
  },
}));