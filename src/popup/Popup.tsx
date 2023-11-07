import React, { ReactElement, useState, useEffect } from 'react';
import Switch from '@mui/material/Switch';
import { getBucket } from '@extend-chrome/storage';

interface MyBucket {
  OnOff: boolean;
}

const bucket = getBucket<MyBucket>('my_bucket', 'sync');

const Popup = (): ReactElement => {
  document.body.style.width = '10rem';
  document.body.style.height = '10rem';

  const [selectedTextLength, setSelectedTextLength] = useState(0);

  useEffect(() => {
    // メッセージリスナーを追加
    const messageListener = (message: any) => {
      if (message.type === 'textSelected') {
        setSelectedTextLength(message.textLength);
      }
    };

    // リスナーを登録
    chrome.runtime.onMessage.addListener(messageListener);

    // コンポーネントがアンマウントされた時にリスナーを削除
    return () => {
      chrome.runtime.onMessage.removeListener(messageListener);
    };
  }, []);

  const [isOn, setIsOn] = useState(false);

  useEffect(() => {
    (async () => {
      const value = await bucket.get();
      if (typeof value.OnOff === 'boolean') {
        setIsOn(value.OnOff);
      }
    })();
  }, []);

  const saveIsOn = (newIsOn: boolean) => {
    bucket.set({ OnOff: newIsOn });
    setIsOn(newIsOn);
  };

  const label = { inputProps: { 'aria-label': 'Switch demo' } };

  return (
    <div>
      <Switch
        checked={isOn}
        onChange={(event) => saveIsOn(event.currentTarget.checked)}
        {...label} // `label` を Spread 構文で適用
      />
    </div>
  );
};

export default Popup;
