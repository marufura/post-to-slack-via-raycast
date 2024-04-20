import { Form, ActionPanel, Action, Toast, showToast } from "@raycast/api";
import { closeMainWindow, popToRoot, getPreferenceValues } from "@raycast/api";
import { useState, useEffect } from "react";
import fs from "fs";
import { WebClient } from '@slack/web-api';


interface Preferences {
  token: string;
  channelId: string;
}

type FormValues = {
  message: string;
  attachedLink: string;
  files: string[];
};

type SlackPostMessageParams = {
  channel: string;
  text: string;
  mrkdwn: boolean;
}

function setSlackMessage(message: String, link: String) {
  return message + "\n" + link;
}

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

    // CHECK the file 
    // const files = values.files.filter((file: any) => fs.existsSync(file) && fs.lstatSync(file).isFile());

    // SET payload for PostMeeage API
    const message: string = setSlackMessage(values.message, values.attachedLink);
    const postData: SlackPostMessageParams = {
      channel: prefs.channelId,
      text: message,
      mrkdwn: true,
    };

    // DEBUG
    console.log(postData);
    console.log(values);
    // console.log(files);

    // TEST
    try{
      const result = await web.chat.postMessage({
        channel: prefs.channelId,
        text: message,
        mrkdwn: true,
      });
      console.log(result);
      popToRoot({ clearSearchBar: true });
      closeMainWindow();
    } catch (error) {
      console.error(error);
      await showToast({
        style: Toast.Style.Failure,
        title: "ERROR!",
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
      <Form.Description text="Required" />
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
      <Form.Description text="Optional" />
      <Form.TextField id="attachedLink" title="Link" placeholder="https://..." />
      {/* <Form.FilePicker id="files" /> */}

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
