-- Initialize BAYSCOM ERP Database
-- This script sets up the initial database schema and data

-- Create extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom types for Nigerian business context
CREATE TYPE currency_code AS ENUM ('NGN', 'USD', 'EUR');
CREATE TYPE vat_rate AS ENUM ('7.5', '0.0');

-- Create audit trail function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create tables for core business entities
CREATE TABLE IF NOT EXISTS companies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    registration_number VARCHAR(100),
    tax_id VARCHAR(50),
    address TEXT,
    phone VARCHAR(20),
    email VARCHAR(100),
    website VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert BAYSCOM Energy Limited
INSERT INTO companies (name, registration_number, tax_id, address, phone, email, website) 
VALUES (
    'BAYSCOM Energy Limited',
    'RC1234567',
    'TIN123456789',
    'Lagos, Nigeria',
    '+234-800-BAYSCOM',
    'info@bayscom.com.ng',
    'https://bayscom.com.ng'
) ON CONFLICT DO NOTHING;

-- Create currency exchange rates table
CREATE TABLE IF NOT EXISTS exchange_rates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    from_currency currency_code NOT NULL,
    to_currency currency_code NOT NULL,
    rate DECIMAL(15, 6) NOT NULL,
    effective_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default NGN exchange rates
INSERT INTO exchange_rates (from_currency, to_currency, rate, effective_date) VALUES
('USD', 'NGN', 1500.00, CURRENT_DATE),
('EUR', 'NGN', 1650.00, CURRENT_DATE),
('NGN', 'USD', 0.000667, CURRENT_DATE),
('NGN', 'EUR', 0.000606, CURRENT_DATE)
ON CONFLICT DO NOTHING;

-- Create VAT rates table
CREATE TABLE IF NOT EXISTS vat_rates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    rate vat_rate NOT NULL,
    description VARCHAR(255),
    effective_date DATE NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert Nigerian VAT rate
INSERT INTO vat_rates (rate, description, effective_date) VALUES
('7.5', 'Standard Nigerian VAT Rate', '2020-02-01'),
('0.0', 'VAT Exempt', CURRENT_DATE)
ON CONFLICT DO NOTHING;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_companies_active ON companies(is_active);
CREATE INDEX IF NOT EXISTS idx_exchange_rates_date ON exchange_rates(effective_date);
CREATE INDEX IF NOT EXISTS idx_vat_rates_active ON vat_rates(is_active);

-- Add triggers for updated_at
DROP TRIGGER IF EXISTS update_companies_updated_at ON companies;
CREATE TRIGGER update_companies_updated_at
    BEFORE UPDATE ON companies
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Grant permissions (adjust as needed for production)
-- GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO bayscom_user;
-- GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO bayscom_user;

-- Create sample data for development
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM companies WHERE name = 'BAYSCOM Energy Limited') THEN
        RAISE NOTICE 'BAYSCOM Energy Limited company record created successfully';
    END IF;
    
    RAISE NOTICE 'BAYSCOM ERP Database initialization completed successfully';
    RAISE NOTICE 'Currency: Nigerian Naira (NGN) configured';
    RAISE NOTICE 'VAT Rate: 7.5%% (Nigerian standard) configured';
END $$;
