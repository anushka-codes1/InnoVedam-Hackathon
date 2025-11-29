#!/bin/bash

# Campus Borrowing Platform - Quick Start Script
# Team ErRor_404 - InnoVedam Hackathon

echo "🎓 Campus Borrowing Platform - Quick Start"
echo "=========================================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

echo "✅ Node.js $(node -v) detected"

# Check if pnpm is installed
if ! command -v pnpm &> /dev/null; then
    echo "📦 pnpm not found. Installing pnpm..."
    npm install -g pnpm
fi

echo "✅ pnpm $(pnpm -v) detected"

# Install dependencies
echo ""
echo "📦 Installing dependencies..."
pnpm install

# Check if .env exists
if [ ! -f .env ]; then
    echo ""
    echo "⚙️  Creating .env file..."
    cp .env.example .env
    echo "⚠️  Please edit .env and add your API keys:"
    echo "   - Supabase URL and keys"
    echo "   - Stripe secret keys"
    echo ""
    echo "📖 See SETUP_GUIDE.md for detailed instructions"
fi

echo ""
echo "✨ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Edit .env with your API keys (see SETUP_GUIDE.md)"
echo "2. Run database setup in Supabase (db/seeds.sql)"
echo "3. Start development server: pnpm dev"
echo ""
echo "📚 Documentation:"
echo "   - README.md - Project overview"
echo "   - SETUP_GUIDE.md - Detailed setup instructions"
echo "   - API_DOCS.md - API documentation"
echo "   - IMPLEMENTATION_SUMMARY.md - Feature details"
echo ""
echo "🚀 Happy coding!"
