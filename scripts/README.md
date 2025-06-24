# HTML Translation Scripts

This directory contains scripts for automatically translating hardcoded English text in HTML files to use Angular's i18n translation system with the `translate` pipe.

## Files

- `translate-html.js` - Main translation script
- `translate-config.json` - Configuration file with predefined mappings
- `README.md` - This documentation file

## Usage

### Translate a Single File

```bash
npm run translate:html src/app/products/loan-products/loan-product-stepper/loan-product-details-step/loan-product-details-step.component.html
```

Or directly with Node.js:

```bash
node scripts/translate-html.js src/app/products/loan-products/loan-product-stepper/loan-product-details-step/loan-product-details-step.component.html
```

### Translate All HTML Files

```bash
npm run translate:html:all
```

Or directly with Node.js:

```bash
node scripts/translate-html.js --scan-all
```

### Help

```bash
node scripts/translate-html.js --help
```

## What the Script Does

1. **Scans HTML files** for hardcoded English text
2. **Maps text to translation keys** using existing translations from `en-US.json` and `fr-FR.json`
3. **Replaces hardcoded text** with Angular translation pipes like `{{ 'labels.buttons.Next' | translate }}`
4. **Adds new translations** to both English and French translation files when needed
5. **Updates HTML files** with the internationalized versions

## Translation Key Structure

The script follows the existing translation hierarchy in the project:

```
labels.
├── oaf.* - Organization-specific labels (OAF = One Acre Fund)
├── inputs.* - Form input field labels
├── buttons.* - Button labels
├── commons.* - Common terms and validation messages
├── heading.* - Section headings
└── menus.* - Menu items
```

## Examples

### Before Translation

```html
<mat-form-field>
  <mat-label>Start Date</mat-label>
  <input matInput formControlName="startDate" />
  <mat-error>Start Date is required</mat-error>
</mat-form-field>

<button mat-raised-button>Previous</button>
```

### After Translation

```html
<mat-form-field>
  <mat-label>{{ 'labels.inputs.Start Date' | translate }}</mat-label>
  <input matInput formControlName="startDate" />
  <mat-error>{{ 'labels.inputs.Start Date' | translate }} {{ 'labels.commons.is' | translate }} {{ 'labels.commons.required' | translate }}</mat-error>
</mat-form-field>

<button mat-raised-button>{{ 'labels.buttons.Previous' | translate }}</button>
```

## Configuration

The script uses `translate-config.json` for:

- **Translation section mappings** - Which texts belong to which translation sections
- **French translations** - Basic French translations for common terms
- **Exclude patterns** - Text patterns to ignore during translation
- **File patterns** - Which files to scan when using `--scan-all`

## Features

### Smart Text Detection

- Detects text content within HTML tags
- Handles placeholder, title, alt, and aria-label attributes
- Ignores Angular bindings and directives
- Skips already translated content

### Automatic Translation Key Generation

- Uses existing translations when available
- Creates new translation keys following the project's naming convention
- Adds translations to both English and French files

### Safe Processing

- Preserves HTML structure and formatting
- Handles complex error messages by combining multiple translation keys
- Creates backups implicitly through Git version control

### Comprehensive Coverage

- Processes form labels, buttons, error messages, headings
- Handles both simple text and complex expressions
- Supports various HTML attributes

## Best Practices

1. **Run on clean Git state** - Commit your changes before running the script
2. **Review changes** - Always review the generated translations and HTML changes
3. **Test thoroughly** - Ensure the application still works correctly after translation
4. **Update French translations** - The script provides basic French translations, but you may want to improve them
5. **Run incrementally** - Start with individual files before running on the entire codebase

## Troubleshooting

### Script Fails to Run

- Ensure Node.js is installed
- Run `npm install` to install dependencies
- Check file paths are correct

### Translations Not Applied

- Verify the text isn't already using translation pipes
- Check if the text contains Angular bindings
- Ensure the text is actually visible content

### Incorrect Translation Keys

- Review and modify the mappings in `translate-config.json`
- Manually adjust translation keys in the generated files if needed

## Integration with Existing i18n Workflow

This script complements the existing translation extraction workflow:

1. **Extract strings**: `npm run translations:extract` (existing)
2. **Translate HTML**: `npm run translate:html:all` (new)
3. **Manual review**: Review and adjust generated translations
4. **Test application**: Ensure everything works correctly

## Contributing

When adding new translation mappings:

1. Update `translate-config.json` with new text patterns
2. Add corresponding French translations
3. Test the mappings with sample HTML files
4. Update this documentation if needed

## Examples from the Project

The script was developed based on the successful translation of:
`src/app/products/loan-products/loan-product-stepper/loan-product-details-step/loan-product-details-step.component.html`

This file demonstrates the complete workflow and serves as a reference for the expected output quality.
