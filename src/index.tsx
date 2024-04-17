import { closeMainWindow, showToast, Toast, getPreferenceValues, LaunchProps, showHUD } from "@raycast/api";
import axios from 'axios'

interface Arguments {
  message: string;
}

interface Preferences {
  token: string;
  channelId: string;
}

interface SlackPostMessageParams {
  channel: String;
  text: String;
}

export default async function main(props: LaunchProps<{ arguments: Arguments }>) {

  const prefs = getPreferenceValues<Preferences>();
  const message = props.arguments.message;
  const postData: SlackPostMessageParams = {
    channel: prefs.channelId,
    text: message,
  };

  console.log(message);

  axios.post('https://slack.com/api/chat.postMessage', postData, {
    headers: {
      'Authorization': `Bearer ` + prefs.token,
      'Content-Type': 'application/json; charset=utf-8',
    },
  }).then(response => {
      console.log('Message posted successfully:', response.data);
      showToast({
        style: Toast.Style.Success,
        title: "Fail to send messages!!",
        message: "Check your ID or token are correct.",
      });
      showHUD("SUCCESS");
    })
    .catch(error => {
      console.error('An error occurred:', error);
      showToast({
        style: Toast.Style.Failure,
        title: "Fail to send messages!!",
        message: "Check your ID or token are correct.",
      });
      showHUD("ERROR");
    });
}
