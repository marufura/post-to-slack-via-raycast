import { closeMainWindow, showToast, Toast, getPreferenceValues, popToRoot, LaunchProps, showHUD } from "@raycast/api";
import { WebClient } from '@slack/web-api';


// interface and types
interface Preferences {
  token: string;
  channelId: string;
  threadTs: string;
}

type Arguments = {
  message: string;
}

// Slack API
const prefs = getPreferenceValues<Preferences>();
const web = new WebClient(prefs.token);

export default async function main(props: LaunchProps<{ arguments: Arguments }>) {

  // PREPARE data for slack API
  const prefs = getPreferenceValues<Preferences>();
  const message = props.arguments.message;
  // console.log(message);

  if(message == ""){
    await showToast({
      style: Toast.Style.Failure,
      title: "ERROR: ",
      message: "メッセージがありません！",
    });
    return
  }

  try {
    const result = await web.chat.postMessage({
      channel: prefs.channelId,
      thread_ts: prefs.threadTs,
      text: message,
      mrkdwn: true,
    });
    // console.log(result);
    popToRoot({ clearSearchBar: true });
    closeMainWindow();
  } catch (error) {
    console.error(error);
    await showToast({
      style: Toast.Style.Failure,
      title: "ERROR: ",
      message: "送信に失敗しました",
    });
  }
}
