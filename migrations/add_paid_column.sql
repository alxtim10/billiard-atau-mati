-- Migration: Add payment tracking to billiard session players
-- Date: 2025-12-06
-- Description: Adds a 'paid' boolean column to track payment status for each player

-- Add 'paid' column to billiard_session_players table
-- Default to false (unpaid) for all existing and new records
ALTER TABLE billiard_session_players 
ADD COLUMN paid BOOLEAN NOT NULL DEFAULT false;

-- Create an index for faster queries on paid status
-- This improves performance when filtering/aggregating by payment status
CREATE INDEX idx_billiard_session_players_paid ON billiard_session_players(paid);

-- Optional: View to check migration success
-- Run this after migration to verify the column was added:
-- SELECT column_name, data_type, is_nullable, column_default 
-- FROM information_schema.columns 
-- WHERE table_name = 'billiard_session_players' AND column_name = 'paid';
