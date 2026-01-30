# Image Crop and Delayed Upload Feature

## Overview
Enhanced the create post dialog with image cropping functionality and delayed upload. Images are now stored locally until the user clicks the "Post" button, at which point they are uploaded to the backend.

## Key Features

### 1. Delayed Upload
- Images are stored locally with preview URLs when selected
- Files are only uploaded to the backend when the user clicks "Post Now" or "Schedule Post"
- Provides better user experience with faster initial file selection

### 2. Image Cropping with Auto-Selection
- Added crop functionality for all image files
- Uses `react-image-crop` library for smooth cropping experience
- **Auto-selects crop area**: Automatically selects a crop area when image loads and when aspect ratios change
- **No manual selection needed**: Users can immediately apply crop without manually selecting an area
- Provides aspect ratio presets:
  - **Free crop**: No aspect ratio constraint
  - **Square (1:1)**: Perfect square crop
  - **Portrait (4:5)**: Instagram-friendly portrait
  - **Landscape (5:4)**: Landscape orientation
  - **Story (9:16)**: Vertical story format
  - **Wide (16:9)**: Widescreen format

### 3. Visual Indicators
- Crop icon appears on images that have been cropped
- Warning indicators for images with invalid aspect ratios
- Upload status indicator showing files are ready for upload
- Rule of thirds grid for better crop composition

## Technical Implementation

### Auto-Selection Features
- **Initial Auto-Selection**: When image loads, automatically selects 90% of the image area
- **Aspect Ratio Auto-Selection**: When changing aspect ratios, automatically calculates and selects optimal crop area
- **Immediate Availability**: Crop selection is immediately available for applying without user interaction

### Fixed Issues
- **Aspect Ratio Presets**: Fixed the crop functionality so all presets work correctly
- **Crop State Management**: Properly manages crop dimensions and aspect ratios
- **Dynamic Crop Calculation**: Automatically calculates optimal crop dimensions based on selected aspect ratio
- **Auto-Selection**: Eliminates the need for manual crop area selection

### Components Added
- `ImageCropDialog`: Modal dialog for cropping images with working aspect ratio presets and auto-selection
- `getCroppedImg`: Helper function to generate cropped image blob
- `handleAspectRatioChange`: Function to dynamically adjust crop area based on aspect ratio with auto-selection

### State Management
- `localMediaFiles`: Array storing local file objects with preview URLs
- `cropDialogOpen`: Boolean for crop dialog visibility
- `currentCropImage`: Currently selected image for cropping
- `currentAspect`: Currently selected aspect ratio for proper UI feedback
- `completedCrop`: Auto-populated crop selection for immediate use

### Auto-Selection Logic
```javascript
// Initial crop on image load (90% of image, centered)
const initialCrop = {
  unit: 'px',
  width: width * 0.9,
  height: height * 0.9,
  x: width * 0.05,
  y: height * 0.05
}

// Auto-set both crop and completedCrop
setCrop(initialCrop)
setCompletedCrop(initialCrop)
```

## Benefits
- **Better UX**: Faster file selection and preview with auto-selection
- **No Manual Work**: Users don't need to manually select crop areas
- **Working Aspect Ratios**: All preset ratios now function correctly with auto-selection
- **Image Quality**: Users can crop images to meet platform requirements instantly
- **Reduced Server Load**: Files only uploaded when actually needed
- **Error Prevention**: Aspect ratio validation with crop option to fix issues
- **Immediate Use**: Crop areas are pre-selected and ready to apply

## Usage
1. Select images using the file picker
2. Click the crop icon on any image to open the crop dialog
3. **Crop area is automatically selected** - no manual selection needed
4. Choose any aspect ratio preset (automatically adjusts crop area) or use free crop
5. Apply crop to update the image (crop area is already selected)
6. Click "Post Now" to upload and publish

## Browser Compatibility
- Requires modern browsers with support for:
  - File API
  - Canvas API
  - Blob URLs
  - Object URLs
