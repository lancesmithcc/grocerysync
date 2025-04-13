#!/bin/bash

# This script generates all the necessary icon sizes for PWA
# Requires Inkscape to be installed for SVG conversion

# Check if Inkscape is installed
if ! command -v inkscape &> /dev/null; then
    echo "Error: Inkscape is required but not installed. Please install it first."
    exit 1
fi

# Directory setup
SOURCE_SVG="../public/cart-icon-color.svg"
OUTPUT_DIR="../public"

echo "Generating PWA icons from $SOURCE_SVG..."

# Generate Android icons
inkscape -w 512 -h 512 "$SOURCE_SVG" -o "$OUTPUT_DIR/cart-icon-512x512.png"
inkscape -w 384 -h 384 "$SOURCE_SVG" -o "$OUTPUT_DIR/cart-icon-384x384.png"
inkscape -w 192 -h 192 "$SOURCE_SVG" -o "$OUTPUT_DIR/cart-icon-192x192.png"
inkscape -w 144 -h 144 "$SOURCE_SVG" -o "$OUTPUT_DIR/cart-icon-144x144.png"
inkscape -w 96 -h 96 "$SOURCE_SVG" -o "$OUTPUT_DIR/cart-icon-96x96.png"
inkscape -w 72 -h 72 "$SOURCE_SVG" -o "$OUTPUT_DIR/cart-icon-72x72.png"
inkscape -w 48 -h 48 "$SOURCE_SVG" -o "$OUTPUT_DIR/cart-icon-48x48.png"

# Generate iOS icons
inkscape -w 180 -h 180 "$SOURCE_SVG" -o "$OUTPUT_DIR/cart-icon-180x180.png"
inkscape -w 167 -h 167 "$SOURCE_SVG" -o "$OUTPUT_DIR/cart-icon-167x167.png"
inkscape -w 152 -h 152 "$SOURCE_SVG" -o "$OUTPUT_DIR/cart-icon-152x152.png"
inkscape -w 120 -h 120 "$SOURCE_SVG" -o "$OUTPUT_DIR/cart-icon-120x120.png"

# Generate favicon sizes
inkscape -w 32 -h 32 "$SOURCE_SVG" -o "$OUTPUT_DIR/cart-icon-32x32.png"
inkscape -w 16 -h 16 "$SOURCE_SVG" -o "$OUTPUT_DIR/cart-icon-16x16.png"

echo "Icon generation complete!" 