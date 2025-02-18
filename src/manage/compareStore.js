import { create } from 'zustand';

const useCompareStore = create((set) => ({
    compareProductId: null,
    setCompareProd: (id) => set({ compareProductId: id }),
    clearCompareProductId: () => set({ compareProductId: null }),
}));

export default useCompareStore;