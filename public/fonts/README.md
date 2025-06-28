# Font Files Setup

## FuturaPT-Book Font

To complete the font setup, please add the following FuturaPT-Book font files to this directory:

- `FuturaPT-Book.woff2` (Web Open Font Format 2.0 - preferred)
- `FuturaPT-Book.woff` (Web Open Font Format - fallback)
- `FuturaPT-Book.ttf` (TrueType Font - fallback)

### Font Sources

You can obtain the FuturaPT-Book font from:
1. Your font license provider
2. Adobe Fonts (if you have a subscription)
3. Purchase from a font foundry

### Alternative Setup

If you don't have access to FuturaPT-Book, you can:

1. Use a similar font like Futura or Arial
2. Update the font-family declarations in `src/app/globals.css`
3. Update the Tailwind config in `tailwind.config.js`

### Current Configuration

The website is currently configured to use FuturaPT-Book for ALL text elements with:
- Font family: 'FuturaPT-Book', Arial, Helvetica, sans-serif
- Color: #000 (black)
- Applied consistently across all pages and all text elements including:
  - Headings (h1, h2, h3, h4, h5, h6)
  - Paragraphs (p)
  - Lists (li, ul, ol)
  - Blockquotes (blockquote)
  - Links (a)
  - Form elements (input, textarea, select, button, label)
  - Table elements (th, td, caption)
  - And all other text elements 