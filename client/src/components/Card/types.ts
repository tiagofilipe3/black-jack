type TCardProps = {
  card: TCard
}

type TCard = {
  rank: string
  suit: string
  hidden?: boolean
}

export type { TCardProps, TCard }
