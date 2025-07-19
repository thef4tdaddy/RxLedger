# PWA Icons Guide for RxLedger

## Overview
This guide explains where to place PWA icons and what sizes are needed for RxLedger to work properly as a Progressive Web App.

## Required Icons

### 1. Standard PWA Icons
Place these files in the `public/` directory:

#### Basic Icons
- `pwa-64x64.png` - 64x64 pixels
- `pwa-192x192.png` - 192x192 pixels  
- `pwa-512x512.png` - 512x512 pixels

#### Maskable Icon
- `maskable-icon-512x512.png` - 512x512 pixels
  - Should have a safe zone of 40px (80px diameter) from each edge
  - Used for adaptive icons on Android

### 2. Apple Touch Icons
Place these files in the `public/` directory:

- `apple-touch-icon.png` - 180x180 pixels
- `apple-touch-icon-57x57.png` - 57x57 pixels
- `apple-touch-icon-60x60.png` - 60x60 pixels
- `apple-touch-icon-72x72.png` - 72x72 pixels
- `apple-touch-icon-76x76.png` - 76x76 pixels
- `apple-touch-icon-114x114.png` - 114x114 pixels
- `apple-touch-icon-120x120.png` - 120x120 pixels
- `apple-touch-icon-144x144.png` - 144x144 pixels
- `apple-touch-icon-152x152.png` - 152x152 pixels
- `apple-touch-icon-180x180.png` - 180x180 pixels

### 3. Favicon
- `favicon.ico` - 32x32 pixels (can be multi-resolution)

### 4. Splash Screen Icons (Optional)
For better iOS experience, place these in `public/`:

- `apple-splash-2048-2732.png` - 2048x2732 pixels (iPad Pro 12.9")
- `apple-splash-1668-2224.png` - 1668x2224 pixels (iPad Pro 10.5")
- `apple-splash-1536-2048.png` - 1536x2048 pixels (iPad Pro 9.7")
- `apple-splash-1125-2436.png` - 1125x2436 pixels (iPhone X)
- `apple-splash-828-1792.png` - 828x1792 pixels (iPhone XR)
- `apple-splash-750-1334.png` - 750x1334 pixels (iPhone 8)
- `apple-splash-640-1136.png` - 640x1136 pixels (iPhone 5)

## Icon Design Guidelines

### Colors
- **Primary**: #1B59AE (RxLedger blue)
- **Secondary**: #A3B5AC (RxLedger green)
- **Background**: White or transparent

### Design Requirements
1. **Simple and recognizable**: Use the RxLedger "Rx" logo or pill/medication symbol
2. **High contrast**: Ensure visibility on various backgrounds
3. **Scalable**: Design should work at small sizes (64px) and large sizes (512px)
4. **Consistent branding**: Use RxLedger colors and typography

### Maskable Icon Guidelines
- Use a 512x512 canvas
- Keep important elements within a 432x432 center area (safe zone)
- The outer 40px border may be masked/cropped
- Use a solid background color or gradient
- Ensure the icon works when cropped to different shapes (circle, square, rounded square)

## File Structure
```
public/
├── favicon.ico
├── pwa-64x64.png
├── pwa-192x192.png
├── pwa-512x512.png
├── maskable-icon-512x512.png
├── apple-touch-icon.png
├── apple-touch-icon-57x57.png
├── apple-touch-icon-60x60.png
├── apple-touch-icon-72x72.png
├── apple-touch-icon-76x76.png
├── apple-touch-icon-114x114.png
├── apple-touch-icon-120x120.png
├── apple-touch-icon-144x144.png
├── apple-touch-icon-152x152.png
├── apple-touch-icon-180x180.png
└── [optional splash screens]
```

## Tools for Icon Generation

### Recommended Tools
1. **PWA Builder** (https://www.pwabuilder.com/imageGenerator)
   - Upload one 512x512 source image
   - Generates all required sizes automatically

2. **Real Favicon Generator** (https://realfavicongenerator.net/)
   - Comprehensive favicon and app icon generator
   - Handles all platforms and sizes

3. **App Icon Generator** (https://appicon.co/)
   - Simple drag-and-drop interface
   - Generates iOS, Android, and web icons

### Manual Creation
If creating manually, use:
- **Adobe Illustrator/Photoshop** for vector/raster design
- **Figma** for collaborative design
- **GIMP** for free alternative

## Testing Icons

### Development Testing
1. Run `npm run build` to generate the PWA
2. Serve the built files: `npm run preview`
3. Open Chrome DevTools → Application → Manifest
4. Check that all icons are loading correctly

### Mobile Testing
1. **iOS Safari**: 
   - Add to Home Screen
   - Check icon appearance on home screen
   - Test splash screen (if implemented)

2. **Android Chrome**:
   - Add to Home Screen
   - Check adaptive icon behavior
   - Test maskable icon rendering

### PWA Testing Tools
- **Lighthouse** (Chrome DevTools → Lighthouse → Progressive Web App)
- **PWA Builder** online testing
- **Web.dev** PWA testing tools

## Current Status
The PWA configuration is already set up in `vite.config.js`. You only need to:

1. Create the icon files according to this guide
2. Place them in the `public/` directory
3. Build and test the application

## Icon Checklist
- [ ] pwa-64x64.png
- [ ] pwa-192x192.png  
- [ ] pwa-512x512.png
- [ ] maskable-icon-512x512.png
- [ ] apple-touch-icon.png (180x180)
- [ ] favicon.ico
- [ ] Test on iOS device
- [ ] Test on Android device
- [ ] Verify in Chrome DevTools
- [ ] Run Lighthouse PWA audit

## Notes
- All icons should be optimized for web (compressed but high quality)
- Use PNG format for colored icons, ICO for favicon
- Ensure accessibility (sufficient contrast)
- Test on both light and dark system themes
- Consider animated icons for dynamic feel (use sparingly)

## Support
If you need help with icon creation or have questions about PWA implementation, refer to:
- [PWA Icon Guidelines](https://web.dev/add-manifest/)
- [Apple Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/ios/icons-and-images/app-icon/)
- [Android Adaptive Icons](https://developer.android.com/guide/practices/ui_guidelines/icon_design_adaptive)