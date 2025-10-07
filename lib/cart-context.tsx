"use client"

import type React from "react"
import { createContext, useContext, useReducer, useEffect } from "react"
import type { Cart } from "./types"
import { cartApi } from "./api"

interface CartState {
  cart: Cart | null
  isLoading: boolean
  error: string | null
}

type CartAction =
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_CART"; payload: Cart }
  | { type: "SET_ERROR"; payload: string }
  | { type: "CLEAR_ERROR" }
  | { type: "UPDATE_ITEM_QUANTITY"; payload: { itemId: number; quantity: number } }
  | { type: "REMOVE_ITEM"; payload: number }

const initialState: CartState = {
  cart: null,
  isLoading: false,
  error: null,
}

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, isLoading: action.payload }
    case "SET_CART":
      return { ...state, cart: action.payload, isLoading: false, error: null }
    case "SET_ERROR":
      return { ...state, error: action.payload, isLoading: false }
    case "CLEAR_ERROR":
      return { ...state, error: null }
    case "UPDATE_ITEM_QUANTITY":
      if (!state.cart) return state
      return {
        ...state,
        cart: {
          ...state.cart,
          items: state.cart.items.map((item) =>
            item.id === action.payload.itemId ? { ...item, quantity: action.payload.quantity } : item,
          ),
        },
      }
    case "REMOVE_ITEM":
      if (!state.cart) return state
      const itemToRemove = state.cart.items.find(item => item.id === action.payload)
      const removedQuantity = itemToRemove ? itemToRemove.quantity : 0
      return {
        ...state,
        cart: {
          ...state.cart,
          items: state.cart.items.filter((item) => item.id !== action.payload),
          total_items: state.cart.total_items - removedQuantity,
        },
      }
    default:
      return state
  }
}

interface CartContextType extends CartState {
  addToCart: (variationId: number, quantity: number) => Promise<void>
  updateQuantity: (itemId: number, quantity: number) => Promise<void>
  removeFromCart: (itemId: number) => Promise<void>
  refreshCart: () => Promise<void>
  clearCart: () => Promise<void>
  getSessionId: () => string
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState)

  const getSessionId = () => {
    if (typeof window === "undefined") return ""
    let sessionId = localStorage.getItem("cart_session_id")
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      localStorage.setItem("cart_session_id", sessionId)
    }
    return sessionId
  }

  const refreshCart = async () => {
    try {
      dispatch({ type: "SET_LOADING", payload: true })
      const sessionId = getSessionId()
      const cart = await cartApi.get(sessionId)
      dispatch({ type: "SET_CART", payload: cart as Cart })
    } catch (error) {
      dispatch({ type: "SET_ERROR", payload: "Failed to load cart" })
    }
  }

  const addToCart = async (variationId: number, quantity: number) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true })
      const sessionId = getSessionId()
      await cartApi.addItem({ variation_id: variationId, quantity, session_id: sessionId })
      await refreshCart()
    } catch (error) {
      dispatch({ type: "SET_ERROR", payload: "Failed to add item to cart" })
    }
  }

  const updateQuantity = async (itemId: number, quantity: number) => {
    try {
      dispatch({ type: "UPDATE_ITEM_QUANTITY", payload: { itemId, quantity } })
      const sessionId = getSessionId()
      await cartApi.updateItem(itemId, { quantity }, sessionId)
      await refreshCart()
    } catch (error) {
      dispatch({ type: "SET_ERROR", payload: "Failed to update item quantity" })
      await refreshCart() // Revert on error
    }
  }

  const removeFromCart = async (itemId: number) => {
    // Store the original cart state for potential rollback
    const originalCart = state.cart
    
    try {
      // Optimistically remove the item
      dispatch({ type: "REMOVE_ITEM", payload: itemId })
      
      // Make the API call with session ID
      const sessionId = getSessionId()
      await cartApi.removeItem(itemId, sessionId)
      
      // If successful, refresh cart to get the latest state
      await refreshCart()
    } catch (error) {
      console.error("Failed to remove item from cart:", error)
      
      // Revert the optimistic update by restoring the original cart
      if (originalCart) {
        dispatch({ type: "SET_CART", payload: originalCart })
      }
      
      dispatch({ type: "SET_ERROR", payload: "Failed to remove item from cart" })
    }
  }

  const clearCart = async () => {
    try {
      // Generate a new session ID to effectively clear the cart
      const newSessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      localStorage.setItem("cart_session_id", newSessionId)
      
      // Refresh cart to get the empty cart
      await refreshCart()
    } catch (error) {
      console.error("Failed to clear cart:", error)
      dispatch({ type: "SET_ERROR", payload: "Failed to clear cart" })
    }
  }

  useEffect(() => {
    refreshCart()
  }, [])

  const value: CartContextType = {
    ...state,
    addToCart,
    updateQuantity,
    removeFromCart,
    refreshCart,
    clearCart,
    getSessionId,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
