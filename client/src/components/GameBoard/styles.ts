import styled from 'styled-components'

const ActionButtons = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  margin-top: 20px;
`

const StyledButton = styled.button`
  margin-right: 10px;
`

const GameBoardContainer = styled.div`
  display: flex;
  height: 350px;
  flex-direction: column;
  align-items: center;
`

const Hand = styled.div`
  display: flex;
`
const Scoreboard = styled.div`
  width: 200px;
  height: 200px;
  position: absolute;
  top: 0;
  right: 0;
  margin-top: 30px;
  margin-right: 30px;
`

export { ActionButtons, GameBoardContainer, Hand, StyledButton, Scoreboard }
