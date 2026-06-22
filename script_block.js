const fs = require('fs');
let code = fs.readFileSync('app/admin/(dashboard)/compose/page.tsx', 'utf8');

if (!code.includes('import BlockList')) {
  code = code.replace("import PublishDrawer from './PublishDrawer';", "import PublishDrawer from './PublishDrawer';\nimport BlockList from './BlockList';");
}

code = code.replace(/<div className="space-y-4 pt-8 border-t border-\[#141414\] w-full flex-1">[\s\S]*?(?=<\/main>)/, `<BlockList
                  composerBlocks={composerBlocks}
                  selectedBlockId={selectedBlockId}
                  focusedBlockId={focusedBlockId}
                  slashMenuBlockId={slashMenuBlockId}
                  slashCommands={slashCommands}
                  setDraggingBlockIdx={setDraggingBlockIdx}
                  setDragOverBlockIdx={setDragOverBlockIdx}
                  handleBlocksReorder={handleBlocksReorder}
                  setSelectedBlockId={setSelectedBlockId}
                  handleDeleteBlock={handleDeleteBlock}
                  handleTriggerFilePicker={handleTriggerFilePicker}
                  handleUpdateBlockImageProps={handleUpdateBlockImageProps}
                  handleTextareaChange={handleTextareaChange}
                  handleTextareaKeyDown={handleTextareaKeyDown}
                  handleUpdateBlockContent={handleUpdateBlockContent}
                  handleSelectSlashCommand={handleSelectSlashCommand}
                />
              `);

fs.writeFileSync('app/admin/(dashboard)/compose/page.tsx', code);
console.log('Done');
