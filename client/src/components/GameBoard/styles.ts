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
  height: 285px;
  flex-direction: column;
  align-items: center;
`

const Hand = styled.div`
  display: flex;
`

export { ActionButtons, GameBoardContainer, Hand, StyledButton }
