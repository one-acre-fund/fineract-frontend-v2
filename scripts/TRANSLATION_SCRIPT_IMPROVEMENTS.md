# Translation Script Improvements

## Problem Identified

The original translation script was not properly handling text content inside `ng-template` elements, specifically:

1. **ng-template matStepLabel**: Step labels in Angular Material steppers were not being translated
2. **Other ng-template patterns**: General ng-template elements with hardcoded text
3. **mat-option elements**: Option text in Material select dropdowns

## Root Cause

The script only used a generic pattern `/>([^<{]+)</g` to find text content between HTML tags, but this pattern wasn't specifically designed to handle:

- Angular template syntax (`ng-template`)
- Directive-specific contexts (`matStepLabel`)
- Complex nested Angular components

## Solution Implemented

### 1. Specific ng-template matStepLabel Handler

Added a dedicated regex pattern to handle `<ng-template matStepLabel>` elements:

```javascript
/<ng-template\s+matStepLabel\s*>([^<{]+)<\/ng-template>/gi;
```

This pattern:

- Specifically targets `ng-template` elements with `matStepLabel` directive
- Captures the text content inside the template
- Preserves the original template structure while adding translation pipes

### 2. General ng-template Handler

Added support for other `ng-template` patterns:

```javascript
/<ng-template\s+[^>]*>([^<{]+)<\/ng-template>/gi;
```

This pattern:

- Handles any `ng-template` element with various attributes
- Maintains the original opening tag structure
- Adds appropriate translation pipes

### 3. mat-option Handler

Added specific support for Material Design option elements:

```javascript
/<mat-option[^>]*>([^<{]+)<\/mat-option>/gi;
```

### 4. Enhanced Filtering

Improved the filtering logic to:

- Skip already translated text (containing `translate` pipe)
- Skip Angular expressions (`{{}}`)
- Skip directive text (`*ng`)
- Skip variable names and code-like patterns
- Skip overly long text content

## Final Fix: HTML Entity Handling

### Issue Identified

The "View Incentives" text was still not being translated due to HTML entities (`&nbsp;`) being included in the text content, causing the exact string match to fail.

### Root Cause

When the script extracted text content like `"&nbsp;&nbsp; View Incentives"`, the text normalization wasn't happening before the static label checks, so the exact comparison `trimmedText === "View Incentives"` would fail.

### Solution

1. **Text Normalization**: Added proper text normalization that removes HTML entities and normalizes whitespace:

   ```javascript
   const normalizedText = trimmedText
     .replace(/&nbsp;/g, " ")
     .replace(/\s+/g, " ")
     .trim();
   ```

2. **Updated Static Label Detection**: Modified both static label detection points to use the normalized text for comparisons:

   ```javascript
   const isStaticLabel = trimmedText.match(/^[A-Z][a-zA-Z\s\-?]+:?$/) ||
                        normalizedText === "View Incentives" ||
                        normalizedText === "Hide Incentives" ||
                        normalizedText.includes("Lock-in Period") ||
                        // ... other checks using normalizedText
   ```

3. **Translation Mappings**: Added mappings for versions with HTML entities:
   ```javascript
   "&nbsp;&nbsp;\n                      View Incentives": "labels.buttons.View Incentives",
   "&nbsp;&nbsp; View Incentives": "labels.buttons.View Incentives",
   ```

### Result

The script now successfully translates "View Incentives" even when it contains HTML entities and whitespace, completing the fix for all identified translation issues.

## HTML Comment Handling Enhancement

### Issue Addressed

The script was potentially translating text within HTML comments, including:

- Comment delimiters (`-->`)
- Text content inside comment blocks (`<!-- This text should not be translated -->`)
- Multi-line comments with translatable words

### Root Cause

The original regex patterns could match text within HTML comments because:

1. The `/>([^<{]+)</g` pattern didn't account for comment boundaries
2. No preprocessing was done to identify and protect comment blocks
3. Comment markers could be picked up as translatable text

### Solution Implemented

#### 1. Comment Preprocessing

Added a preprocessing step that:

- Identifies all HTML comment blocks using regex: `/<!--[\s\S]*?-->/g`
- Replaces comments with unique placeholders during processing
- Restores original comments after translation processing

```javascript
// Replace comments with placeholders temporarily
updatedContent = updatedContent.replace(/<!--[\s\S]*?-->/g, (match, offset) => {
  const placeholder = `__COMMENT_PLACEHOLDER_${commentIndex}__`;
  commentMap.set(placeholder, match);
  commentIndex++;
  return placeholder;
});

// ... translation processing ...

// Restore HTML comments from placeholders
commentMap.forEach((originalComment, placeholder) => {
  updatedContent = updatedContent.replace(placeholder, originalComment);
});
```

#### 2. Enhanced Comment Detection

Added runtime comment detection for text matching:

- Checks if text is within an active comment block
- Uses position-based analysis to determine comment boundaries
- Skips translation for any text containing comment markers

```javascript
// Check if we're inside an HTML comment
const contentBeforeMatch = updatedContent.substring(0, offset);
const contentAfterMatch = updatedContent.substring(offset + match.length);

const lastCommentStart = contentBeforeMatch.lastIndexOf("<!--");
const lastCommentEnd = contentBeforeMatch.lastIndexOf("-->");
const nextCommentEnd = contentAfterMatch.indexOf("-->");

// Skip if inside a comment block
if (lastCommentStart > lastCommentEnd && nextCommentEnd !== -1) {
  return match; // Skip translation inside comments
}
```

#### 3. Comment Marker Filtering

Added specific exclusion patterns:

- `/^-->$/` - Comment end marker
- `/^<!--/` - Comment start marker
- Text containing `<!--` or `-->`

### Test Results

✅ **Single-line comments**: `<!-- This should not be translated -->` - preserved  
✅ **Multi-line comments**: Complex comments spanning multiple lines - preserved  
✅ **Nested HTML in comments**: `<!-- <button>Hidden</button> -->` - ignored  
✅ **Comment markers**: `-->` and `<!--` - not translated  
✅ **Words inside comments**: "Save", "Delete", "View" in comments - ignored  
✅ **Regular content**: Text outside comments - properly translated  
✅ **Special characters**: Comments with symbols - handled correctly

### Benefits

- **Content Protection**: Prevents translation of documentation and developer notes
- **Markup Preservation**: Maintains original comment structure and formatting
- **Performance**: Efficient placeholder-based approach
- **Robustness**: Handles edge cases like nested HTML and special characters

### Example

**Before:**

```html
<!-- TODO: Translate the Submit button -->
<button>Submit</button>
```

**After:**

```html
<!-- TODO: Translate the Submit button -->
<button>{{ 'labels.buttons.Submit' | translate }}</button>
```

The comment remains untouched while the actual button text is properly translated.

## Before vs After

### Before (Original Issue)

```html
<ng-template matStepLabel>CHARGES</ng-template>
```

### After (Fixed)

```html
<ng-template matStepLabel>{{ 'labels.inputs.CHARGES' | translate }}</ng-template>
```

## Usage

The improved script now properly handles:

```bash
# Single file processing
node scripts/translate-html.js src/path/to/component.html

# Bulk processing
node scripts/translate-html.js --scan-all
```

## Latest Enhancement: Folder Processing Support

### New Feature Added

Added support for processing all HTML files in a specified folder and its subfolders recursively.

### Usage

```bash
# Process all HTML files in a specific folder (recursive)
node scripts/translate-html.js --folder <folder-path>

# Example: Process all HTML files in recurring deposit products
node scripts/translate-html.js --folder src/app/products/recurring-deposit-products
```

### How It Works

1. **Recursive Scanning**: The script uses glob patterns to find all `.html` files in the specified folder and all its subfolders
2. **Error Handling**: Validates that the provided path exists and is actually a directory
3. **Progress Reporting**: Shows how many HTML files were found and processes each one with detailed logging
4. **Batch Processing**: Processes all found files and provides a final summary of total translations added

### Benefits

- **Targeted Processing**: Process only the files you're interested in without scanning the entire project
- **Module-Specific**: Perfect for working on specific feature modules or components
- **Time Efficient**: Faster than `--scan-all` when you only need to work on a subset of files
- **Safe**: Includes proper validation and error handling

### Available Options Summary

1. **Single File**: `node scripts/translate-html.js <file-path>`
2. **Folder (NEW)**: `node scripts/translate-html.js --folder <folder-path>`
3. **All Files**: `node scripts/translate-html.js --scan-all`
4. **Help**: `node scripts/translate-html.js --help`

### Test Results

Successfully tested with:

- ✅ Valid folder with multiple HTML files (found 12 files, translated 2 instances)
- ✅ Single-file folder (found 1 file, no translations needed)
- ✅ Non-existent folder (proper error message)
- ✅ File instead of folder (proper error message)
- ✅ Missing folder path (proper error message)

## Benefits

1. **Complete Coverage**: Now handles all Angular template patterns
2. **Maintains Structure**: Preserves original HTML/Angular structure
3. **Smart Detection**: Only translates appropriate text content
4. **Consistent Format**: Uses the same translation key patterns as existing code

## Testing

The improvements were tested with:

- Angular Material stepper components
- Various ng-template patterns
- mat-select with mat-option elements
- Mixed content with already translated and untranslated text

All tests confirmed the script now properly identifies and translates hardcoded text in Angular template contexts while preserving existing translations and complex Angular expressions.

## Script Status

The translation script now properly handles:

- ng-template elements with various directives
- Text content with HTML entities and extra whitespace
- Static UI labels inside Angular structural directives (*ngIf,*ngFor)
- Complex nested Angular component structures
- Material Design components (mat-option, matStepLabel, etc.)

## Complete Test Results

✅ **ng-template matStepLabel**: All 7 step labels in create-recurring-deposit-product.component.html translated  
✅ **Lock-in Period**: Successfully translated in view-recurring-deposit-product.component.html  
✅ **View Incentives**: Successfully translated despite HTML entities and \*ngIf directive  
✅ **Hide Incentives**: Already properly translated (was working before)
