'use client'

import { useState, useEffect } from 'react'
import { format } from 'date-fns'
import './admin.css'

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8001/api'

interface Booking {
  id: number
  client_name: string
  client_email: string
  client_phone: string
  service_name: string
  staff_name: string
  start_time: string
  end_time: string
  status: string
  price: number
  notes: string
  created_at: string
}

export default function AdminDashboard() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchBookings()
  }, [])

  const fetchBookings = async () => {
    try {
      const response = await fetch(`${API_BASE}/bookings/`)
      const data = await response.json()
      setBookings(data)
    } catch (error) {
      console.error('Failed to fetch bookings:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredBookings = bookings.filter(booking => {
    const matchesFilter = filter === 'all' || booking.status === filter
    const matchesSearch = 
      booking.client_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.client_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.service_name.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesFilter && matchesSearch
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return '#4CAF50'
      case 'pending': return '#FF9800'
      case 'cancelled': return '#F44336'
      case 'completed': return '#2196F3'
      default: return '#9E9E9E'
    }
  }

  if (loading) {
    return (
      <div className="admin-container">
        <div className="loading">Loading bookings...</div>
      </div>
    )
  }

  return (
    <div className="admin-container">
      <div className="admin-header">
        <div className="header-content">
          <img src="/logo.png" alt="House of Hair" className="admin-logo" />
          <h1>House of Hair Management</h1>
        </div>
        <a href="/" className="view-site-btn">View Public Site</a>
      </div>

      <div className="admin-content">
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-number">{bookings.length}</div>
            <div className="stat-label">Total Bookings</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">
              {bookings.filter(b => b.status === 'confirmed').length}
            </div>
            <div className="stat-label">Confirmed</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">
              {bookings.filter(b => b.status === 'pending').length}
            </div>
            <div className="stat-label">Pending</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">
              £{bookings.reduce((sum, b) => sum + (b.price || 0), 0).toFixed(2)}
            </div>
            <div className="stat-label">Total Revenue</div>
          </div>
        </div>

        <div className="bookings-section">
          <div className="section-header">
            <h2>Bookings</h2>
            <div className="controls">
              <input
                type="text"
                placeholder="Search bookings..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
              <select 
                value={filter} 
                onChange={(e) => setFilter(e.target.value)}
                className="filter-select"
              >
                <option value="all">All Status</option>
                <option value="confirmed">Confirmed</option>
                <option value="pending">Pending</option>
                <option value="cancelled">Cancelled</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>

          <div className="bookings-table">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Client</th>
                  <th>Service</th>
                  <th>Staff</th>
                  <th>Date & Time</th>
                  <th>Status</th>
                  <th>Price</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredBookings.length === 0 ? (
                  <tr>
                    <td colSpan={8} style={{ textAlign: 'center', padding: '40px' }}>
                      No bookings found
                    </td>
                  </tr>
                ) : (
                  filteredBookings.map((booking) => (
                    <tr key={booking.id}>
                      <td>#{booking.id}</td>
                      <td>
                        <div className="client-info">
                          <div className="client-name">{booking.client_name}</div>
                          <div className="client-email">{booking.client_email}</div>
                          <div className="client-phone">{booking.client_phone}</div>
                        </div>
                      </td>
                      <td>{booking.service_name}</td>
                      <td>{booking.staff_name}</td>
                      <td>
                        <div className="datetime-info">
                          <div>{format(new Date(booking.start_time), 'MMM d, yyyy')}</div>
                          <div className="time">{format(new Date(booking.start_time), 'h:mm a')}</div>
                        </div>
                      </td>
                      <td>
                        <span 
                          className="status-badge"
                          style={{ backgroundColor: getStatusColor(booking.status) }}
                        >
                          {booking.status}
                        </span>
                      </td>
                      <td>£{booking.price}</td>
                      <td>
                        <button className="action-btn">View</button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="admin-footer">
        <p>67 Bondgate Within, Alnwick, NE66 1HZ</p>
      </div>
    </div>
  )
}
