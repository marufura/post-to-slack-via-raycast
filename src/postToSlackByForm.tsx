import { Form, ActionPanel, Action, Toast, showToast } from "@raycast/api";
import { closeMainWindow, popToRoot, getPreferenceValues } from "@raycast/api";
import { useState } from "react";
import { WebClient } from '@slack/web-api';
import fs from "fs";

interface Preferences {
  token: string;
  channelId: string;
}

type FormValues = {
  message: string;
  attachedLink: string;
  files: string[];
};

const prefs = getPreferenceValues<Preferences>();
const web = new WebClient(prefs.token);

export default function Command() {

  // 入力必須項目のチェック
  const [nameError, setNameError] = useState<string | undefined>();
  function dropNameErrorIfNeeded() {
    if (nameError && nameError.length > 0) {
      setNameError(undefined);
    }
  }

  async function handleSubmit(values: FormValues) {

    // 
    if(values.message == ""){
      await showToast({
        style: Toast.Style.Failure,
        title: "ERROR: ",
        message: "メッセージがありません！",
      });
      return
    }

    // SET payload for PostMeeage API
    const message: string = setSlackMessage(values.message, values.attachedLink);


    // DEBUG
    // console.log(postData);
    // console.log(values);
    // console.log(files);

    try {
      // POST message
      await showToast({
        style: Toast.Style.Animated,
        title: "PROGRESS: ",
        message: "テキストを送信中...",
      });
      const messageResult = await web.chat.postMessage({
        channel: prefs.channelId,
        text: message,
        mrkdwn: true,
      });
      // console.log(messageResult);

      // UPLOAD files
      await showToast({
        style: Toast.Style.Animated,
        title: "PROGRESS: ",
        message: "ファイルを送信中...",
      });
      const filePathList = values.files.filter((file: any) => fs.existsSync(file) && fs.lstatSync(file).isFile());
      if (filePathList.length != 0) {
        const uploadResult = await web.files.uploadV2({
          // thread_ts: '1223313423434.131321',
          channel_id: prefs.channelId,
          file_uploads: convertFilePaths(filePathList),
        });
        // console.log(uploadResult);
      }
      await showToast({
        style: Toast.Style.Success,
        title: "SUCCESS: ",
        message: "送信成功！",
      });
      popToRoot();
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

  return (
    <Form
      navigationTitle="Slackにメッセージを投稿する"
      enableDrafts
      actions={
        <ActionPanel>
          <Action.SubmitForm onSubmit={handleSubmit} />
        </ActionPanel>
      }
    >

      {/* 入力必須項目 */}
      <Form.Description text="Slackにメッセージを送信する" />
      <Form.TextArea
        id="message"
        title="Message"
        placeholder="チャンネルへのメッセージ"
        error={nameError}
        onChange={dropNameErrorIfNeeded}
        onBlur={(event) => {
          if (event.target.value?.length == 0) {
            setNameError("Required");
          } else {
            dropNameErrorIfNeeded();
          }
        }}
      />

      {/* 入力が必須ではない */}
      <Form.TextField id="attachedLink" title="Link" placeholder="https://..." />
      <Form.FilePicker id="files" />

      <Form.Separator />
      <Form.Description text="注意: ファイルの送信には時間がかかります" />

      {/* カスタマイズ用サンプル */}
      {/* 
      <Form.Separator />
      <Form.Description text="Sample" />
      <Form.DatePicker id="birthDate" title="Date of Birth" />
      <Form.Description text="This form showcases all available form elements." />
      <Form.TextField id="textfield" title="Text field" placeholder="Enter text" defaultValue="Raycast" />
      <Form.TextArea id="textarea" title="Text area" placeholder="Enter multi-line text" />
      <Form.DatePicker id="datepicker" title="Date picker" />
      <Form.Checkbox id="checkbox" title="Checkbox" label="Checkbox Label" storeValue />
      <Form.Dropdown id="dropdown" title="Dropdown">
        <Form.Dropdown.Item value="dropdown-item" title="Dropdown Item" />
      </Form.Dropdown>
      <Form.TagPicker id="tokeneditor" title="Tag picker">
        <Form.TagPicker.Item value="tagpicker-item" title="Tag Picker Item" />
      </Form.TagPicker>
       */}
    </Form>
  );
}

// Sub-functions
// https://slack.dev/node-slack-sdk/web-api#upload-a-file
type FileInfoForSlackApi = {
  file: string;
  filename: string;
};

function convertFilePaths(filePathList: string[]): FileInfoForSlackApi[] {
  return filePathList.map((filePath) => {
    return {
      file: filePath,
      filename: filePath.split('/').pop() || '',
    };
  });
}

function setSlackMessage(message: String, link: String) {
  return message + "\n" + link;
}