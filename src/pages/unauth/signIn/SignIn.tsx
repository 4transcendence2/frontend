import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "@hooks/AuthContext";
import * as S from "./style";
import AuthModal from './AuthModal';
import Modal from './Modal';
import * as auth from "api/auth";

type eventChangeType = React.ChangeEvent<HTMLInputElement>;
type eventClickType = React.MouseEvent<HTMLButtonElement>;
type eventFormType = React.FormEvent<HTMLFormElement>;

export default function signIn() {
  const navigate = useNavigate();
  const [idInput, setIdInput] = useState("");
  const [pwInput, setPwInput] = useState("");
  const [formCheck, setFormCheck] = useState("");
  const [showInput, setShowInput] = useState(false);
  const [authInput, setAuthInput] = useState("");

  const authDispatch = useContext(AuthContext)?.authDispatch;

  function onIdHandler(event: eventChangeType) {
    setIdInput(event.target.value);
    if (formCheck) setFormCheck("");
    if (showInput) setShowInput(false);
  }

  function onPwHandler(event: eventChangeType) {
    setPwInput(event.target.value);
    if (formCheck) setFormCheck("");
    if (showInput) setShowInput(false);
  }

  function onAuthHandler(e: eventChangeType) {
    setAuthInput(e.target.value)
  }

  function isComplete(event: eventClickType) {
    event.preventDefault();
    if (idInput && pwInput) {
      authFirstHandler();
    } else {
      if (!idInput) setFormCheck("아이디를 입력해주세요.");
      else if (!pwInput) setFormCheck("패스워드를 입력해주세요.");
    }
  }

  async function authFirstHandler() {
    const body = {
      username: idInput,
      password: pwInput
    }
    const res = await auth.login(body);
    if (res && (res.status === 200 || res.status === 201)) {
      // setShowInput(true) //------------< 2차 인증 건너뜀
      authDispatch &&
        authDispatch({
          type: "signIn",
          username: idInput,
          token: res.data.accessToken,
        });
    } else {
      console.log(res)
      setFormCheck("아이디 또는 패스워드를 확인해주세요.");
    }
  }

  async function sendAuthHandler() {
    const res = await auth.getOtpLogin();
    if (res && (res.status === 200 || res.status === 201)) {
      alert("인증번호가 전송되었습니다.");
      console.log(res);
    } else {
      console.log(res)
    }
  }

  async function authSecondHandler(e: eventFormType) {
    e.preventDefault();
    const res = await auth.checkOtpLogin(authInput);
    if (res && (res.status === 200 || res.status === 201)) {
      alert("로그인되었습니다");
      authDispatch &&
        authDispatch({
          type: "signIn",
          username: idInput,
          token: res.data.accessToken,
        });
    } else {
      console.log(res)
      alert("인증번호가 틀렸습니다. 다시 시도해주세요");
    }
  }
  // ------------------------------- TODO 함수명 수정하기
  return (
    <S.SignInLayout>
      <h1>hello pongpong</h1>
      <form>
        <div>
          <input placeholder="ID" required onChange={onIdHandler}></input>
        </div>
        <div>
          <input placeholder="Password" required onChange={onPwHandler} type="password"></input>
        </div>
        <S.BtnWrapper>
          <button onClick={isComplete}>로그인</button>
          <button
            type="button"
            onClick={() => {
              navigate("/signUp");
            }}
          >
            회원가입
          </button>
        </S.BtnWrapper>
      </form>
      <span>{formCheck}</span>
      {
        showInput &&
        <Modal setView={() => setShowInput(false)}>
          <AuthModal
            sendFirst={sendAuthHandler}
            sendSecond={authSecondHandler}
            auth={onAuthHandler}
            show={setShowInput} />
        </Modal>
      }
    </S.SignInLayout>
  );
}
