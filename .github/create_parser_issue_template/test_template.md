---
name: Issue
about: test issue
title: test({{ env.SERVICE_NAME }})
labels: PARSER
assignees: ''

---

## 概要
メールからmenu解析データのモデルを定義する

- 参考メールサンプル
  <メールを追加。ex) https://drive.google.com/file/d/xxx>

## タスク
- [ ] メーから抜き出す項目を洗い出す
- [ ] モデルの実装
    - `flair/internal/pkg/models/nosql/receipt/{{ env.SERVICE_NAME }}/model.go` の修正

## 完了条件
- [ ] レビュー完了していること
