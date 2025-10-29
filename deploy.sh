#!/bin/bash

# CloudOps Solutions Website Deployment Script
# This script prepares and deploys the static website

set -e  # Exit on any error

echo "🚀 Starting CloudOps Solutions Website Deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check dependencies
check_dependencies() {
    log_info "Checking dependencies..."
    
    # Check if Node.js is installed
    if ! command -v node &> /dev/null; then
        log_error "Node.js is not installed. Please install Node.js 16+ and try again."
        exit 1
    fi
    
    # Check Node.js version
    NODE_VERSION=$(node --version | cut -d 'v' -f 2 | cut -d '.' -f 1)
    if [ "$NODE_VERSION" -lt 16 ]; then
        log_error "Node.js version 16+ is required. Current version: $(node --version)"
        exit 1
    fi
    
    # Check if npm is installed
    if ! command -v npm &> /dev/null; then
        log_error "npm is not installed. Please install npm and try again."
        exit 1
    fi
    
    log_success "Dependencies check passed"
}

# Install build dependencies
install_dependencies() {
    log_info "Installing build dependencies..."
    
    if [ ! -f "package.json" ]; then
        log_error "package.json not found. Please run this script from the project root."
        exit 1
    fi
    
    npm install --only=dev
    log_success "Dependencies installed"
}

# Clean and prepare build directory
prepare_build() {
    log_info "Preparing build directory..."
    
    # Remove existing dist directory
    if [ -d "dist" ]; then
        rm -rf dist
        log_info "Cleaned existing build directory"
    fi
    
    # Create new dist directory
    mkdir -p dist/{css,js,assets}
    log_success "Build directory prepared"
}

# Copy and optimize files
optimize_files() {
    log_info "Optimizing files..."
    
    # Copy HTML files
    cp index.html dist/
    
    # Copy and optimize CSS
    if [ -f "css/style.css" ]; then
        mkdir -p dist/css
        npx uglifycss css/style.css > dist/css/style.css
        log_info "CSS optimized"
    fi
    
    # Copy and optimize JavaScript
    if [ -f "js/main.js" ]; then
        mkdir -p dist/js
        npx terser js/main.js --compress --mangle --output dist/js/main.js
        log_info "JavaScript optimized"
    fi
    
    # Copy assets if they exist
    if [ -d "assets" ]; then
        cp -r assets/* dist/assets/
        log_info "Assets copied"
    fi
    
    # Copy favicon if it exists
    if [ -f "favicon.ico" ]; then
        cp favicon.ico dist/
    fi
    
    log_success "Files optimized and copied"
}

# Generate SEO files
generate_seo_files() {
    log_info "Generating SEO files..."
    
    # Generate robots.txt
    cat > dist/robots.txt << EOF
User-agent: *
Allow: /

Sitemap: https://cloudops-solutions.github.io/sitemap.xml
EOF
    
    # Generate sitemap.xml
    CURRENT_DATE=$(date -u +%Y-%m-%d)
    cat > dist/sitemap.xml << EOF
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://cloudops-solutions.github.io/</loc>
    <lastmod>${CURRENT_DATE}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://cloudops-solutions.github.io/#services</loc>
    <lastmod>${CURRENT_DATE}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://cloudops-solutions.github.io/#portfolio</loc>
    <lastmod>${CURRENT_DATE}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://cloudops-solutions.github.io/#about</loc>
    <lastmod>${CURRENT_DATE}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://cloudops-solutions.github.io/#contact</loc>
    <lastmod>${CURRENT_DATE}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
  </url>
</urlset>
EOF
    
    log_success "SEO files generated"
}

# Validate build
validate_build() {
    log_info "Validating build..."
    
    # Check if main files exist
    if [ ! -f "dist/index.html" ]; then
        log_error "index.html not found in build directory"
        exit 1
    fi
    
    if [ ! -f "dist/css/style.css" ]; then
        log_warning "style.css not found in build directory"
    fi
    
    if [ ! -f "dist/js/main.js" ]; then
        log_warning "main.js not found in build directory"
    fi
    
    # Check file sizes
    HTML_SIZE=$(du -h dist/index.html | cut -f1)
    log_info "HTML size: $HTML_SIZE"
    
    if [ -f "dist/css/style.css" ]; then
        CSS_SIZE=$(du -h dist/css/style.css | cut -f1)
        log_info "CSS size: $CSS_SIZE"
    fi
    
    if [ -f "dist/js/main.js" ]; then
        JS_SIZE=$(du -h dist/js/main.js | cut -f1)
        log_info "JavaScript size: $JS_SIZE"
    fi
    
    log_success "Build validation completed"
}

# Run local server for testing
serve_local() {
    log_info "Starting local development server..."
    log_info "Server will be available at http://localhost:3000"
    log_info "Press Ctrl+C to stop the server"
    
    cd dist
    npx live-server --port=3000 --host=localhost --open=/index.html
}

# Main deployment process
main() {
    echo "=================================================="
    echo "🌩️  CloudOps Solutions Website Deployment"
    echo "=================================================="
    
    check_dependencies
    install_dependencies
    prepare_build
    optimize_files
    generate_seo_files
    validate_build
    
    log_success "🎉 Build completed successfully!"
    echo ""
    echo "Build artifacts are available in the 'dist' directory."
    echo ""
    echo "Next steps:"
    echo "1. Test locally: ./deploy.sh --serve"
    echo "2. Deploy to GitHub Pages: git push origin main"
    echo "3. Or deploy manually: cp -r dist/* /path/to/web/server/"
    echo ""
}

# Handle command line arguments
case "${1:-}" in
    --serve)
        serve_local
        ;;
    --help)
        echo "Usage: $0 [option]"
        echo ""
        echo "Options:"
        echo "  (no option)  Build the website for production"
        echo "  --serve      Start local development server"
        echo "  --help       Show this help message"
        ;;
    *)
        main
        ;;
esac