import { useCartStore } from '../stores/cartStore';

export function useCart() {
  const store = useCartStore();
  return {
    items: store.items,
    isOpen: store.isOpen,
    addItem: store.addItem,
    removeItem: store.removeItem,
    updateQuantity: store.updateQuantity,
    clearCart: store.clearCart,
    openCart: () => store.setOpen(true),
    closeCart: () => store.setOpen(false),
    toggleOpen: store.toggleOpen,
    totalItems: store.totalItems(),
    subtotal: store.totalPrice(),
    shippingCost: store.shippingCost(),
    grandTotal: store.grandTotal(),
  };
}
