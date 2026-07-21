#!/bin/bash
# Copy pSEO pages (vs/, for/, glossary/, faq/, learn/, alternatives-to/) into dist/ after prerender.
set -e
for dir in vs for glossary faq learn alternatives-to pricing-questions integrations templates weekly-reports best how-to use-cases guides scenarios redflags cost-of checklists free; do
  if [ -d "$dir" ]; then
    mkdir -p "dist/$dir"
    # Copy flat .html files
    find "$dir" -maxdepth 1 -name "*.html" -exec cp {} "dist/$dir/" \; 2>/dev/null || true
    # Remove pSEO flat files that have rich React prerender equivalents,
    # so cleanUrls doesn't serve the 7KB thin version over the 69KB React page.
    # These 5 trade pages each have a TradePage.tsx SSR prerender.
    if [ "$dir" = "for" ]; then
      rm -f dist/for/electricians.html dist/for/plumbers.html dist/for/hvac-contractors.html \
            dist/for/roofers.html dist/for/general-contractors.html
    fi
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
# Copy the embeddable widget farm (portfolio-network + tool widgets) so the
# authority backlink mesh survives every redeploy — Vite's prerender step
# does not carry /embed/* into dist/ on its own.
if [ -d "embed" ]; then
  mkdir -p "dist/embed/tools"
  cp -R embed/. dist/embed/
fi
echo "Copied voicelogpro pSEO pages into dist/"
