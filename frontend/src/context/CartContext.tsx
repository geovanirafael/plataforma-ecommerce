import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import * as cartApi from '../api/cart'
import type { Cart } from '../types/Cart'
import { useAuth } from './AuthContext'

interface CartContextType {
  cart: Cart | null
  itemCount: number
  addItem: (productId: number, quantity: number) => Promise<void>
  updateItem: (itemId: number, quantity: number) => Promise<void>
  removeItem: (itemId: number) => Promise<void>
  clearCartLocally: () => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<Cart | null>(null)
  const { isAuthenticated } = useAuth()

  useEffect(() => {
    if (isAuthenticated) {
      cartApi.getCart().then(setCart).catch(() => setCart(null))
    } else {
      setCart(null)
    }
  }, [isAuthenticated])

  async function addItem(productId: number, quantity: number) {
    const updated = await cartApi.addCartItem(productId, quantity)
    setCart(updated)
  }

  async function updateItem(itemId: number, quantity: number) {
    const updated = await cartApi.updateCartItem(itemId, quantity)
    setCart(updated)
  }

  async function removeItem(itemId: number) {
    const updated = await cartApi.removeCartItem(itemId)
    setCart(updated)
  }

  function clearCartLocally() {
    setCart((prev) => (prev ? { ...prev, items: [], total: 0 } : prev))
  }

  const itemCount = cart?.items.reduce((sum, item) => sum + item.quantity, 0) ?? 0

  return (
    <CartContext.Provider
      value={{ cart, itemCount, addItem, updateItem, removeItem, clearCartLocally }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart precisa de estar dentro de um CartProvider')
  }
  return context
}