import React, { useState, useEffect, useRef } from 'react'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContent from '@material-ui/core/DialogContent'
import DialogActions from '@material-ui/core/DialogActions'
import FormControl from '@material-ui/core/FormControl'
import Box from '@material-ui/core/Box';
import Card from '@material-ui/core/Card';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton'
import CloseIcon from '@material-ui/icons/Close'
import { COLORS } from '../constants/color'
import { IMAGES } from '../assets'
import { useDispatch, useSelector } from 'react-redux'
import * as categoryActions from '../actions/categoryAction'
import * as pageActions from '../actions/pageAction'
import { useStyles } from './EditStyles'
import ImageCropper from './Cropper'

function Edit({ page, isEdit, editClose, onEdit }) {
  const dispatch = useDispatch()
  const fileRef = useRef()
  const categoryList = useSelector((state) => state.category.categoryList)
  const subCategoryList = useSelector((state) => state.category.subCategoryList)
  const [state, setState] = React.useState({
    title: page?.title,
    category: page?.category?._id,
    image: page?.image,
    description: page?.description,
    subCategory: page?.subCategory?._id || '',
  })

  const [categoryLoader, setCategoryLoader] = useState(true)
  const [subCategoryLoader, setSubCategoryLoader] = useState(true)
  const classes = useStyles()

  useEffect(() => {
    // API Call for Categories here
    dispatch(categoryActions.getCategories(() => setCategoryLoader(false)))
    dispatch(
      categoryActions.getSubCategories(state.category, () =>
        setSubCategoryLoader(false)
      )
    )
  }, [state.category])

  const handleChangeCategory = (e) => {
    setState({ ...state, category: e.target.value })
    if(e.target.value !== page?.category?._id) {
      setState({...state, category: e.target.value, subCategory: null})
    } else {
      setState({...state, category: e.target.value, subCategory: page?.subCategory?._id})
    }
  }

  const handleChangeSubCategory = (e) => {
    setState({ ...state, subCategory: e.target.value })
  }

  const handleChange = (key) => (e) => {
    setState({ ...state, [key]: e.target.value })
  }

  const handleImageUpload = (file) => {
    if (file) dispatch(categoryActions.uploadImage(file, handleImage, 'page'))
  }
  const handleImageChange = async (croppedFile) => {
    handleImageUpload(croppedFile)
    // console.log('RESIA:', resultData?.data?.data?.s3url);
    // setCompletedCrop(resultData?.data?.data?.s3url);
  }

  const handleImage = (data) => {
    setState({ ...state, image: data?.s3url })
  }
  const RenderImageSelect = (handleClick) => {
    return (
      <>
        {/* <TextField
          accept='image/*'
          className={classes.input}
          id='contained_button_file'
          type='file'
          onChange={handleClick}
        /> */}
        <InputLabel className={classes.label} onClick={handleClick}>
          <Card className={classes.image}>
            <span
              className={classes.imageSrc}
              style={{
                backgroundImage: `url(${state.image})`,
              }}
            />
            <span className={classes.imageBackdrop} />
            <span className={classes.imageBtn}>
              <img
                src={IMAGES.CAMERA_ICON}
                alt='Camera Icon'
                style={{ marginBottom: 8 }}
              />
            </span>
          </Card>
        </InputLabel>
      </>
    )
  }

  return (
    <div>
      <Dialog
        onClose={editClose}
        aria-labelledby='customized-dialog-title'
        open={isEdit}
      >
        <DialogTitle
          id='customized-dialog-title'
          onClose={editClose}
          style={{ paddingTop: '4px', paddingBottom: '4px' }}
          // style={{ width: 450 }}
        >
          <Box
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Typography
              variant='subtitle2'
              style={{ fontWeight: 600, color: COLORS.TEXT }}
            >
              Edit Page Details
            </Typography>
            <IconButton onClick={editClose}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent dividers>
          <Box
            style={{
              width: '400px',
              backgroundColor: 'white',
              margin: '16px 8px',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <Box display='flex' justifyContent='center'>
              <TextField
                accept='image/*'
                className={classes.input}
                id='contained_button_file'
                type='file'
                onChange={handleImageUpload}
              />
              {/* <InputLabel
                htmlFor='contained_button_file'
                className={classes.label}
              >
                <Card className={classes.image}>
                  <span
                    className={classes.imageSrc}
                    style={{
                      backgroundImage: `url(${state.image})`,
                    }}
                  />
                  <span className={classes.imageBackdrop} />
                  <span className={classes.imageButton}>
                    <img
                      src={IMAGES.CAMERA_ICON}
                      alt='Camera Icon'
                      style={{ marginBottom: 8 }}
                    />
                  </span>
                </Card>
              </InputLabel> */}
              <ImageCropper
                fileRef={fileRef}
                onChange={handleImageChange}
                outputOptions={{ minWidth: 400, minHeight: 400 }}
                previewOptions={{ width: 400, height: 400 }}
                buttonStyle={{
                  width: 190,
                  height: 30,
                  margin: 30,
                  backgroundColor: 'white',
                  border: '1px solid #ccc',
                  // display: 'none',
                }}
                buttonText='Upload Image'
                customComponent={RenderImageSelect}
              />
            </Box>
            <Typography
              gutterBottom
              variant='body1'
              style={{ fontWeight: 600, color: COLORS.TEXT, marginTop: 15 }}
            >
              Page name
            </Typography>
            <TextField
              variant='outlined'
              fullWidth
              value={state.title}
              onChange={handleChange('title')}
              className={classes.fields}
              InputProps={{
                className: classes.fields,
              }}
              inputProps={{
                maxLength: 50
              }}
              style={{ color: COLORS.GRAY_BLACK }}
            />
            <Typography
              gutterBottom
              style={{ fontWeight: 600, color: COLORS.TEXT, marginTop: 15 }}
            >
              About
            </Typography>
            <TextField
              variant='outlined'
              fullWidth
              value={state.description}
              onChange={handleChange('description')}
              className={classes.fields}
              style={{ color: COLORS.GRAY_BLACK }}
              InputProps={{
                className: classes.fields,
                boxShadow: 'none',
              }}
              inputProps={{
                maxLength: 100
              }}
            />
            <Box display='flex' justifyContent='space-between'>
              <Box>
                <Typography
                  gutterBottom
                  variant='body1'
                  style={{ fontWeight: 600, color: COLORS.TEXT, marginTop: 15 }}
                >
                  Category
                </Typography>
                <FormControl variant='outlined' className={classes.formControl}>
                  <Select
                    value={state.category}
                    onChange={handleChangeCategory}
                    className={classes.select}
                  >
                    {categoryList.map((item) => (
                      <MenuItem value={item._id} key={item._id}>
                        {item.title}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
              <Box>
                <Typography
                  gutterBottom
                  variant='body1'
                  style={{ fontWeight: 600, color: COLORS.TEXT, marginTop: 15 }}
                >
                  Subcategory
                </Typography>
                <FormControl variant='outlined' className={classes.formControl}>
                  <Select
                    value={state.subCategory}
                    onChange={handleChangeSubCategory}
                    className={classes.select}
                  >
                    {subCategoryList === null ? (
                      <MenuItem value={''}>select</MenuItem>
                    ) : (
                      subCategoryList?.map((item) => (
                        <MenuItem value={item._id} key={item._id}>
                          {item.title}
                        </MenuItem>
                      ))
                    )}
                  </Select>
                </FormControl>
              </Box>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={editClose}
            color='primary'
            variant='outlined'
            style={{ fontSize: 16, textTransform: 'capitalize' }}
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              if(state.subCategory === "") {
                onEdit(page._id, { ...state, subCategory: null })
              } else {
                onEdit(page._id, { ...state })
              }
              if(state?.title && state?.description) {
                editClose()
              }
            }}
            color='primary'
            variant='contained'
            style={{ fontSize: 16, textTransform: 'capitalize' }}
            disabled= {!state?.title || !state?.description}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

export default Edit
