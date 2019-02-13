import { connect } from 'react-redux'
import { compose, prop as extract } from 'ramda'
import { Board } from '~/components'
import { setLineup, setNext, setMovable } from '~/actions/ingame'
import {
  getMovableTiles,
  getDirection,
  excludeBlock,
  computeSpecial
} from '~/chess/core'
import { getSpecial, parseSelected } from '~/chess/helpers'
import { RANKS, FILES } from '~/chess/constants'
import { isExist } from '~/utils'

function mapStateToProps ({ general, ingame }) {
  const { isMatching } = general
  const { present } = ingame
  const { turn, lineup, selected, movableAxis } = present
  const {
    piece: selectedPiece,
    side: selectedSide,
    file: selectedFile,
    rank: selectedRank
  } = parseSelected(selected, lineup)
  const selecteSpecial = getSpecial(selectedPiece) || []
  let nextMovable

  if (isExist(movableAxis)) {
    if (isExist(selecteSpecial)) {
      const tile = `${selectedFile}${selectedRank}`

      nextMovable = compose(
        extract('movable'),
        computeSpecial(selectedSide, selecteSpecial, tile, lineup),
        getMovableTiles // TODO: remove this
      )(movableAxis)
    } else {
      nextMovable = compose(
        excludeBlock(turn, lineup),
        getDirection
      )(movableAxis)
    }
  }

  return {
    isMatching,
    turn,
    selectedPiece,
    selectedSide,
    selectedFile,
    selectedRank,
    lineup,
    ranks: RANKS,
    files: FILES,
    movableTiles: nextMovable
  }
}

const mapDispatchToProps = {
  setLineup,
  setMovable,
  setNext
}

const BoardContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Board)

export default BoardContainer
