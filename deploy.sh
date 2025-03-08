#!/usr/bin/env bash

# Exit on error
set -e

# Display commands
set -x

# Build the project
echo "Building the project..."
cd ResearchScrolls
npm run build

# Move to the dist directory
cd ../dist

# Create a .nojekyll file to prevent GitHub Pages from ignoring files that begin with an underscore
touch .nojekyll

# If you're deploying to a custom domain, uncomment and modify the next line
# echo "yourdomain.com" > CNAME

# Initialize git repository if it doesn't exist
if [ ! -d .git ]; then
  git init
  git checkout -b gh-pages
  git remote add origin git@github.com:yourusername/research-scrolls.git
else
  git checkout gh-pages
fi

# Add all files
git add .

# Commit changes
git commit -m "Deploy to GitHub Pages"

# Push to GitHub
echo "Pushing to GitHub Pages..."
git push -f origin gh-pages

echo "Deployment complete!" 