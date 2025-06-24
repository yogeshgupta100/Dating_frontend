// Test script to demonstrate improved slug generation logic

// Simple slug generation function (same logic as in slug.ts)
function generateSlug(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters except spaces and hyphens
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
}

// Profile slug generation function
function generateProfileSlug(profileName, locationSlug, existingSlugs) {
  // Generate base slug from profile name
  let baseSlug = generateSlug(profileName);
  
  // If the base slug is the same as location slug, add a prefix
  if (baseSlug === locationSlug) {
    baseSlug = `escort-${baseSlug}`;
  }
  
  // If still conflicts, add more context
  if (existingSlugs.includes(baseSlug) || baseSlug === locationSlug) {
    baseSlug = `call-girl-${generateSlug(profileName)}`;
  }
  
  // If still conflicts, add a number
  let finalSlug = baseSlug;
  let counter = 1;
  
  while (existingSlugs.includes(finalSlug) || finalSlug === locationSlug) {
    finalSlug = `${baseSlug}-${counter}`;
    counter++;
  }
  
  return finalSlug;
}

console.log('🔗 Testing Improved Slug Generation\n');

// Test case: Location and Profile with similar names
const locationName = 'Jammu Call Girl';
const profileName = 'Jammu Call Girl';
const locationSlug = generateSlug(locationName);
const existingSlugs = [];

console.log('📍 Location Details:');
console.log(`Name: ${locationName}`);
console.log(`Generated Slug: ${locationSlug}`);
console.log(`URL: /${locationSlug}/profiles\n`);

// Test profile slug generation
const profileSlug = generateProfileSlug(profileName, locationSlug, existingSlugs);
console.log('👤 Profile Details:');
console.log(`Name: ${profileName}`);
console.log(`Generated Slug: ${profileSlug}`);
console.log(`URL: /${locationSlug}/profiles/${profileSlug}\n`);

// Test with existing slugs
const existingProfileSlugs = ['jammu-call-girl', 'escort-jammu-call-girl'];
const profileSlug2 = generateProfileSlug(profileName, locationSlug, existingProfileSlugs);
console.log('🔄 Profile with Existing Slugs:');
console.log(`Existing Slugs: ${existingProfileSlugs.join(', ')}`);
console.log(`Generated Slug: ${profileSlug2}`);
console.log(`URL: /${locationSlug}/profiles/${profileSlug2}\n`);

console.log('✅ Improved URL Structure:');
console.log(`Before: /jammu-call-girl/profiles/jammu-call-girl`);
console.log(`After:  /${locationSlug}/profiles/${profileSlug}`);
console.log('\n🎯 Benefits:');
console.log('- No more duplicate slugs');
console.log('- Clear distinction between locations and profiles');
console.log('- SEO-friendly and descriptive URLs');
console.log('- Automatic conflict resolution'); 