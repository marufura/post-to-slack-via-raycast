import { LaunchProps, Clipboard, openExtensionPreferences, showHUD, Toast, showToast, closeMainWindow } from "@raycast/api";

type Arguments = {
  url: string;
}

export default async function main(props: LaunchProps<{ arguments: Arguments }>) {

  const url: string = props.arguments.url;
  try {
    const threadTs: string = extractTsFromUrl(url);
    await Clipboard.copy(threadTs);
  } catch (e) {
    console.error(e);
    await showToast({
      style: Toast.Style.Failure,
      title: "ERROR: ",
      message: "入力形式が正しくありません",
    });
    return
  }
  showHUD("SUCCESS: thread_ts is copied in clipboard!");
  closeMainWindow();
  openExtensionPreferences();
}

function extractTsFromUrl(url: string): string {
  const match = url.match(/\/p(\d+)/);
  if (!match || match[1].length !== 16) {
    throw new Error('URL does not contain a valid 16-digit timestamp.');
  }
  return `${match[1].slice(0, 10)}.${match[1].slice(10)}`;
}