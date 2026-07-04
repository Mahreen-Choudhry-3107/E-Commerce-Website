import { createContext, useContext, useReducer, useEffect } from 'react';

const CartContext = createContext();

const SESSION_KEY = 'ecommerce_session';

function getSessionId() {
  let id = sessionStorage.getItem(SESSION_KEY);
  if (!id) {
    id = 'sess_' + Math.random().toString(36).substring(2, 15);
    sessionStorage.setItem(SESSION_KEY, id);
  }
  return id;
}

function cartReducer(state, action) {
  switch (action.type) {
    case 'SET_CART':
      return { ...state, items: action.payload, sessionId: state.sessionId };
    case 'ADD_TO_CART': {
      const existing = state.items.find(i => i.productId === action.payload.productId);
      if (existing) {
        return {
          ...state,
          items: state.items.map(i =>
            i.productId === action.payload.productId
              ? { ...i, quantity: i.quantity + action.payload.quantity }
              : i
          )
        };
      }
      return { ...state, items: [...state.items, action.payload] };
    }
    case 'UPDATE_QUANTITY':
      return {
        ...state,
        items: state.items.map(i =>
          i.productId === action.payload.productId
            ? { ...i, quantity: action.payload.quantity }
            : i
        ).filter(i => i.quantity > 0)
      };
    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter(i => i.productId !== action.payload)
      };
    case 'CLEAR_CART':
      return { ...state, items: [] };
    default:
      return state;
  }
}

export function CartProvider({ children }) {
  const sessionId = getSessionId();
  const [state, dispatch] = useReducer(cartReducer, { items: [], sessionId });

  useEffect(() => {
    fetch(`/api/cart/${sessionId}`)
      .then(res => res.json())
      .then(items => dispatch({ type: 'SET_CART', payload: items }))
      .catch(() => {});
  }, [sessionId]);

  const syncCart = (items) => {
    fetch(`/api/cart/${sessionId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(items)
    }).catch(() => {});
  };

  const addToCart = (productId, quantity = 1) => {
    dispatch({ type: 'ADD_TO_CART', payload: { productId, quantity } });
    fetch(`/api/cart/${sessionId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId, quantity })
    }).catch(() => {});
  };

  const updateQuantity = (productId, quantity) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { productId, quantity } });
    if (quantity > 0) {
      fetch(`/api/cart/${sessionId}/${productId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantity })
      }).catch(() => {});
    } else {
      fetch(`/api/cart/${sessionId}/${productId}`, {
        method: 'DELETE'
      }).catch(() => {});
    }
  };

  const removeFromCart = (productId) => {
    dispatch({ type: 'REMOVE_ITEM', payload: productId });
    fetch(`/api/cart/${sessionId}/${productId}`, {
      method: 'DELETE'
    }).catch(() => {});
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const cartCount = state.items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider value={{
      items: state.items,
      cartCount,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
      sessionId
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
}
