if (Scratch.gui) {
  Scratch.gui.getBlockly().then(async (ScratchBlocks) => {
    const modal = await ScratchBlocks.customPrompt(
      {
        title: 'title',
      },
      {
        content: { width: '500px' },
      },
      [
        { name: 'OK', role: 'ok', callback: () => console.log('Confirmed') },
        {
          name: 'Cancel',
          role: 'close',
          callback: () => console.log('Cancelled'),
        },
      ],
    );

    modal.appendChild(document.createElement('textarea'));
  });
}
