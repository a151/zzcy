// 消息提示弹窗
import {
  MessageBox
} from "mint-ui";
export function handleCofirm(title = "", text = "", confirmBtn = "", cancleBtn = "") {
  return MessageBox.confirm(text, title, {
    confirmButtonText: confirmBtn,
    cancelButtonText: cancleBtn,
    // type: type,
    center: true,
    title: title
  })
}

