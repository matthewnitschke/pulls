export default function openUrls(urls: string[]) {
  window.electron.ipcRenderer.invoke('open-urls', urls);
}
