import Grid from '@material-ui/core/Grid'
import IconButton from '@material-ui/core/IconButton'
import Typography from '@material-ui/core/Typography'
import makeStyles from '@material-ui/core/styles/makeStyles'
import ChevronLeftOutlinedIcon from '@material-ui/icons/ChevronLeftOutlined'
import ChevronRightOutlinedIcon from '@material-ui/icons/ChevronRightOutlined'
import React from 'react'

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: {
    width: 'auto',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 10,
    alignItems: 'center',
  },
  select: {
    border: '1px solid',
  },
}))

export default function Pagination(props) {
  const classes = useStyles()
  const {
    totalResults,
    limit,
    currentPage,
    onClickPrevious,
    onClickNext,
    hasPrevPage,
    hasNextPage,
  } = props
  const end = currentPage + limit - 1

  return (
    <Grid
      style={{
        display: 'flex',
        justifyContent: 'flex-end',
        flex: 1,
        height: 48,
      }}
    >
      <Grid className={classes.root}>
        <Typography>
          {totalResults === 0 ? 0 : currentPage}-
          {end > totalResults ? totalResults : end} of {totalResults}
        </Typography>
        <IconButton
          onClick={onClickPrevious}
          disabled={!hasPrevPage}
          aria-label='previous'
        >
          <ChevronLeftOutlinedIcon />
        </IconButton>
        <IconButton
          disabled={!hasNextPage}
          onClick={onClickNext}
          aria-label='next'
        >
          <ChevronRightOutlinedIcon />
        </IconButton>
      </Grid>
    </Grid>
  )
}
