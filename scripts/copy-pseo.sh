#!/bin/bash
# Copy pSEO pages (vs/, for/, glossary/, faq/, learn/, alternatives-to/) into dist/ after prerender.
set -e
for dir in vs for glossary faq learn alternatives-to pricing-questions integrations templates weekly-reports; do
  if [ -d "$dir" ]; then
    mkdir -p "dist/$dir"
    # Copy flat .html files
    find "$dir" -maxdepth 1 -name "*.html" -exec cp {} "dist/$dir/" \; 2>/dev/null || true
    # Copy directory-based index.html as flat .html
    for subdir in "$dir"/*/; do
      [ -d "$subdir" ] || continue
      slug=$(basename "$subdir")
      if [ -f "$subdir/index.html" ]; then
        cp "$subdir/index.html" "dist/$dir/$slug.html"
      fi
    done
  fi
done
echo "Copied voicelogpro pSEO pages into dist/"
