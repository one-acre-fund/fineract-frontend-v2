#!/usr/bin/env node

console.log("🔥 Script loaded successfully");

/**
 * HTML Translation Script for Fineract Frontend v2
 *
 * This script automatically translates hardcoded English text in HTML files
 * by replacing them with Angular translation keys using the translate pipe.
 *
 * Usage:
 *   node scripts/translate-html.js <file-path>
 *   node scripts/translate-html.js --folder <folder-path>
 *   node scripts/translate-html.js --scan-all
 *   node scripts/translate-html.js --help
 *
 * Examples:
 *   node scripts/translate-html.js src/app/products/loan-products/loan-product-stepper/loan-product-details-step/loan-product-details-step.component.html
 *   node scripts/translate-html.js --folder src/app/products/recurring-deposit-products
 *   node scripts/translate-html.js --scan-all
 */

const fs = require("fs");
const path = require("path");

// Load translation files
const loadTranslations = () => {
  try {
    const enPath = path.join(__dirname, "../src/assets/translations/en-US.json");
    const frPath = path.join(__dirname, "../src/assets/translations/fr-FR.json");

    const enTranslations = JSON.parse(fs.readFileSync(enPath, "utf8"));
    const frTranslations = JSON.parse(fs.readFileSync(frPath, "utf8"));

    return { enTranslations, frTranslations };
  } catch (error) {
    console.error("Error loading translation files:", error.message);
    process.exit(1);
  }
};

// Common translation mappings based on existing structure
const getTranslationMappings = () => {
  return {
    // Form fields and inputs - using actual keys from en-US.json
    "Start Date": "labels.inputs.Start Date",
    "Close Date": "labels.inputs.Close Date",
    Description: "labels.inputs.Description",
    "Product Name": "labels.oaf.Product Name",
    "Short Name": "labels.oaf.Short Name",
    "Loan Type": "labels.oaf.Loan Type",
    Country: "labels.oaf.Country",
    "Organization Units": "labels.oaf.Organization Units",
    "Organization Units:": "labels.oaf.Organization Units",
    "Fund Name": "labels.oaf.Fund Name",
    "Fund Name:": "labels.oaf.Fund Name",
    "Applicable Apps": "labels.oaf.Applicable Apps",
    "Applicable Apps:": "labels.oaf.Applicable Apps",
    "Is Linked to floating interest rates": "labels.inputs.Is Linked to floating interest rates",
    "Is Linked to floating interest rates?": "labels.inputs.Is Linked to floating interest rates",
    "Account Number": "labels.inputs.accountNumber",
    "Account Name": "labels.inputs.Account Name",
    Email: "labels.inputs.Email",
    Password: "labels.inputs.Password",
    Username: "labels.inputs.Username",
    "First Name": "labels.inputs.First Name",
    "Last Name": "labels.inputs.Last Name",
    "Mobile No": "labels.inputs.mobileNo",
    "Date of Birth": "labels.inputs.DOB",
    Address: "labels.inputs.Address",
    City: "labels.inputs.City",
    State: "labels.inputs.State / Province",
    "Postal Code": "labels.inputs.Postal Code",
    Amount: "labels.inputs.Amount",
    "Interest Rate": "labels.inputs.Interest Rate",
    Status: "labels.inputs.Status",
    Office: "labels.inputs.Office",
    Staff: "labels.inputs.Staff",
    Currency: "labels.inputs.Currency",
    Name: "labels.inputs.Name",
    "Group Name": "labels.inputs.Group Name",
    Code: "labels.inputs.Code",
    Type: "labels.inputs.Type",
    Category: "labels.inputs.Category",
    Active: "labels.inputs.Active",
    "Activation Date": "labels.inputs.Activation Date",
    "Submitted On": "labels.inputs.Submitted On",
    "Submission Date": "labels.inputs.Submission Date",
    "External Id": "labels.inputs.External Id",
    "External id": "labels.inputs.External Id",
    name: "labels.inputs.Name",
    name: "labels.inputs.Name",
    "Parent Office": "labels.inputs.Parent Office",

    // Buttons
    Previous: "labels.buttons.Previous",
    Next: "labels.buttons.Next",
    Submit: "labels.buttons.Submit",
    Cancel: "labels.buttons.Cancel",
    Save: "labels.buttons.Save",
    Delete: "labels.buttons.Delete",
    Edit: "labels.buttons.Edit",
    View: "labels.buttons.View",
    Add: "labels.buttons.Add",
    Create: "labels.buttons.Create",
    Update: "labels.buttons.Update",
    Approve: "labels.buttons.Approve",
    Reject: "labels.buttons.Reject",
    Close: "labels.buttons.Close",
    Back: "labels.buttons.Back",
    Continue: "labels.buttons.Continue",
    Confirm: "labels.buttons.Confirm",
    Upload: "labels.buttons.Upload",
    Download: "labels.buttons.Download",
    Export: "labels.buttons.Export",
    Import: "labels.buttons.Import",
    Reset: "labels.buttons.Reset",
    Search: "labels.buttons.Search",
    Filter: "labels.buttons.Filter",
    Clear: "labels.buttons.Clear",
    Apply: "labels.buttons.Apply",
    Remove: "labels.buttons.Remove",
    Select: "labels.buttons.Select",
    Browse: "labels.buttons.Browse",
    Yes: "labels.buttons.Yes",
    No: "labels.buttons.No",

    // Tooltip specific buttons
    "Delete Interest Rate Chart": "labels.buttons.Delete Interest Rate Chart",
    "Delete Tax Component": "labels.buttons.Delete Tax Component",

    // Common text
    required: "labels.commons.required",
    is: "labels.commons.is",
    are: "labels.commons.are",
    "must be": "labels.commons.must be",
    invalid: "labels.commons.invalid",
    Active: "labels.inputs.Active",
    Inactive: "labels.commons.Inactive",
    Pending: "labels.commons.Pending",
    Approved: "labels.commons.Approved",
    Rejected: "labels.commons.Rejected",
    Closed: "labels.commons.Closed",
    Open: "labels.commons.Open",
    All: "labels.commons.All",
    None: "labels.commons.None",
    Total: "labels.commons.Total",
    Balance: "labels.commons.Balance",
    Date: "labels.commons.Date",
    Time: "labels.commons.Time",
    ID: "labels.commons.ID",

    // Menu items
    Dashboard: "labels.menus.Dashboard",
    Clients: "labels.menus.Clients",
    Groups: "labels.menus.Groups",
    Centers: "labels.menus.Centers",
    Loans: "labels.menus.Loans",
    Savings: "labels.menus.Savings",
    Shares: "labels.menus.Shares",
    Accounting: "labels.menus.Accounting",
    Reports: "labels.menus.Reports",
    Products: "labels.menus.Products",
    System: "labels.menus.System",
    Admin: "labels.menus.Admin",
    Settings: "labels.menus.Settings",
    Help: "labels.menus.Help",

    // Headings
    Overview: "labels.heading.Overview",
    Details: "labels.heading.Details",
    Summary: "labels.heading.Summary",
    History: "labels.heading.History",
    Documents: "labels.heading.Documents",
    Notes: "labels.heading.Notes",
    Transactions: "labels.heading.Transactions",
    Charges: "labels.heading.Charges",
    Schedule: "labels.heading.Schedule",
    Configuration: "labels.heading.Configuration",

    // Loan specific
    "Loan Product": "labels.heading.Loan Product",
    "Loan Products": "labels.heading.Loan Products",
    "Loan Application": "labels.heading.Loan Application",
    "Loan Account": "labels.heading.Loan Account",
    Principal: "labels.inputs.Principal",
    Interest: "labels.inputs.Interest",
    Fees: "labels.inputs.Fees",
    Penalties: "labels.inputs.Penalties",
    Term: "labels.inputs.Term",
    Repayment: "labels.inputs.Repayment",
    Disbursement: "labels.inputs.Disbursement",

    // Client specific
    Client: "labels.heading.Client",
    "Client Name": "labels.inputs.Client Name",
    "Client Type": "labels.inputs.Client Type",
    "Legal Form": "labels.inputs.Legal Form",
    Gender: "labels.inputs.Gender",
    "Client Classification": "labels.inputs.Client Classification",

    // Account specific
    Account: "labels.heading.Account",
    "Account Type": "labels.inputs.Account Type",
    "Account No": "labels.inputs.Account No",
    "Opening Date": "labels.inputs.Opening Date",
    "Closing Date": "labels.inputs.Closing Date",

    // Organization specific
    "Office Name": "labels.inputs.Office Name",
    "Opening Date": "labels.inputs.Opening Date",
    "Parent Office": "labels.inputs.Parent Office",
    "External Id": "labels.inputs.External Id",

    // Specific translations that already exist in the translation files
    "View Incentives": "labels.buttons.View Incentives",
    "Hide Incentives": "labels.buttons.Hide Incentives",
    "Lock-in Period": "labels.heading.Lock-in Period",
    "Lock-in Period:": "labels.heading.Lock-in Period",

    // Handle versions with HTML entities
    "&nbsp;&nbsp;\n                      View Incentives": "labels.buttons.View Incentives",
    "&nbsp;&nbsp; View Incentives": "labels.buttons.View Incentives",
  };
};

// Find translation key for a given text
const findTranslationKey = (text, translations) => {
  const mappings = getTranslationMappings();

  // Check for best matching existing key first
  const bestMatch = findBestMatchingKey(text, translations);
  if (bestMatch) {
    return bestMatch;
  }

  // Check direct mappings
  if (mappings[text]) {
    return mappings[text];
  }

  // Try without trailing punctuation if original didn't match
  const cleanedText = text.replace(/[:;,!?]+$/, "").trim();
  if (cleanedText !== text && mappings[cleanedText]) {
    return mappings[cleanedText];
  }

  // Search in translations object
  const searchInObject = (obj, searchText, currentPath = "") => {
    for (const [key, value] of Object.entries(obj)) {
      const newPath = currentPath ? `${currentPath}.${key}` : key;

      if (typeof value === "string" && value === searchText) {
        return newPath;
      } else if (typeof value === "object" && value !== null) {
        const result = searchInObject(value, searchText, newPath);
        if (result) return result;
      }
    }
    return null;
  };

  // Try searching with original text first
  let result = searchInObject(translations, text);
  if (result) return result;

  // Try searching with cleaned text
  if (cleanedText !== text) {
    result = searchInObject(translations, cleanedText);
    if (result) return result;
  }

  // Try common variations
  const variations = [
    text.toLowerCase(),
    text.charAt(0).toUpperCase() + text.slice(1).toLowerCase(),
    text.toUpperCase(),
    text.replace(/\s+/g, " ").trim(),
  ];

  for (const variation of variations) {
    result = searchInObject(translations, variation);
    if (result) return result;
  }

  return null;
};

// Validation function to check if a translation key exists
const validateTranslationKey = (key, enTranslations) => {
  const keyPath = key.split(".");
  let obj = enTranslations;

  for (const part of keyPath) {
    if (obj && obj[part]) {
      obj = obj[part];
    } else {
      return false;
    }
  }

  return typeof obj === "string";
};

// Find the best matching existing key for a text
const findBestMatchingKey = (text, enTranslations) => {
  // Common mappings for problematic cases
  const fixedMappings = {
    name: "labels.inputs.Name",
    cannot: "labels.commons.cannot",
    Name: "labels.inputs.Name",
    Cannot: "labels.commons.cannot",
  };

  if (fixedMappings[text]) {
    const key = fixedMappings[text];
    if (validateTranslationKey(key, enTranslations)) {
      return key;
    }
  }

  return null;
};

// Add new translation if it doesn't exist
const addTranslationIfNeeded = (text, enTranslations, frTranslations) => {
  // First try to find an existing key
  const existingKey = findTranslationKey(text, enTranslations);
  if (existingKey) return existingKey;

  // Check for best matching existing key
  const bestMatch = findBestMatchingKey(text, enTranslations);
  if (bestMatch) {
    return bestMatch;
  }

  // Determine appropriate section based on context and content
  let section = "commons"; // Default to commons section

  // Button text patterns
  if (
    [
      "Previous",
      "Next",
      "Submit",
      "Cancel",
      "Save",
      "Delete",
      "Edit",
      "View",
      "Add",
      "Create",
      "Update",
      "Approve",
      "Reject",
      "Close",
      "Back",
      "Continue",
      "Confirm",
      "Remove",
      "Select",
      "Browse",
      "Yes",
      "No",
      "OK",
      "Apply",
      "Reset",
      "Clear",
      "Search",
      "Filter",
      "Export",
      "Import",
      "Download",
      "Upload",
      "Print",
      "Refresh",
      "Load More",
    ].includes(text)
  ) {
    section = "buttons";
  }
  // Input/form field labels - use proper capitalization
  else if (
    [
      "Start Date",
      "End Date",
      "Close Date",
      "Description",
      "Account Number",
      "Email",
      "Password",
      "Username",
      "Name",
      "First Name",
      "Last Name",
      "Phone",
      "Address",
      "Date of Birth",
      "Gender",
      "Type",
      "Status",
      "Amount",
      "Balance",
      "Notes",
      "External Id",
      "External id",
      "Reference",
      "Office",
      "Staff",
      "Active",
      "Activation Date",
      "Submitted On",
      "Submission Date",
      "Group Name",
    ].includes(text) ||
    // Common input patterns
    text.includes("Date") ||
    text.includes("Name") ||
    text.includes("Number") ||
    text.includes("Code") ||
    text.includes("Amount")
  ) {
    section = "inputs";
  }
  // Navigation and menu items
  else if (
    [
      "Dashboard",
      "Clients",
      "Groups",
      "Centers",
      "Loans",
      "Savings",
      "Shares",
      "Accounting",
      "Reports",
      "Products",
      "System",
      "Admin",
      "Settings",
      "Help",
      "Home",
      "Profile",
      "Logout",
      "Login",
    ].includes(text)
  ) {
    section = "menus";
  }
  // Page headings and titles
  else if (
    [
      "Overview",
      "Details",
      "Summary",
      "History",
      "Documents",
      "Notes",
      "Transactions",
      "Charges",
      "Schedule",
      "Configuration",
      "Client",
      "Loan Product",
      "Account",
    ].includes(text)
  ) {
    section = "heading";
  }
  // Links and external references
  else if (
    [
      "Resources",
      "Community",
      "Contribute",
      "User Manual",
      "Developer Zone",
      "User Group",
      "Developer Group",
      "Documentation",
      "Support",
      "Contact",
    ].includes(text)
  ) {
    section = "links";
  }
  // Common validation and status text - keep these in commons
  else if (
    [
      "required",
      "is",
      "are",
      "must be",
      "invalid",
      "cannot",
      "begin with a special character or number",
      "Pending",
      "Approved",
      "Rejected",
      "Closed",
      "Open",
      "All",
      "None",
      "Total",
      "Error",
      "Success",
      "Warning",
      "Info",
    ].includes(text) ||
    text.includes("required") ||
    text.includes("invalid") ||
    text.includes("must") ||
    text.includes("cannot") ||
    text.includes("error") ||
    text.includes("validation")
  ) {
    section = "commons";
  }

  // Normalize the text for the key - handle special cases
  let normalizedText = text;

  // Handle lowercase variations that should be capitalized
  if (text === "name" && section === "inputs") {
    normalizedText = "Name";
  }

  const newKey = `labels.${section}.${normalizedText}`;

  // Add to English translations
  if (!enTranslations.labels) enTranslations.labels = {};
  if (!enTranslations.labels[section]) enTranslations.labels[section] = {};
  enTranslations.labels[section][normalizedText] = normalizedText;

  // Add to French translations (basic translation - should be improved)
  if (!frTranslations.labels) frTranslations.labels = {};
  if (!frTranslations.labels[section]) frTranslations.labels[section] = {};

  // Enhanced French translations for common terms
  const frenchTranslations = {
    // Buttons
    Previous: "Précédent",
    Next: "Suivant",
    Submit: "Soumettre",
    Cancel: "Annuler",
    Save: "Sauvegarder",
    Delete: "Supprimer",
    Edit: "Modifier",
    View: "Voir",
    Add: "Ajouter",
    Create: "Créer",
    Update: "Mettre à jour",
    Approve: "Approuver",
    Reject: "Rejeter",
    Close: "Fermer",
    Back: "Retour",
    Continue: "Continuer",
    Confirm: "Confirmer",
    Remove: "Supprimer",
    Select: "Sélectionner",
    Browse: "Parcourir",
    Yes: "Oui",
    No: "Non",
    OK: "OK",
    Apply: "Appliquer",
    Reset: "Réinitialiser",
    Clear: "Effacer",
    Search: "Rechercher",
    Filter: "Filtrer",

    // Common terms
    required: "requis",
    is: "est",
    are: "sont",
    cannot: "ne peut pas",
    "begin with a special character or number": "commencer par un caractère spécial ou un chiffre",
    Active: "Actif",
    Inactive: "Inactif",
    Pending: "En attente",
    Approved: "Approuvé",
    Rejected: "Rejeté",
    Closed: "Fermé",
    Open: "Ouvert",
    All: "Tous",
    None: "Aucun",
    Total: "Total",
    Balance: "Solde",
    Date: "Date",
    Time: "Heure",

    // Input labels
    "Start Date": "Date de début",
    "End Date": "Date de fin",
    "Close Date": "Date de fermeture",
    Description: "Description",
    "Account Number": "Numéro de compte",
    Email: "Email",
    Password: "Mot de passe",
    Username: "Nom d'utilisateur",
    Name: "Nom",
    "Group Name": "Nom du groupe",
    "First Name": "Prénom",
    "Last Name": "Nom de famille",
    Phone: "Téléphone",
    Address: "Adresse",
    Office: "Bureau",
    Staff: "Personnel",
    "Activation Date": "Date d'activation",
    "Submitted On": "Soumis le",
    "Submission Date": "Date de soumission",
    "External Id": "ID externe",
    "External id": "ID externe",

    // Menus
    Dashboard: "Tableau de bord",
    Clients: "Clients",
    Groups: "Groupes",
    Loans: "Prêts",
    Savings: "Épargne",
    Reports: "Rapports",
    Products: "Produits",
    System: "Système",
    Admin: "Admin",
    Settings: "Paramètres",
    Help: "Aide",
    Home: "Accueil",
    Profile: "Profil",
    Logout: "Déconnexion",
    Login: "Connexion",

    // Headings
    Overview: "Aperçu",
    Details: "Détails",
    Summary: "Résumé",
    History: "Historique",
    Documents: "Documents",
    Notes: "Notes",
    Transactions: "Transactions",
    Configuration: "Configuration",

    // Links
    Resources: "Ressources",
    Community: "Communauté",
    Contribute: "Contribuer",
    "User Manual": "Manuel utilisateur",
    "Developer Zone": "Zone développeur",
    "User Group": "Groupe utilisateur",
    "Developer Group": "Groupe développeur",
    Documentation: "Documentation",
    Support: "Support",
    Contact: "Contact",
  };

  frTranslations.labels[section][normalizedText] = frenchTranslations[normalizedText] || normalizedText;

  return newKey;
};

// Extract text content from HTML elements
const extractTextContent = (htmlContent) => {
  const textPatterns = [
    // Text within HTML tags (avoiding Angular bindings)
    />([^<{]+)</g,
    // Placeholder attributes
    /placeholder\s*=\s*["']([^"']+)["']/gi,
    // Title attributes
    /title\s*=\s*["']([^"']+)["']/gi,
    // Alt attributes
    /alt\s*=\s*["']([^"']+)["']/gi,
    // aria-label attributes
    /aria-label\s*=\s*["']([^"']+)["']/gi,
    // matTooltip attributes
    /matTooltip\s*=\s*["']([^"']+)["']/gi,
  ];

  const foundTexts = new Set();

  // Exclude patterns for text that shouldn't be translated
  const excludePatterns = [
    /^[\s\n\r]*$/, // Whitespace only
    /^\d+$/, // Numbers only
    /^[.,;:!?()[\]{}'"]+$/, // Punctuation only
    /^http[s]?:\/\//i, // URLs
    /^mailto:/i, // Email links
    /^\w+\([^)]*\)$/, // Function calls
    /^[a-z]+(-[a-z]+)*$/i, // CSS classes or IDs
    /^\$\w+/, // Variables starting with $
    /^<!--.*-->$/s, // HTML comments
    /^\{\{.*\}\}$/, // Angular expressions
    /^[A-Z_][A-Z0-9_]*$/, // Constants (all caps)
    /\s*\n\s*/, // Text with line breaks (likely long content)
    /^-->$/, // Comment end marker
    /^<!--/, // Comment start marker
  ];

  // Angular directive patterns to exclude
  const angularDirectivePatterns = [
    /\*ngIf\s*=\s*["']([^"']+)["']/gi,
    /\*ngFor\s*=\s*["']([^"']+)["']/gi,
    /\*ngSwitch\s*=\s*["']([^"']+)["']/gi,
    /\*ngSwitchCase\s*=\s*["']([^"']+)["']/gi,
    /\[ngClass\]\s*=\s*["']([^"']+)["']/gi,
    /\[ngStyle\]\s*=\s*["']([^"']+)["']/gi,
    /\(click\)\s*=\s*["']([^"']+)["']/gi,
    /\(change\)\s*=\s*["']([^"']+)["']/gi,
  ];

  // Remove Angular directive content before processing
  let cleanedContent = htmlContent;
  angularDirectivePatterns.forEach((pattern) => {
    cleanedContent = cleanedContent.replace(pattern, "");
  });

  textPatterns.forEach((pattern) => {
    let match;
    while ((match = pattern.exec(cleanedContent)) !== null) {
      const text = match[1].trim();

      // Basic filters
      if (!text || text.length < 2 || text.length > 100) {
        continue;
      }

      // Skip Angular directives and bindings
      if (
        text.includes("{{") ||
        text.includes("*ngFor") ||
        text.includes("*ngIf") ||
        text.includes("translate") ||
        text.includes("|") ||
        text.includes("*ng")
      ) {
        continue;
      }

      // Skip if matches exclude patterns
      const shouldExclude = excludePatterns.some((pattern) => pattern.test(text));
      if (shouldExclude) {
        continue;
      }

      // Skip very long descriptive text (likely paragraphs)
      const words = text.split(/\s+/);
      if (words.length > 10) {
        continue;
      }

      // Skip if it contains HTML entities, whitespace-only content, or special characters
      if (
        text.includes("&nbsp;") ||
        text.includes("&amp;") ||
        text.includes("&lt;") ||
        text.includes("&gt;") ||
        text.includes("&quot;") ||
        (text.match(/&\w+;/g) || []).length > text.length / 10 ||
        text.match(/^\s*$/) ||
        text.match(/^[\s&;]*$/)
      ) {
        continue;
      }

      foundTexts.add(text);
    }
  });

  return Array.from(foundTexts);
};

// Replace text in HTML with translation pipes
const replaceTextWithTranslations = (htmlContent, translations) => {
  let updatedContent = htmlContent;
  const { enTranslations, frTranslations } = translations;
  const addedTranslations = [];

  // Create a map of comment positions to preserve them during processing
  const commentMap = new Map();
  let commentIndex = 0;

  // Replace comments with placeholders temporarily to avoid translating them
  updatedContent = updatedContent.replace(/<!--[\s\S]*?-->/g, (match, offset) => {
    const placeholder = `__COMMENT_PLACEHOLDER_${commentIndex}__`;
    commentMap.set(placeholder, match);
    commentIndex++;
    return placeholder;
  });

  // Handle ng-template matStepLabel elements specifically
  updatedContent = updatedContent.replace(/<ng-template\s+matStepLabel\s*>([^<{]+)<\/ng-template>/gi, (match, text) => {
    const trimmedText = text.trim();

    // Skip if already translated or contains Angular expressions
    if (!trimmedText || trimmedText.includes("{{") || trimmedText.includes("translate") || trimmedText.includes("|")) {
      return match;
    }

    // Skip if it's a very short text or too long
    if (trimmedText.length < 2 || trimmedText.length > 100) {
      return match;
    }

    // Clean up trailing punctuation for translation key generation
    const cleanedText = trimmedText.replace(/[:;,!?]+$/, "").trim();

    // Find or create translation key
    let key = findTranslationKey(cleanedText, enTranslations);
    if (!key) {
      key = findTranslationKey(trimmedText, enTranslations);
    }
    if (!key) {
      key = addTranslationIfNeeded(cleanedText, enTranslations, frTranslations);
    }

    if (key) {
      addedTranslations.push({ text: trimmedText, key, cleanedText });
      return `<ng-template matStepLabel>{{ '${key}' | translate }}</ng-template>`;
    }

    return match;
  });

  // Handle other common ng-template patterns
  updatedContent = updatedContent.replace(/<ng-template\s+[^>]*>([^<{]+)<\/ng-template>/gi, (match, text) => {
    const trimmedText = text.trim();

    // Skip if already translated or contains Angular expressions
    if (
      !trimmedText ||
      trimmedText.includes("{{") ||
      trimmedText.includes("translate") ||
      trimmedText.includes("|") ||
      trimmedText.includes("*ng")
    ) {
      return match;
    }

    // Skip if it's a very short text or too long
    if (trimmedText.length < 2 || trimmedText.length > 100) {
      return match;
    }

    // Skip if it looks like a variable name or code
    if (trimmedText.match(/^[a-zA-Z_][a-zA-Z0-9_]*$/) || trimmedText.includes("()")) {
      return match;
    }

    // Clean up trailing punctuation for translation key generation
    const cleanedText = trimmedText.replace(/[:;,!?]+$/, "").trim();

    // Find or create translation key
    let key = findTranslationKey(cleanedText, enTranslations);
    if (!key) {
      key = findTranslationKey(trimmedText, enTranslations);
    }
    if (!key) {
      key = addTranslationIfNeeded(cleanedText, enTranslations, frTranslations);
    }

    if (key) {
      addedTranslations.push({ text: trimmedText, key, cleanedText });
      // Extract the opening tag attributes to preserve them
      const openingTag = match.match(/<ng-template[^>]*>/i)[0];
      return `${openingTag}{{ '${key}' | translate }}</ng-template>`;
    }

    return match;
  });

  // Handle mat-option elements
  updatedContent = updatedContent.replace(/<mat-option[^>]*>([^<{]+)<\/mat-option>/gi, (match, text) => {
    const trimmedText = text.trim();

    // Skip if already translated or contains Angular expressions
    if (!trimmedText || trimmedText.includes("{{") || trimmedText.includes("translate") || trimmedText.includes("|")) {
      return match;
    }

    // Skip if it's a very short text or too long
    if (trimmedText.length < 2 || trimmedText.length > 100) {
      return match;
    }

    // Clean up trailing punctuation for translation key generation
    const cleanedText = trimmedText.replace(/[:;,!?]+$/, "").trim();

    // Find or create translation key
    let key = findTranslationKey(cleanedText, enTranslations);
    if (!key) {
      key = findTranslationKey(trimmedText, enTranslations);
    }
    if (!key) {
      key = addTranslationIfNeeded(cleanedText, enTranslations, frTranslations);
    }

    if (key) {
      addedTranslations.push({ text: trimmedText, key, cleanedText });
      // Extract the opening tag attributes to preserve them
      const openingTag = match.match(/<mat-option[^>]*>/i)[0];
      return `${openingTag}{{ '${key}' | translate }}</mat-option>`;
    }

    return match;
  });

  // Replace text content within tags (but be more selective)
  updatedContent = updatedContent.replace(/>([^<{]+)</g, (match, text, offset) => {
    // Better whitespace handling for text that might span multiple lines
    const trimmedText = text.replace(/\s+/g, " ").trim();

    // Enhanced filtering for text replacement
    if (!trimmedText || trimmedText.length < 2 || trimmedText.length > 100) {
      return match;
    }

    // Skip Angular expressions, directives, and already translated text
    if (
      trimmedText.includes("{{") ||
      trimmedText.includes("translate") ||
      trimmedText.includes("*ng") ||
      trimmedText.includes("|") ||
      trimmedText.includes(">=") ||
      trimmedText.includes("<=") ||
      trimmedText.includes("===") ||
      trimmedText.includes("!==") ||
      trimmedText.includes("&&") ||
      trimmedText.includes("||") ||
      trimmedText.includes("==") ||
      trimmedText.includes("!=") ||
      trimmedText.includes("++") ||
      trimmedText.includes("--") ||
      trimmedText.includes("+=") ||
      trimmedText.includes("-=") ||
      trimmedText.includes("*=") ||
      trimmedText.includes("/=") ||
      trimmedText.includes(".value") ||
      trimmedText.includes(".form") ||
      trimmedText.includes(".control") ||
      // Skip text that looks like property access or method calls
      /\w+\.\w+/.test(trimmedText) ||
      // Skip text that looks like comparison expressions
      /\w+\s*[><=!&|]\s*\w+/.test(trimmedText) ||
      // Skip text that contains form field references
      /\w+(Form|Control)\b/.test(trimmedText)
    ) {
      return match;
    }

    // Enhanced check if we're inside an Angular directive attribute value
    const beforeMatch = updatedContent.substring(0, offset);

    // Check if we're actually inside an attribute value by looking for unclosed quotes
    const lastOpenQuote = Math.max(beforeMatch.lastIndexOf('"'), beforeMatch.lastIndexOf("'"));
    const lastCloseQuote = Math.max(
      beforeMatch.lastIndexOf('"', lastOpenQuote - 1),
      beforeMatch.lastIndexOf("'", lastOpenQuote - 1)
    );

    // If we have an unclosed quote, check if it's part of an Angular directive attribute
    if (lastOpenQuote > lastCloseQuote) {
      const beforeQuote = beforeMatch.substring(0, lastOpenQuote);
      const angularDirectiveAttributePattern = /(\*ng[A-Za-z]*|\([\w\-]+\)|\[[\w\-\.]+\])\s*=\s*$/;
      if (angularDirectiveAttributePattern.test(beforeQuote)) {
        return match; // Skip translation inside Angular directive attribute values
      }
    }

    // Check if we're inside an HTML comment
    const contentBeforeMatch = updatedContent.substring(0, offset);
    const contentAfterMatch = updatedContent.substring(offset + match.length);

    // Find the most recent comment start before this position
    const lastCommentStart = contentBeforeMatch.lastIndexOf("<!--");
    const lastCommentEnd = contentBeforeMatch.lastIndexOf("-->");

    // Find the next comment end after this position
    const nextCommentEnd = contentAfterMatch.indexOf("-->");

    // If we're inside a comment (comment start is after the last comment end, and there's a comment end ahead)
    if (lastCommentStart > lastCommentEnd && nextCommentEnd !== -1) {
      return match; // Skip translation inside comments
    }

    // Also skip if the text itself contains comment markers
    if (trimmedText.includes("<!--") || trimmedText.includes("-->")) {
      return match;
    }

    // Check if the text is inside an element with Angular structural directives
    const beforeText = updatedContent.substring(0, offset);
    const afterText = updatedContent.substring(offset + match.length);

    // Find the opening tag that contains this text
    const lastOpeningTag = beforeText.match(/<[^/>][^>]*>(?:[^<]*)$/);
    if (lastOpeningTag) {
      const elementTag = lastOpeningTag[0];

      // Normalize text by removing HTML entities and extra whitespace for comparison
      const normalizedText = trimmedText
        .replace(/&nbsp;/g, " ")
        .replace(/\s+/g, " ")
        .trim();

      // Improved static label detection to include our specific cases
      const isStaticLabel =
        trimmedText.match(/^[A-Z][a-zA-Z\s\-?]+:?$/) ||
        normalizedText === "View Incentives" ||
        normalizedText === "Hide Incentives" ||
        normalizedText.includes("Lock-in Period") ||
        // Common UI labels that should be translated even inside structural directives
        [
          "View",
          "Hide",
          "Show",
          "Edit",
          "Delete",
          "Add",
          "Remove",
          "Save",
          "Cancel",
          "Submit",
          "Update",
          "Create",
          "Back",
          "Next",
          "Previous",
          "Close",
          "Open",
        ].includes(normalizedText) ||
        // Multi-word UI labels
        normalizedText.match(/^(View|Hide|Show|Edit|Delete|Add|Remove|Save|Cancel|Submit|Update|Create)\s+\w+/);

      // Skip if element has Angular structural directives AND the text looks like a dynamic value
      // But allow static labels like "Fund Name:", "Organization Units:", "View Incentives", "Lock-in Period:", etc.
      if (
        !isStaticLabel &&
        (elementTag.includes("*ngFor") ||
          elementTag.includes("*ngIf") ||
          elementTag.includes("*ngSwitch") ||
          elementTag.includes("*ngTemplate") ||
          elementTag.includes("*ng"))
      ) {
        return match;
      }
    }

    // Check if we're inside an Angular interpolation context
    // Look for the immediate context around this specific text match
    const textStartInContent = offset + 1; // +1 to account for the '>' character
    const textEndInContent = textStartInContent + trimmedText.length;

    // Find the nearest {{ before and }} after this text
    const beforeInterpolationStart = updatedContent.lastIndexOf("{{", textStartInContent);
    const afterInterpolationEnd = updatedContent.indexOf("}}", textEndInContent);
    const beforeInterpolationEnd = updatedContent.lastIndexOf("}}", textStartInContent);

    // Check if this text is inside {{ }}
    if (beforeInterpolationStart > beforeInterpolationEnd && afterInterpolationEnd !== -1) {
      // We're inside an interpolation
      return match;
    }

    // Check for Angular structural directives in surrounding context, but be more lenient for static labels
    // Note: We only skip translation if we're actually inside a directive attribute value,
    // not just because the element has directives. Regular content inside elements with
    // directives should still be translated.
    const contextAroundText = beforeText.slice(-50) + match + afterText.slice(0, 50);

    // Normalize text by removing HTML entities and extra whitespace for comparison
    const normalizedText = trimmedText
      .replace(/&nbsp;/g, " ")
      .replace(/\s+/g, " ")
      .trim();

    // Only skip translation for text that's clearly dynamic/generated content
    // Allow translation of static UI labels even inside elements with Angular directives
    const isDynamicContent =
      // Text that looks like variable names or property paths
      /^\w+(\.\w+)+$/.test(normalizedText) ||
      // Text that looks like loop variables or template variables
      /^(item|option|element|data|record|entry)\s*$/.test(normalizedText) ||
      // Text that contains interpolation-like patterns
      /\{\{\s*\w+/.test(normalizedText) ||
      // Text that looks like method calls
      /\w+\(\)/.test(normalizedText);

    if (isDynamicContent) {
      return match;
    }

    // Skip very long text (likely descriptions/paragraphs)
    const words = trimmedText.split(/\s+/);
    if (words.length > 10) {
      return match;
    }

    // Skip if it looks like HTML content, URLs, or code
    if (
      trimmedText.includes("http") ||
      trimmedText.includes("www.") ||
      trimmedText.includes("@") ||
      trimmedText.includes("()") ||
      trimmedText.match(/^[A-Z_][A-Z0-9_]*$/)
    ) {
      return match;
    }

    // Decode HTML entities to check the actual text content
    const decodeHtmlEntities = (text) => {
      return text
        .replace(/&nbsp;/g, " ")
        .replace(/&amp;/g, "&")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'");
    };

    const decodedText = decodeHtmlEntities(trimmedText);
    const decodedTrimmed = decodedText.trim();

    // Skip text that's only whitespace after decoding HTML entities
    if (!decodedTrimmed || decodedTrimmed.match(/^[\s]*$/)) {
      return match;
    }

    // Skip text that's mostly numbers or punctuation only
    if (trimmedText.match(/^[\d\s.,;:!?\-()[\]{}'"]*$/) && !trimmedText.match(/[a-zA-Z]/)) {
      return match;
    }

    // Clean up trailing punctuation for translation key generation (use decoded text)
    const cleanedText = decodedTrimmed.replace(/[:;,!?]+$/, "").trim();

    // Use cleaned text for translation key lookup and generation
    let key = findTranslationKey(cleanedText, enTranslations);

    // If not found with cleaned text, try with original decoded text
    if (!key) {
      key = findTranslationKey(decodedTrimmed, enTranslations);
    }

    // If still not found, add new translation
    if (!key) {
      key = addTranslationIfNeeded(cleanedText, enTranslations, frTranslations);
    }
    if (key) {
      addedTranslations.push({ text: decodedTrimmed, key, cleanedText });
      // Preserve any leading/trailing HTML entities in the original text
      const leadingEntities = trimmedText.match(/^(&[^;]+;|\s)*/)?.[0] || "";
      const trailingEntities = trimmedText.match(/(&[^;]+;|\s)*$/)?.[0] || "";
      const entityStart = leadingEntities.replace(/\s/g, "");
      const entityEnd = trailingEntities.replace(/\s/g, "");

      return `>${entityStart}{{ '${key}' | translate }}${entityEnd}<`;
    }

    return match;
  });

  // Replace attribute values (but skip Angular directive attributes)
  const attributePatterns = [
    { name: "placeholder", regex: /(placeholder\s*=\s*)["']([^"']+)["']/gi },
    { name: "title", regex: /(title\s*=\s*)["']([^"']+)["']/gi },
    { name: "alt", regex: /(alt\s*=\s*)["']([^"']+)["']/gi },
    { name: "aria-label", regex: /(aria-label\s*=\s*)["']([^"']+)["']/gi },
    { name: "matTooltip", regex: /(matTooltip\s*=\s*)["']([^"']+)["']/gi },
  ];

  // Define Angular directive patterns that should NOT be translated
  const angularDirectiveAttributePatterns = [
    /\*ng[A-Za-z]*\s*=\s*["']([^"']+)["']/gi,
    /\([\w\-]+\)\s*=\s*["']([^"']+)["']/gi,
    /\[[\w\-\.]+\]\s*=\s*["']([^"']+)["']/gi,
    /ng[A-Z][\w]*\s*=\s*["']([^"']+)["']/gi, // ngModel, ngValue, etc.
    /\#[\w]+\s*=\s*["']([^"']+)["']/gi, // template reference variables
    /let\-[\w]+\s*=\s*["']([^"']+)["']/gi, // template input variables
  ];

  attributePatterns.forEach(({ name, regex }) => {
    updatedContent = updatedContent.replace(regex, (match, prefix, text) => {
      const trimmedText = text.trim();

      // Apply same filtering for attributes
      if (!trimmedText || trimmedText.length < 2 || trimmedText.length > 100) {
        return match;
      }

      if (
        trimmedText.includes("{{") ||
        trimmedText.includes("translate") ||
        trimmedText.includes("http") ||
        trimmedText.includes("www.")
      ) {
        return match;
      }

      // Clean up trailing punctuation for translation key generation
      const cleanedText = trimmedText.replace(/[:;,!?]+$/, "").trim();

      const key =
        findTranslationKey(cleanedText, enTranslations) ||
        addTranslationIfNeeded(cleanedText, enTranslations, frTranslations);
      if (key) {
        addedTranslations.push({ text: trimmedText, key, cleanedText });
        return `${prefix}"{{ '${key}' | translate }}"`;
      }

      return match;
    });
  });

  // Explicitly skip Angular directive attributes (don't translate their content)
  // This section just identifies them so they're not processed elsewhere
  const angularDirectivePatterns = [
    { name: "*ngIf", regex: /(\*ngIf\s*=\s*)["']([^"']+)["']/gi },
    { name: "*ngFor", regex: /(\*ngFor\s*=\s*)["']([^"']+)["']/gi },
    { name: "*ngSwitch", regex: /(\*ngSwitch\s*=\s*)["']([^"']+)["']/gi },
    { name: "*ngSwitchCase", regex: /(\*ngSwitchCase\s*=\s*)["']([^"']+)["']/gi },
    { name: "[ngClass]", regex: /(\[ngClass\]\s*=\s*)["']([^"']+)["']/gi },
    { name: "[ngStyle]", regex: /(\[ngStyle\]\s*=\s*)["']([^"']+)["']/gi },
    { name: "(click)", regex: /(\(click\)\s*=\s*)["']([^"']+)["']/gi },
    { name: "(change)", regex: /(\(change\)\s*=\s*)["']([^"']+)["']/gi },
    { name: "(submit)", regex: /(\(submit\)\s*=\s*)["']([^"']+)["']/gi },
    { name: "ngModel", regex: /(ngModel\s*=\s*)["']([^"']+)["']/gi },
    { name: "[value]", regex: /(\[value\]\s*=\s*)["']([^"']+)["']/gi },
  ];

  // Log Angular directive attributes found (for debugging) but don't translate them
  angularDirectivePatterns.forEach(({ name, regex }) => {
    const matches = [...updatedContent.matchAll(regex)];
    if (matches.length > 0) {
      console.log(`Found ${matches.length} ${name} directive(s) - skipping translation of their content`);
    }
  });

  // Restore HTML comments from placeholders
  commentMap.forEach((originalComment, placeholder) => {
    updatedContent = updatedContent.replace(placeholder, originalComment);
  });

  return { updatedContent, addedTranslations };
};

// Save updated translation files
const saveTranslations = (enTranslations, frTranslations) => {
  try {
    const enPath = path.join(__dirname, "../src/assets/translations/en-US.json");
    const frPath = path.join(__dirname, "../src/assets/translations/fr-FR.json");

    fs.writeFileSync(enPath, JSON.stringify(enTranslations, null, 2), "utf8");
    fs.writeFileSync(frPath, JSON.stringify(frTranslations, null, 2), "utf8");

    console.log("✅ Translation files updated successfully");
  } catch (error) {
    console.error("❌ Error saving translation files:", error.message);
  }
};

// Process a single HTML file
const processHtmlFile = (filePath, translations) => {
  try {
    console.log(`\n📄 Processing: ${filePath}`);

    const htmlContent = fs.readFileSync(filePath, "utf8");
    console.log(`📝 File content length: ${htmlContent.length} characters`);

    const { updatedContent, addedTranslations } = replaceTextWithTranslations(htmlContent, translations);
    console.log(`🔄 Added translations: ${addedTranslations.length}`);

    if (addedTranslations.length > 0) {
      // Save updated HTML file
      fs.writeFileSync(filePath, updatedContent, "utf8");

      console.log(`✅ Updated ${filePath}`);
      console.log(`📝 Translations added:`);
      addedTranslations.forEach(({ text, key }) => {
        console.log(`   "${text}" → ${key}`);
      });

      return addedTranslations.length;
    } else {
      console.log(`ℹ️  No translations needed for ${filePath}`);
      return 0;
    }
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
    return 0;
  }
};

// Find all HTML files in the project
const findHtmlFiles = () => {
  const srcPath = path.join(__dirname, "../src");
  return findHtmlFilesRecursive(srcPath).filter((file) => file.endsWith(".component.html"));
};

// Find all HTML files in a specific folder and its subfolders
const findHtmlFilesInFolder = (folderPath) => {
  const resolvedFolderPath = path.resolve(folderPath);

  if (!fs.existsSync(resolvedFolderPath)) {
    throw new Error(`Folder not found: ${resolvedFolderPath}`);
  }

  if (!fs.statSync(resolvedFolderPath).isDirectory()) {
    throw new Error(`Path is not a directory: ${resolvedFolderPath}`);
  }

  return findHtmlFilesRecursive(resolvedFolderPath);
};

// Recursively find HTML files
const findHtmlFilesRecursive = (dir) => {
  let results = [];

  try {
    const list = fs.readdirSync(dir);

    list.forEach((file) => {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);

      if (stat && stat.isDirectory()) {
        // Recursively search subdirectories
        results = results.concat(findHtmlFilesRecursive(filePath));
      } else if (file.endsWith(".html")) {
        results.push(filePath);
      }
    });
  } catch (error) {
    console.warn(`Warning: Could not read directory ${dir}: ${error.message}`);
  }

  return results;
};

// Main execution
const main = () => {
  console.log("🌍 Starting HTML Translation Script for Fineract Frontend v2");

  const args = process.argv.slice(2);
  console.log("📋 Arguments:", args);

  if (args.includes("--help")) {
    console.log(`
📖 HTML Translation Script Usage:

Single file:
  node scripts/translate-html.js <file-path>

Folder (recursive):
  node scripts/translate-html.js --folder <folder-path>

Scan all HTML files:
  node scripts/translate-html.js --scan-all

Help:
  node scripts/translate-html.js --help

Examples:
  node scripts/translate-html.js src/app/products/loan-products/loan-product-stepper/loan-product-details-step/loan-product-details-step.component.html
  node scripts/translate-html.js --folder src/app/products/recurring-deposit-products
  node scripts/translate-html.js --scan-all
    `);
    return;
  }

  console.log("🌍 HTML Translation Script for Fineract Frontend v2");
  console.log("==================================================");

  console.log("📦 Loading translations...");
  const translations = loadTranslations();
  console.log("✅ Translations loaded successfully");

  let totalTranslations = 0;

  if (args.includes("--scan-all")) {
    console.log("🔍 Scanning all HTML component files...");
    const htmlFiles = findHtmlFiles();
    console.log(`📁 Found ${htmlFiles.length} HTML component files`);

    htmlFiles.forEach((filePath) => {
      totalTranslations += processHtmlFile(filePath, translations);
    });
  } else if (args.includes("--folder")) {
    const folderIndex = args.indexOf("--folder");

    if (folderIndex === -1 || folderIndex + 1 >= args.length) {
      console.error("❌ Please provide a folder path after --folder");
      console.log("Use --help for usage information");
      process.exit(1);
    }

    const folderPath = args[folderIndex + 1];

    try {
      console.log(`🔍 Scanning HTML files in folder: ${folderPath}`);
      const htmlFiles = findHtmlFilesInFolder(folderPath);
      console.log(`📁 Found ${htmlFiles.length} HTML files in folder and subfolders`);

      htmlFiles.forEach((filePath) => {
        totalTranslations += processHtmlFile(filePath, translations);
      });
    } catch (error) {
      console.error(`❌ Error scanning folder: ${error.message}`);
      process.exit(1);
    }
  } else if (args.length > 0) {
    const filePath = path.resolve(args[0]);
    if (!fs.existsSync(filePath)) {
      console.error(`❌ File not found: ${filePath}`);
      process.exit(1);
    }

    if (!filePath.endsWith(".html")) {
      console.error(`❌ File must be an HTML file: ${filePath}`);
      process.exit(1);
    }

    totalTranslations += processHtmlFile(filePath, translations);
  } else {
    console.error("❌ Please provide a file path, use --folder <folder-path>, or use --scan-all");
    console.log("Use --help for usage information");
    process.exit(1);
  }

  if (totalTranslations > 0) {
    saveTranslations(translations.enTranslations, translations.frTranslations);
  }

  console.log(`\n🎉 Translation complete! Added ${totalTranslations} translations.`);
};

// Error handling
process.on("uncaughtException", (error) => {
  console.error("❌ Uncaught Exception:", error.message);
  process.exit(1);
});

process.on("unhandledRejection", (reason) => {
  console.error("❌ Unhandled Rejection:", reason);
  process.exit(1);
});

if (require.main === module) {
  main();
}

module.exports = {
  loadTranslations,
  getTranslationMappings,
  findTranslationKey,
  addTranslationIfNeeded,
  extractTextContent,
  replaceTextWithTranslations,
  processHtmlFile,
  findHtmlFiles,
  findHtmlFilesInFolder,
};
