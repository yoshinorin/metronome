import type { Dictionary } from './en';

/** Japanese dictionary. */
export const ja: Dictionary = {
  appTitle: 'メトロノーム',
  start: 'スタート',
  stop: 'ストップ',
  tempo: 'テンポ',
  bpmUnit: 'BPM',
  timeSignature: '拍子',
  volume: '音量',
  beatIndicator: '拍インジケーター',
  beat: '拍',
  languageSwitch: '言語',
  about: 'このアプリについて',
  aboutNoDataSent:
    'このアプリはブラウザ内で完結して動作します。設定・音声・利用状況などのデータを外部サーバーへ送信することはありません。',
  aboutLocalStorage:
    '設定(テンポ・拍子・音量・拍ごとの音量・言語)はブラウザのローカルストレージにのみ保存されます。ブラウザのデータを消去すると設定もリセットされます。',
  back: '戻る',
};
