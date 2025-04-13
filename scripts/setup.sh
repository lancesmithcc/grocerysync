#!/bin/bash

# GrocerySync setup script
# Installs dependencies and generates app icons

echo "=== GrocerySync Setup ==="
echo "Installing dependencies..."
npm install

# Install sharp if needed
if ! npm list | grep -q sharp; then
  echo "Installing sharp for icon generation..."
  npm install --save-dev sharp
fi

echo "Generating app icons..."
npm run generate-icons

echo "Setup complete!"
echo "You can now run the app with: npm run dev" 