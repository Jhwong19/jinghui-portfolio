/* Local adaptation of Stand Apart's ReceiverPhoneDemo. No API requests. */
(() => {
  const dialog = document.querySelector('.stand-apart-receiver-dialog');
  if (!dialog) return;
  const title = document.getElementById('receiver-dialog-title');
  const save = document.getElementById('receiver-save');
  const send = document.getElementById('receiver-send');
  const channels = document.getElementById('receiver-channels');
  const status = document.getElementById('receiver-status');
  document.querySelectorAll('[data-receiver-open]').forEach(button => {
    button.addEventListener('click', () => {
      const saving = button.dataset.receiverOpen === 'save';
      title.textContent = saving ? 'Save my contact' : 'Send yours back';
      save.hidden = !saving;
      send.hidden = saving;
      channels.hidden = true;
      status.textContent = '';
      dialog.showModal();
    });
  });
  dialog.querySelector('.stand-apart-receiver-dialog__close').addEventListener('click', () => dialog.close());
  save.addEventListener('submit', event => {
    event.preventDefault();
    status.textContent = 'Preview complete: the live experience offers a contact file to import into your phone. No contact was downloaded here.';
  });
  send.addEventListener('submit', event => {
    event.preventDefault();
    send.hidden = true;
    channels.hidden = false;
    title.textContent = 'Send your card via';
    channels.querySelector('button').focus();
  });
  channels.querySelectorAll('button').forEach(button => {
    button.addEventListener('click', () => {
      status.textContent = `${button.textContent} selected. In the live experience, you review the message before sending. Nothing was sent here.`;
    });
  });
})();
