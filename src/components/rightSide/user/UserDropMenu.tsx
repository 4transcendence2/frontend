import { useEffect, useRef, useContext } from "react";
import { ProfileContext } from "hooks/context/ProfileContext";
import { useOper, onProfile } from "hooks/useOper";
import { RoomIdContext } from "hooks/context/RoomIdContext";
import * as S from "./style";

export default function UserDropMenu(props: {
  onClose: () => void;
  targetUser: string;
  targetOper?: string;
  targetMuted?: boolean;
  myOper?: string;
}) {
  const setProfileUser = useContext(ProfileContext);
  const roomId = useContext(RoomIdContext);
  const dropRef: React.RefObject<HTMLDivElement> = useRef(null);
  const onAppointAdmin = useOper("appointAdmin", roomId, props.targetUser, props.onClose);
  const onMute = useOper("mute", roomId, props.targetUser, props.onClose);
  const onKick = useOper("kick", roomId, props.targetUser, props.onClose);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (dropRef.current && e.target instanceof Element && !dropRef.current.contains(e.target))
        props.onClose();
    };

    window.addEventListener("mousedown", handleClick);
    return () => {
      window.removeEventListener("mousedown", handleClick);
    };
  }, [dropRef]);

  return (
    <>
      <S.DropModalOverlay />
      <S.DropMenuLayout ref={dropRef}>
        <S.DropMenuItemBox
          onClick={() => {
            setProfileUser && onProfile(props.targetUser, setProfileUser, props.onClose);
          }}
        >
          프로필
        </S.DropMenuItemBox>
        <S.DropMenuItemBox>DM 보내기</S.DropMenuItemBox>
        <S.DropMenuItemBox>게임 신청</S.DropMenuItemBox>
        {(props.myOper === "owner" ||
          (props.myOper === "admin" &&
            props.targetOper !== "admin" &&
            props.targetOper !== "owner")) && (
          <>
            {/* TODO: isMuted 테스트 더 필요 */}
            {props.targetMuted ? (
              <S.DropMenuItemBox disabled={true}>음소거중</S.DropMenuItemBox>
            ) : (
              <S.DropMenuItemBox onClick={onMute}>음소거</S.DropMenuItemBox>
            )}
            <S.DropMenuItemBox onClick={onKick}>내보내기</S.DropMenuItemBox>
            <S.DropMenuItemBox>입장 금지</S.DropMenuItemBox>
          </>
        )}
        {props.myOper === "owner" &&
          (props.targetOper === "admin" ? (
            // TODO: 부방장 해제
            <S.DropMenuItemBox onClick={() => alert("부방장 해제 콜!")}>
              부방장 해제
            </S.DropMenuItemBox>
          ) : (
            <S.DropMenuItemBox onClick={onAppointAdmin}>부방장 지정</S.DropMenuItemBox>
          ))}
      </S.DropMenuLayout>
    </>
  );
}
