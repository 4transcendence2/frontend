import { useEffect } from "react";
import { getSocket } from "socket/socket";
import { ChatRoomResponse } from "socket/active/chatEventType";

export function onProfile(
  user: string,
  setProfileUser: React.Dispatch<React.SetStateAction<string>>,
  onClose: () => void,
) {
  setProfileUser(user);
  onClose();
}

export function useOper(operator: string, roomId: number, targetUser: string, onClose: () => void) {
  const socket = getSocket();

  function handleResult(res: ChatRoomResponse) {
    // TEST : 이벤트 결과 확인용
    if (res.status === "approved") {
      if (res.roomId === roomId) {
        onClose();
      }
    } else console.log("오류", res);
  }

  useEffect(() => {
    socket.on(`${operator}Result`, handleResult);
    return () => {
      socket.off(`${operator}Result`, handleResult);
    };
  }, []);

  return function onOper() {
    // TEST: 블락/언블락 테스트
    console.log("emit 전송", roomId, targetUser);
    socket.emit(operator, {
      roomId,
      username: targetUser,
    });
  };
}
