import { Form, ActionPanel, Action, showToast } from "@raycast/api";
import { closeMainWindow, popToRoot, getPreferenceValues } from "@raycast/api";
import { useState, useEffect } from "react";
import fs from "fs";
import axios from 'axios';


type FormValues = {
  message: string;
  attachedLink: string;
  files: string[];
};

interface Preferences {
  token: string;
  channelId: string;
}

interface SlackPostMessageParams {
  channel: String;
  text: String;
  mrkdwn: boolean;
}

function setSlackMessage(message: String, link: String) {
  return message + "\n" + link;
}

export default function Command() {

  // 入力必須項目のチェック
  const [nameError, setNameError] = useState<string | undefined>();
  function dropNameErrorIfNeeded() {
    if (nameError && nameError.length > 0) {
      setNameError(undefined);
    }
  }

  function handleSubmit(values: FormValues) {

    // CHECK the file 
    // const files = values.files.filter((file: any) => fs.existsSync(file) && fs.lstatSync(file).isFile());

    // LOAD preferences
    const prefs = getPreferenceValues<Preferences>();

    // SET payload for PostMeeage API
    const message: String = setSlackMessage(values.message, values.attachedLink);
    const postData: SlackPostMessageParams = {
      channel: prefs.channelId,
      text: message,
      mrkdwn: true,
    };

    // DEBUG
    console.log(postData);
    console.log(values);
    // console.log(files);

    // POST to Slack
    axios.post('https://slack.com/api/chat.postMessage', postData, {
      headers: {
        'Authorization': `Bearer ` + prefs.token,
        'Content-Type': 'application/json; charset=utf-8',
      },
    }).then(response => {
      console.log('Message posted successfully:', response.data);
      popToRoot({ clearSearchBar: true });
      closeMainWindow();
    })
      .catch(error => {
        console.error('An error occurred:', error);
        popToRoot({ clearSearchBar: true });
        closeMainWindow();
      });
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
        title="メッセージ"
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
      <Form.Separator />
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
