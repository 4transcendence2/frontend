import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { getSocket } from "socket/socket";
import { ChatEvntType, ChatListType } from "socket/chat";
import Modal from "modal/layout/Modal";
import NotificationModal from "modal/NotificationModal";

export type NotiType = {
  title: string;
  chatId?: number;
  dmId?: number;
  gameId?: number;
};

export default function useNotiModal() {
  const target = useLocation().pathname.split("/");
  const socket = getSocket();
  const [myChat, setMyChat] = useState<ChatListType[]>([]);
  const [noti, setNoti] = useState<NotiType[]>([]);
  const [newNoti, setNewNoti] = useState(false);
  const [showNotiModal, setShowNotiModal] = useState(false);
  const locPage = target[1];
  const locRoom = target[2];

  const listener = (res: ChatEvntType) => {
    if (locPage !== "chat" || locRoom !== String(res.roomId)) {
      myChat.map((chat) => {
        if (chat.roomId === res.roomId) {
          // console.log(res.roomId);
          const data: NotiType = {
            title: "참여하고 있는 채팅방에 새로운 메시지",
            chatId: res.roomId,
          };
          setNoti([data, ...noti]);
          setNewNoti(true);
        }
      });
    }
  };

  const myChatListener = (res: ChatListType[]) => {
    setMyChat(res);
  };

  useEffect(() => {
    socket.on("chat", listener);
    socket.on("updateMyChatRoomList", myChatListener);
    return () => {
      socket.off("chat", listener);
      socket.off("updateMyChatRoomList", myChatListener);
    };
  });

  const closeModalHandler = () => {
    setShowNotiModal(false);
    setNewNoti(false);
    setNoti([]);
  };

  const onOpenNotiModal = () => {
    setShowNotiModal(true);
  };

  return {
    showNotiModal,
    NotiModal: (
      <Modal setView={closeModalHandler}>
        <NotificationModal close={closeModalHandler} notiList={noti} />
      </Modal>
    ),
    onOpenNotiModal,
    newNoti,
  };
}