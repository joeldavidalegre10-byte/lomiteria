import { useState, useEffect } from 'react';
import { Login } from './components/Login';
import { Sidebar } from './components/Sidebar';
import type { AppView } from './components/Sidebar';
import { CategoryBar } from './components/CategoryBar';
import { ProductCard } from './components/ProductCard';
import { Cart } from './components/Cart';
import { ModifierModal } from './components/ModifierModal';
import { CheckoutModal } from './components/CheckoutModal';
import { PaymentModal } from './components/PaymentModal';
import { MesasView } from './components/MesasView';
import { DeliveryView } from './components/DeliveryView';
import { InventoryView } from './components/InventoryView';
import { ReportsView } from './components/ReportsView';
import { products as initialProducts } from './data/products';
import type { Product, CartItem, OrderType, ActiveOrder, Sale, PaymentMethod, AuthUser } from './types';

export default function App() {
  // Auth
  const [user, setUser] = useState<AuthUser | null>(null);

  // Navigation
  const [activeView, setActiveView] = useState<AppView>('ventas');

  // POS state
  const [products, setProducts] = useState<Product[]>([]);
  const [activeCategory, setActiveCategory] = useState('lomitos');
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [orderType, setOrderType] = useState<OrderType>('mesa');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showCheckout, setShowCheckout] = useState(false);
  const [activeOrders, setActiveOrders] = useState<ActiveOrder[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<ActiveOrder | null>(null);
  const [sales, setSales] = useState<Sale[]>([]);
  const [lastSale, setLastSale] = useState<Sale | null>(null);

  // Load from localStorage
  useEffect(() => {
    const savedProducts = localStorage.getItem('lomiteria_products');
    if (savedProducts) {
      setProducts(JSON.parse(savedProducts));
    } else {
      setProducts(initialProducts);
      localStorage.setItem('lomiteria_products', JSON.stringify(initialProducts));
    }

    const savedOrders = localStorage.getItem('lomiteria_active_orders');
    if (savedOrders) setActiveOrders(JSON.parse(savedOrders));
    const savedSales = localStorage.getItem('lomiteria_sales');
    if (savedSales) setSales(JSON.parse(savedSales));
  }, []);

  // Derived
  const filteredProducts = products.filter(p => p.category === activeCategory);
  const mesaOrders = activeOrders.filter(o => o.orderType === 'mesa');
  const deliveryOrders = activeOrders.filter(o => o.orderType === 'delivery');

  // ── Cart handlers ──────────────────────────────────────────────
  const handleAddToCart = (product: Product) => {
    if (product.modifiers && product.modifiers.length > 0) {
      setSelectedProduct(product);
    } else {
      addProductToCart(product, []);
    }
  };

  const addProductToCart = (product: Product, modifiers: string[]) => {
    // Clear last sale when starting a new order
    if (cartItems.length === 0 && lastSale) {
      setLastSale(null);
    }

    const modifierPrice = modifiers.reduce((sum, modName) => {
      const mod = product.modifiers?.find(m => m.name === modName);
      return sum + (mod?.price || 0);
    }, 0);

    const existingItem = cartItems.find(
      item => item.productId === product.id &&
      JSON.stringify(item.modifiers) === JSON.stringify(modifiers)
    );

    if (existingItem) {
      setCartItems(cartItems.map(item =>
        item.id === existingItem.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      const newItem: CartItem = {
        id: `${product.id}-${Date.now()}`,
        productId: product.id,
        name: product.name,
        price: product.price + modifierPrice,
        quantity: 1,
        modifiers: modifiers.length > 0 ? modifiers : undefined,
      };
      setCartItems([...cartItems, newItem]);
    }
    setSelectedProduct(null);
  };

  const handleUpdateQuantity = (id: string, quantity: number) => {
    if (quantity === 0) {
      setCartItems(cartItems.filter(item => item.id !== id));
    } else {
      setCartItems(cartItems.map(item =>
        item.id === id ? { ...item, quantity } : item
      ));
    }
  };

  const handleRemoveItem = (id: string) => {
    setCartItems(cartItems.filter(item => item.id !== id));
  };

  // ── Order handlers ─────────────────────────────────────────────
  const handleAssignOrder = (tableNumber?: number) => {
    const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const iva = subtotal * 0.21;
    const total = subtotal + iva;

    const deliveryCount = activeOrders.filter(o => o.orderType === 'delivery').length;
    const deliveryNumber = orderType === 'delivery' ? deliveryCount + 1 : undefined;

    const newOrder: ActiveOrder = {
      id: `order-${Date.now()}`,
      items: [...cartItems],
      orderType,
      tableNumber,
      deliveryNumber,
      subtotal,
      iva,
      total,
      timestamp: new Date().toISOString(),
    };

    const updatedOrders = [newOrder, ...activeOrders];
    setActiveOrders(updatedOrders);
    localStorage.setItem('lomiteria_active_orders', JSON.stringify(updatedOrders));
    setCartItems([]);
    setShowCheckout(false);

    // Navigate to the corresponding view
    setActiveView(orderType === 'mesa' ? 'mesas' : 'delivery');
  };

  const handleOrderClick = (order: ActiveOrder) => {
    setSelectedOrder(order);
  };

  const handleConfirmSale = (paymentMethod: PaymentMethod, cashReceived?: number, change?: number) => {
    if (!selectedOrder) return;

    const newSale: Sale = {
      ...selectedOrder,
      paymentMethod,
      completedAt: new Date().toISOString(),
      cashReceived,
      change,
    };

    const updatedSales = [newSale, ...sales];
    setSales(updatedSales);
    localStorage.setItem('lomiteria_sales', JSON.stringify(updatedSales));

    // Set as last sale to display
    setLastSale(newSale);

    const updatedOrders = activeOrders.filter(order => order.id !== selectedOrder.id);
    setActiveOrders(updatedOrders);
    localStorage.setItem('lomiteria_active_orders', JSON.stringify(updatedOrders));

    setSelectedOrder(null);

    // Smart navigation: if no more pending orders, go to sales
    const currentViewOrders = selectedOrder.orderType === 'mesa'
      ? updatedOrders.filter(o => o.orderType === 'mesa')
      : updatedOrders.filter(o => o.orderType === 'delivery');

    if (currentViewOrders.length === 0) {
      // No more pending orders in this view, redirect to sales
      setActiveView('ventas');
    }
    // Otherwise stay in current view (mesas or delivery)
  };

  const handleLogout = () => {
    setUser(null);
    setActiveView('ventas');
  };

  // ── Auth gate ──────────────────────────────────────────────────
  if (!user) {
    return <Login onLogin={setUser} />;
  }

  return (
    <div className="flex h-screen bg-[#0d0d0d] overflow-hidden">
      {/* Sidebar */}
      <Sidebar
        user={user}
        activeView={activeView}
        onViewChange={setActiveView}
        mesaCount={mesaOrders.length}
        deliveryCount={deliveryOrders.length}
        onLogout={handleLogout}
      />

      {/* Main area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Category bar — only in Ventas view */}
        {activeView === 'ventas' && (
          <CategoryBar
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
          />
        )}

        {/* Content */}
        <div className="flex-1 flex min-h-0 overflow-hidden">
          {/* Ventas: product grid + cart */}
          {activeView === 'ventas' && (
            <>
              <main className="flex-1 overflow-y-auto p-6">
                {/* Section header */}
                <div className="mb-5 flex items-center justify-between">
                  <div>
                    <h2 className="text-[#d0d0d0] capitalize">{activeCategory}</h2>
                    <p className="text-xs text-[#444] mt-0.5">
                      {filteredProducts.length} productos disponibles
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {filteredProducts.map(product => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onAddToCart={handleAddToCart}
                    />
                  ))}
                </div>
              </main>

              <Cart
                items={cartItems}
                orderType={orderType}
                onOrderTypeChange={setOrderType}
                onUpdateQuantity={handleUpdateQuantity}
                onRemoveItem={handleRemoveItem}
                onCheckout={() => setShowCheckout(true)}
                lastSale={lastSale}
              />
            </>
          )}

          {/* Mesas view */}
          {activeView === 'mesas' && (
            <MesasView
              orders={mesaOrders}
              onOrderClick={handleOrderClick}
            />
          )}

          {/* Delivery view */}
          {activeView === 'delivery' && (
            <DeliveryView
              orders={deliveryOrders}
              onOrderClick={handleOrderClick}
            />
          )}

          {/* Inventario — admin only */}
          {activeView === 'inventario' && user.role === 'admin' && (
            <InventoryView />
          )}

          {/* Reportes — admin only */}
          {activeView === 'reportes' && user.role === 'admin' && (
            <ReportsView sales={sales} />
          )}
        </div>
      </div>

      {/* ── Modals ── */}
      {selectedProduct && (
        <ModifierModal
          product={selectedProduct}
          onConfirm={(modifiers) => addProductToCart(selectedProduct, modifiers)}
          onClose={() => setSelectedProduct(null)}
        />
      )}

      {showCheckout && (
        <CheckoutModal
          items={cartItems}
          orderType={orderType}
          onConfirm={handleAssignOrder}
          onClose={() => setShowCheckout(false)}
        />
      )}

      {selectedOrder && (
        <PaymentModal
          order={selectedOrder}
          onConfirm={handleConfirmSale}
          onClose={() => setSelectedOrder(null)}
        />
      )}
    </div>
  );
}
