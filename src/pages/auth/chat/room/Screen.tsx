import { useEffect, useRef, useState } from "react";
import * as S from "./style";
import { ChatEvntType } from "socket/chat";
import { getSocket } from "socket/socket";

export default function Screen(props: { room: number }) {
  const [screen, setScreen] = useState<ChatEvntType[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const socket = getSocket();
  let keyCnt = 0;
  const listener = (res: ChatEvntType) => {
    if (res.type === "chat" && res.roomId === props.room) {
      setScreen(screen.concat(res));
    } else if (res.type === "history" && res.list) {
      const tmp: ChatEvntType[] = [];
      res.list.map((elem) => {
        tmp.push({
          type: "chat",
          roomId: props.room,
          status: "plain",
          from: elem.from,
          content: elem.content
        })
      });
      setScreen(screen.concat(tmp));
    }
  };

  useEffect(() => {
    socket.on("message", listener);
    scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight);
    return () => {
      socket.off("message", listener);
    };
  }, [screen]);

  return (
    <>
      <S.Screen ref={scrollRef}>
        {screen.map((i: ChatEvntType) => {
          return (
            <S.H2 key={i.from + keyCnt++}>
              {i.from} : {i.content}
            </S.H2>
          );
        })}
      </S.Screen>
    </>
  );
}
