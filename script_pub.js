const fs = require('fs');
let code = fs.readFileSync('app/admin/(dashboard)/compose/page.tsx', 'utf8');

if (!code.includes('import PublishDrawer')) {
  code = code.replace("import PostRenderer from '@/components/post-renderer/PostRenderer';", "import PostRenderer from '@/components/post-renderer/PostRenderer';\nimport PublishDrawer from './PublishDrawer';");
}

code = code.replace(/\{\/\* EXCLUSIVELY POSITIONED PUBLISHING DRAWER\/SLIDEOVER \*\/\}[\s\S]*?(?=<\/div>\n  \);\n\}|$)/, `<PublishDrawer
        isOpen={isPublishModalOpen}
        onClose={() => setIsPublishModalOpen(false)}
        formData={formData}
        setFormData={setFormData}
        personaInfoMap={personaInfoMap}
        saving={saving}
        isCustomizingUrl={isCustomizingUrl}
        setIsCustomizingUrl={setIsCustomizingUrl}
        customUrlVal={customUrlVal}
        setCustomUrlVal={setCustomUrlVal}
        urlValidationError={urlValidationError}
        setUrlValidationError={setUrlValidationError}
        pasteTagsText={pasteTagsText}
        setPasteTagsText={setPasteTagsText}
        getExcerptFromContent={getExcerptFromContent}
        getWordCount={getWordCount}
        getReadingTime={getReadingTime}
        handleApplyCustomUrl={handleApplyCustomUrl}
        validateCustomSlug={validateCustomSlug}
        handleSavePost={handleSavePost}
        currentPostId={currentPostId}
        wasPublished={wasPublished}
        isEditingExcerpt={isEditingExcerpt}
        setIsEditingExcerpt={setIsEditingExcerpt}
      />\n`);

fs.writeFileSync('app/admin/(dashboard)/compose/page.tsx', code);
console.log('Done');
