import styled from "@emotion/styled"
import * as font from "@style/font"
import { blue } from "@style/color"

export const MainLayout = styled.div`
  height: calc(100% - 40px);

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`

export const H1 = styled.h1`
  ${font.h1};
  margin: 70px;
`

export const TextBold = styled.p`
  ${font.body};
  font-weight: 600;
`

export const TextBox = styled.div`
  display: flex;
  flex-direction: column;
  padding: 15px 0;

  border-top: 1px solid;
  border-bottom: 1px solid;
`

export const Text = styled.p`
  display: inline;
  ${font.body};
  margin: 5px;
  ${(props: { featured?: boolean }) => {
    return props.featured ? `color: ${blue}; font-weight: 600;` : ""
  }}
`
