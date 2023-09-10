import { StyledCard } from './styles'
import { TCardProps } from './types.ts'

const Card = ({ card }: TCardProps) => {
  return (
    <StyledCard>
      {card.hidden ? 'Hidden' : `${card.rank} of ${card.suit}`}
    </StyledCard>
  )
}

export default Card
