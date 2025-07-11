import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import SupplierApiService from 'services/SupplierApiService';
import { Supplier } from 'types/supplierTypes';

interface SupplierContextType {
  suppliers: Supplier[];
  loading: boolean;
  totalCount: number;
  page: number;
  pageSize: number;
  searchTerm: string;
  fetchSuppliers: (page: number, size: number) => void;
  setPage: (page: number) => void;
  setPageSize: (size: number) => void;
  setSearchTerm: (term: string) => void;
  handleDeleteSupplier: (id: number) => Promise<void>;
  handleCreateSupplier: (newSupplier: Omit<Supplier, 'supplierId'>) => Promise<void>;
  handleUpdateSupplier: (id: number, updatedSupplier: Omit<Supplier, 'supplierId'>) => Promise<void>;
}

interface SupplierProviderProps {
  children: ReactNode;
}

const SupplierContext = createContext<SupplierContextType | undefined>(undefined);

export const SupplierProvider: React.FC<SupplierProviderProps> = ({ children }) => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(8);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [searchTerm, setSearchTerm] = useState<string>('');

  useEffect(() => {
    fetchSuppliers(page + 1, pageSize);
  }, [page, pageSize]);

  const fetchSuppliers = async (page: number, size: number) => {
    setLoading(true);
    try {
      const response = await SupplierApiService.getAllSuppliers(page, size);
      setSuppliers(response.data);  // Dữ liệu nhà cung cấp nằm trong trường 'data'
      setTotalCount(response.totalElements);  // Thông tin tổng số bản ghi
    } catch (error) {
      console.error('Lỗi khi tải nhà cung cấp:', error);
    } finally {
      setLoading(false);
    }
  };
  const handleDeleteSupplier = async (id: number) => {
    try {
      await SupplierApiService.deleteSupplier(id);
      fetchSuppliers(page + 1, pageSize); // Refresh list after delete
    } catch (error) {
      console.error('Lỗi khi xóa nhà cung cấp:', error);
    }
  };

  const handleCreateSupplier = async (newSupplier: Omit<Supplier, 'supplierId'>) => {
    try {
      await SupplierApiService.createSupplier(newSupplier);
      fetchSuppliers(page + 1, pageSize); // Refresh list after create
    } catch (error) {
      console.error('Lỗi khi tạo nhà cung cấp:', error);
    }
  };

  const handleUpdateSupplier = async (id: number, updatedSupplier: Omit<Supplier, 'supplierId'>) => {
    try {
      await SupplierApiService.updateSupplier(id, updatedSupplier);
      fetchSuppliers(page + 1, pageSize); // Refresh list after update
    } catch (error) {
      console.error('Lỗi khi cập nhật nhà cung cấp:', error);
    }
  };

  return (
    <SupplierContext.Provider
      value={{
        suppliers,
        loading,
        totalCount,
        page,
        pageSize,
        searchTerm,
        fetchSuppliers,
        setPage,
        setPageSize,
        setSearchTerm,
        handleDeleteSupplier,
        handleCreateSupplier,
        handleUpdateSupplier,
      }}
    >
      {children}
    </SupplierContext.Provider>
  );
};

export const useSupplierContext = (): SupplierContextType => {
  const context = useContext(SupplierContext);
  if (!context) {
    throw new Error('useSupplierContext must be used within a SupplierProvider');
  }
  return context;
};
