#!/bin/bash

# Update last update timestamp in build-info.ts
BUILD_INFO_FILE="src/lib/build-info.ts"

# Get current time in JST (Japan Standard Time, UTC+9)
# Format: YYYY-MM-DD HH:MM:SS JST
JST_TIMESTAMP=$(TZ="Asia/Tokyo" date "+%Y-%m-%d %H:%M:%S JST")

# Update the LAST_UPDATE constant
if [ -f "$BUILD_INFO_FILE" ]; then
  # Use sed to replace the timestamp
  if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    sed -i '' "s/export const LAST_UPDATE = \".*\"/export const LAST_UPDATE = \"$JST_TIMESTAMP\"/" "$BUILD_INFO_FILE"
  else
    # Linux
    sed -i "s/export const LAST_UPDATE = \".*\"/export const LAST_UPDATE = \"$JST_TIMESTAMP\"/" "$BUILD_INFO_FILE"
  fi
  
  echo "Updated LAST_UPDATE to: $JST_TIMESTAMP"
else
  echo "Error: $BUILD_INFO_FILE not found"
  exit 1
fi
