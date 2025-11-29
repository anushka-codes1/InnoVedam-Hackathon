-- Campus Borrowing Platform Database Schema
-- Created for InnoVedam Hackathon by Team ErRor_404

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users Table with College Email Verification
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    college_email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    college_id VARCHAR(100) NOT NULL,
    college_name VARCHAR(255) NOT NULL,
    is_email_verified BOOLEAN DEFAULT FALSE,
    profile_image_url TEXT,
    
    -- Trust & Risk Metrics
    trust_score INTEGER DEFAULT 100,
    total_borrows INTEGER DEFAULT 0,
    total_lends INTEGER DEFAULT 0,
    on_time_returns INTEGER DEFAULT 0,
    late_returns INTEGER DEFAULT 0,
    disputes INTEGER DEFAULT 0,
    
    -- Account Status
    is_active BOOLEAN DEFAULT TRUE,
    is_buddy_courier BOOLEAN DEFAULT FALSE,
    buddy_courier_rating DECIMAL(3,2) DEFAULT 0.00,
    total_deliveries INTEGER DEFAULT 0,
    
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Items Listings Table
CREATE TABLE items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    owner_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100) NOT NULL,
    
    -- Campus Fair Price Model
    base_price DECIMAL(10,2) NOT NULL,
    min_price DECIMAL(10,2) NOT NULL,
    max_price DECIMAL(10,2) NOT NULL,
    suggested_price DECIMAL(10,2) NOT NULL,
    
    -- Collateral for High-Value Items
    requires_collateral BOOLEAN DEFAULT FALSE,
    collateral_amount DECIMAL(10,2),
    is_high_value BOOLEAN DEFAULT FALSE,
    
    -- Item Details
    condition VARCHAR(50) NOT NULL,
    available_quantity INTEGER DEFAULT 1,
    images TEXT[], -- Array of image URLs
    
    -- Delivery Options
    allows_self_delivery BOOLEAN DEFAULT TRUE,
    allows_buddy_delivery BOOLEAN DEFAULT FALSE,
    allows_priority_delivery BOOLEAN DEFAULT FALSE,
    
    -- Location
    pickup_location TEXT,
    campus_building VARCHAR(100),
    
    -- Status
    is_available BOOLEAN DEFAULT TRUE,
    
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Borrowing Transactions Table
CREATE TABLE transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    item_id UUID REFERENCES items(id) ON DELETE CASCADE,
    borrower_id UUID REFERENCES users(id) ON DELETE CASCADE,
    lender_id UUID REFERENCES users(id) ON DELETE CASCADE,
    
    -- Time-Bound Borrowing
    borrow_start_time TIMESTAMP NOT NULL,
    expected_return_time TIMESTAMP NOT NULL,
    actual_return_time TIMESTAMP,
    duration_hours INTEGER NOT NULL,
    
    -- Pricing
    agreed_price DECIMAL(10,2) NOT NULL,
    platform_fee DECIMAL(10,2) DEFAULT 3.00,
    priority_boost_fee DECIMAL(10,2) DEFAULT 0.00,
    convenience_pickup_fee DECIMAL(10,2) DEFAULT 0.00,
    total_amount DECIMAL(10,2) NOT NULL,
    
    -- Payment Status (Stripe Integration)
    payment_intent_id VARCHAR(255),
    payment_status VARCHAR(50) DEFAULT 'pending',
    pre_auth_amount DECIMAL(10,2),
    security_deposit DECIMAL(10,2),
    
    -- QR-Based Hand-Off & Return
    handoff_qr_code TEXT,
    return_qr_code TEXT,
    handoff_verified BOOLEAN DEFAULT FALSE,
    return_verified BOOLEAN DEFAULT FALSE,
    handoff_timestamp TIMESTAMP,
    return_timestamp TIMESTAMP,
    
    -- Delivery Method
    delivery_method VARCHAR(50) NOT NULL, -- 'self', 'buddy', 'priority'
    buddy_courier_id UUID REFERENCES users(id),
    meeting_point TEXT,
    meeting_coordinates POINT,
    
    -- Smart Return Risk Score
    risk_score INTEGER,
    risk_factors JSONB,
    auto_reminder_sent BOOLEAN DEFAULT FALSE,
    reminder_count INTEGER DEFAULT 0,
    
    -- Status
    status VARCHAR(50) DEFAULT 'pending', -- pending, active, completed, cancelled, disputed
    
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Auto-Reminders Table
CREATE TABLE reminders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    transaction_id UUID REFERENCES transactions(id) ON DELETE CASCADE,
    reminder_type VARCHAR(50) NOT NULL, -- 'upcoming', 'due_soon', 'overdue'
    scheduled_time TIMESTAMP NOT NULL,
    sent_at TIMESTAMP,
    is_sent BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Price Abuse Reports Table
CREATE TABLE price_reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    item_id UUID REFERENCES items(id) ON DELETE CASCADE,
    reporter_id UUID REFERENCES users(id) ON DELETE CASCADE,
    reported_price DECIMAL(10,2) NOT NULL,
    fair_price_estimate DECIMAL(10,2) NOT NULL,
    reason TEXT,
    status VARCHAR(50) DEFAULT 'pending',
    reviewed_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW()
);

-- Buddy Couriers Table
CREATE TABLE buddy_couriers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    is_available BOOLEAN DEFAULT TRUE,
    current_location POINT,
    campus_zone VARCHAR(100),
    delivery_radius_km DECIMAL(5,2) DEFAULT 2.0,
    earnings_total DECIMAL(10,2) DEFAULT 0.00,
    rating DECIMAL(3,2) DEFAULT 5.00,
    total_deliveries INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Meeting Points Table (Smart Automation)
CREATE TABLE meeting_points (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    campus_building VARCHAR(100),
    coordinates POINT NOT NULL,
    is_popular BOOLEAN DEFAULT FALSE,
    usage_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Reviews & Ratings Table
CREATE TABLE reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    transaction_id UUID REFERENCES transactions(id) ON DELETE CASCADE,
    reviewer_id UUID REFERENCES users(id) ON DELETE CASCADE,
    reviewee_id UUID REFERENCES users(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    review_text TEXT,
    review_type VARCHAR(50) NOT NULL, -- 'borrower', 'lender', 'courier'
    created_at TIMESTAMP DEFAULT NOW()
);

-- College Store Subscriptions Table
CREATE TABLE college_store_subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    college_name VARCHAR(255) NOT NULL,
    store_name VARCHAR(255) NOT NULL,
    contact_email VARCHAR(255) NOT NULL,
    subscription_type VARCHAR(50) DEFAULT 'basic',
    monthly_fee DECIMAL(10,2) DEFAULT 2500.00,
    is_active BOOLEAN DEFAULT TRUE,
    features JSONB,
    created_at TIMESTAMP DEFAULT NOW(),
    renewed_at TIMESTAMP DEFAULT NOW()
);

-- Notifications Table
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) NOT NULL, -- 'reminder', 'payment', 'delivery', 'review'
    is_read BOOLEAN DEFAULT FALSE,
    related_transaction_id UUID REFERENCES transactions(id),
    created_at TIMESTAMP DEFAULT NOW()
);

-- Insert Sample Meeting Points
INSERT INTO meeting_points (name, description, campus_building, coordinates, is_popular, usage_count) VALUES
    ('Main Library Entrance', 'Outside main library, near benches', 'Library Block', POINT(77.5946, 12.9716), TRUE, 150),
    ('Student Cafeteria', 'Inside cafeteria, near counter', 'Student Center', POINT(77.5950, 12.9720), TRUE, 200),
    ('Academic Block A - Ground Floor', 'Near water cooler', 'Block A', POINT(77.5948, 12.9718), TRUE, 120),
    ('Sports Complex', 'Main entrance gate', 'Sports Block', POINT(77.5952, 12.9714), FALSE, 45),
    ('Hostel Common Room', 'Boys hostel common area', 'Hostel Block', POINT(77.5944, 12.9722), FALSE, 80);

-- Create Indexes for Performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_college_email ON users(college_email);
CREATE INDEX idx_items_owner ON items(owner_id);
CREATE INDEX idx_items_category ON items(category);
CREATE INDEX idx_transactions_borrower ON transactions(borrower_id);
CREATE INDEX idx_transactions_lender ON transactions(lender_id);
CREATE INDEX idx_transactions_status ON transactions(status);
CREATE INDEX idx_transactions_dates ON transactions(borrow_start_time, expected_return_time);
CREATE INDEX idx_buddy_couriers_available ON buddy_couriers(is_available);
CREATE INDEX idx_notifications_user ON notifications(user_id, is_read);

-- Create Updated At Trigger Function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply Updated At Triggers
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_items_updated_at BEFORE UPDATE ON items
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_transactions_updated_at BEFORE UPDATE ON transactions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_buddy_couriers_updated_at BEFORE UPDATE ON buddy_couriers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
