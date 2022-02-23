import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import * as postActions from '../../actions/postAction'
import MainContainer from '../../components/utilitiies/MainContainer'
import Pagination from '../../components/utilitiies/Pagination'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableContainer from '@material-ui/core/TableContainer'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Typography from '@material-ui/core/Typography'
import CircularProgress from '@material-ui/core/CircularProgress'
import {
  StyledTableCell,
  useStyles,
} from '../../components/utilitiies/StyledTable'
import PublishedPostItem from '../../components/post/PublishedPostItem'
import moment from 'moment-mini'

export default function PublishedPosts() {
  const dispatch = useDispatch()
  const classes = useStyles()
  const filter = useSelector((state) => state.filter)
  const publishedPosts = useSelector((state) => state.post.publishedPostList)
  const currentPage = useSelector(
    (state) => state.post.publishedPostCurrentPage
  )

  const [pageLoader, setPageLoader] = useState(true)
  const [limit, setLimit] = useState(12)
  // const [currentPage, setCurrentPage] = useState(
  //   useSelector((state) => state.post.publishedPostCurrentPage),
  // );

  const setCurrentPage = (page) => {
    dispatch(postActions.setPublishedPostCurrentPage(page))
  }

  useEffect(() => {
    setPageLoader(true)
    let body = ''
    if (filter.postPublished.page) {
      body = body.concat(`postPage=${filter.postPublished.page}&`)
    }
    if (filter.postPublished.contributor) {
      body = body.concat(`createdBy=${filter.postPublished.contributor}&`)
    }
    if (filter.postPublished.postType) {
      if (filter.postPublished.postType?.fact) {
        body = body.concat(`postType=fact&`)
      }
      if (filter.postPublished.postType?.birthday) {
        body = body.concat(`postType=onBirthday&`)
      }
      if (filter.postPublished.postType?.onTheDay) {
        body = body.concat(`postType=onThisDay&`)
      }
      if (filter.postPublished.postType?.inTheNews) {
        body = body.concat(`postType=inNews&`)
      }
    }
    if (
      filter.postPublished.date.startDate ||
      filter.postPublished.date.endDate
    ) {
      if (filter.postPublished.date?.startDate) {
        body = body.concat(
          `createdAt[gte]=${moment(filter.postPublished.date?.startDate).format(
            'YYYY-MM-DD'
          )}&`
        )
      }
      if (filter.postPublished.date?.endDate) {
        body = body.concat(
          `createdAt[lte]=${moment(filter.postPublished.date?.endDate).format(
            'YYYY-MM-DD'
          )}&`
        )
      }
    }

    dispatch(
      postActions.filterPublishedPost(
        () => setPageLoader(false),
        limit,
        currentPage,
        body
      )
    )
  }, [
    currentPage,
    filter.postPublished.page,
    filter.postPublished.contributor,
    filter.postPublished.postType,
    filter.postPublished.date,
  ])


  return (
    <MainContainer
      footer={
        !pageLoader && publishedPosts?.results?.length !== 0 && (
          <Pagination
            limit={limit}
            totalResults={publishedPosts?.totalResults}
            totalPages={publishedPosts?.totalPages}
            currentPage={publishedPosts?.pagingCounter}
            onClickPrevious={() => setCurrentPage(publishedPosts?.prevPage)}
            onClickNext={() => setCurrentPage(publishedPosts?.nextPage)}
            hasPrevPage={publishedPosts?.hasPrevPage}
            hasNextPage={publishedPosts?.hasNextPage}
          />
        )
      }
    >
      {
        publishedPosts?.results?.length !== 0 ? <TableContainer
        className='published-posts-table'
        style={{
          borderRadius: '10px',
          border: '1px solid #EDEDED',
          background: '#FFFF',
        }}
      >
        <Table className={classes.table} aria-label='customized table'>
          <TableHead>
            <TableRow>
              <StyledTableCell style={{ width: '30%' }}>Post Contents</StyledTableCell>
              <StyledTableCell>Page</StyledTableCell>
              <StyledTableCell>Contributor</StyledTableCell>
              <StyledTableCell>Post Type</StyledTableCell>
              <StyledTableCell>Date posted</StyledTableCell>
              <StyledTableCell>Likes</StyledTableCell>
              <StyledTableCell>Comments</StyledTableCell>
              {/* <StyledTableCell></StyledTableCell> */}
            </TableRow>
          </TableHead>
          <TableBody>
            {pageLoader ? (
              <CircularProgress
                size={32}
                color='primary'
                className='loaderClass'
              />
            ) : (
              publishedPosts?.results &&
              publishedPosts?.results?.map((row, index) => {
                return (
                  <PublishedPostItem
                    row={row}
                    key={row.id}
                    id={row.id}
                    index={index}
                  />
                )
              })
            )}
          </TableBody>
        </Table>
      </TableContainer> : <Typography variant="h4" style={{ textAlign: 'center', marginTop: '20px', backgroundColor: 'white', padding: '20px', borderRadius: '20px' }}>Records not found</Typography> 
      }
    </MainContainer>
  )
}
