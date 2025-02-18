import { create } from "zustand";
import { persist } from "zustand/middleware";

const addCartsStore = create(
    persist(
        (set) => ({
            carts: [],
            addCart: (cart) => set((state) => ({
                ...state, carts: [...state.carts, cart],
            })),
            removeCart: (p_name) => set((state) => ({
                ...state,
                carts: state.carts.filter((cart) => cart.ProductName !== p_name),
            })),
        }),
        { name: "carts" }
    )
);

export default addCartsStore;