import { useState, useEffect } from 'react'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { getRestaurants, getMenuItems, getOrders } from './firebaseUtils'
import './App.css'

// Login Component
const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const result = await onLogin(email, password)
    if (!result.success) {
      setError(result.error)
    }
    setLoading(false)
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>E-Waiter Admin Login</h2>
        {error && <div className="error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  )
}

// Dashboard Component
const Dashboard = () => {
  const { currentUser, logout } = useAuth()
  const [restaurants, setRestaurants] = useState([])
  const [menuItems, setMenuItems] = useState([])
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        const [restaurantsResult, menuResult, ordersResult] = await Promise.all([
          getRestaurants(),
          getMenuItems(),
          getOrders()
        ])

        if (restaurantsResult.success) setRestaurants(restaurantsResult.data)
        if (menuResult.success) setMenuItems(menuResult.data)
        if (ordersResult.success) setOrders(ordersResult.data)
      } catch (error) {
        console.error('Error loading data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  const handleLogout = async () => {
    await logout()
  }

  if (loading) {
    return <div className="loading">Loading dashboard...</div>
  }

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>E-Waiter Admin Dashboard</h1>
        <div className="user-info">
          <span>Welcome, {currentUser?.email}</span>
          <button onClick={handleLogout} className="logout-btn">Logout</button>
        </div>
      </header>

      <div className="dashboard-stats">
        <div className="stat-card">
          <h3>Restaurants</h3>
          <p className="stat-number">{restaurants.length}</p>
        </div>
        <div className="stat-card">
          <h3>Menu Items</h3>
          <p className="stat-number">{menuItems.length}</p>
        </div>
        <div className="stat-card">
          <h3>Orders</h3>
          <p className="stat-number">{orders.length}</p>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="section">
          <h2>Recent Orders</h2>
          {orders.length > 0 ? (
            <div className="orders-list">
              {orders.slice(0, 5).map(order => (
                <div key={order.id} className="order-item">
                  <span>Order #{order.id.slice(-6)}</span>
                  <span className={`status ${order.status}`}>{order.status}</span>
                </div>
              ))}
            </div>
          ) : (
            <p>No orders yet</p>
          )}
        </div>

        <div className="section">
          <h2>Restaurants</h2>
          {restaurants.length > 0 ? (
            <div className="restaurants-list">
              {restaurants.map(restaurant => (
                <div key={restaurant.id} className="restaurant-item">
                  <h4>{restaurant.name}</h4>
                  <p>{restaurant.address}</p>
                </div>
              ))}
            </div>
          ) : (
            <p>No restaurants added yet</p>
          )}
        </div>
      </div>
    </div>
  )
}

// Main App Component
function App() {
  const { currentUser, login } = useAuth()

  return (
    <div className="App">
      {currentUser ? <Dashboard /> : <Login onLogin={login} />}
    </div>
  )
}

// Wrapper component with AuthProvider
const AppWrapper = () => {
  return (
    <AuthProvider>
      <App />
    </AuthProvider>
  )
}

export default AppWrapper
