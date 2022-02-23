import React, { useState, useRef,useContext} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton'
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'
import CardMedia from '@material-ui/core/CardMedia'
import Modal from '@material-ui/core/Modal'
import TextField from '@material-ui/core/TextField';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Avatar from '@material-ui/core/Avatar';
import QuestionAvatar from '../../assets/checkbox/questionAvatar.svg';
import EditIcon from '../../assets/checkbox/editIcon.svg';
import icons1 from '../../assets/postCategories/bulbIcon.svg';
import icons2 from '../../assets/postCategories/birthdayIcon.svg';
import icons3 from '../../assets/postCategories/calendarIcon.svg';
import icons4 from '../../assets/postCategories/newsIcon.svg';
import CameraAltOutlinedIcon from '@material-ui/icons/CameraAltOutlined';
import { AlertNotificationContext } from '../../elements/alert-notfication/alertState';
import { KeyboardDatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import moment from 'moment-mini';
import DateFnUtils from '@date-io/date-fns';
import { useParams } from 'react-router'
import ImageCropColorPalletModel from '../../containers/posts/pendingPosts/imageCrop&ColorPalletModel';
import PageSelectionModel from '../../containers/posts/pendingPosts/pageSelectModel';
import PostTypeSelectionModle from '../../containers/posts/pendingPosts/postTypeSelection';
import ButtonWithLoader from '../../elements/buttonWithLoader';
import { DateConverter } from '../../elements/dateConverter';
import * as postActions from '../../actions/postAction'
import * as pageAction from '../../actions/pageAction'

import '../post/post.css';
import '../../containers/posts/pendingPosts/style.css'

const styles = makeStyles(() => ({
  input: {
    '&::placeholder': {
      color: 'rgba(255,255,255,10)',
      font: 'normal normal 23px/29px "Lexend Deca", sans-serif',
      lineHeight: 'initial',
      alignItems: 'center',
      display: 'flex',
      justifyContent: 'center',
      textAlign: 'center',
    },
  },
}));



function EditPublishedPost(props) {
  const dispatch = useDispatch();
const classes = styles();
  const { open, handleClose, previousBtnHandler, nextBtnHandler, row: state } = props;
  const { setAlert } = useContext(AlertNotificationContext);
    const { id } = useParams()
   const inputRef = useRef();
   const textInput = useRef();
   const [loading, setLoading] = useState(false);
   const [handleFocused, setHandleFocused] = useState(false);
   const [row, setRow] = useState(state);
   const [postText] = useState(row?.text);
   const [postImage, setPostImage] = useState('');
   const [openImageModel, setOpenImageModel] = useState(false);
   const [openPageModel, setOpenPageModel] = useState(false);
   const [openTypeModel, setOpenTypeModel] = useState(false);
   const [openDateModel, setOpenDateModel] = useState(false);
     const currentPage = useSelector(
    (state) => state.page.publishedPagePostsCurrentPage
  )
    const filter = useSelector((state) => state.filter)


   const postTypeText = (key) => {
    switch(key) {
    case 'fact':
        return 'Fact'
    case 'onBirthday':
        return 'Birthday'
    case 'inNews':
        return 'In the news'
    case 'onThisDay':
        return 'On this day'
    default:
        return 'Fact'
}
}

    const handleImage = async (data) => {
    if (!row?.text) {
      setAlert('warning', 'Please enter a text before adding the image');
      return;
    }
    if (data?.size > 5000000) {
      setAlert('warning', 'Image size must be less than 5MB');
      return;
    }
    if (data?.type === 'image/png' || data?.type === 'image/jpeg' || data?.type === 'image/webp') {
      setPostImage(data);
    //   setSelectedPost(row);
      setOpenImageModel(true);
    } else {
      setAlert('warning', 'Upload only images on png or jpeg or webp format');
    }
  };

    const openImageSelect = () => {
    if (!row?.text) {
      setAlert('warning', 'Please enter a text before adding the image.');
    } else {
      inputRef.current.click();
    }
  };

    const handleImageUpdate = (id, body, approve) => {
        setRow({
            ...row,
            image: body.image
        })
        setOpenImageModel(false)
  };

  const handlePageUpdate = (id, body, published, data) => {
      setRow({
          ...row,
          postPage: data
      });
      setOpenPageModel(false);
  }

  const handlePostTypeUpdate = (id, data) => {
       setRow({
          ...row,
          postType: data?.postType,
          dob: null,
          thisDayDate: null
      });
      setOpenTypeModel(false)
  }

  const handleSave = () => {
  if(row?.postType === 'onBirthday' && !row?.dob) {
    setAlert('error', 'Please add birthday before saving.');
    return;
  }
    if(row?.postType === 'onThisDay' && !row?.thisDayDate) {
    setAlert('error', 'Please add on this day before saving.');
    return;
  }
  setLoading(true);
  let body = {
    text: row?.text,
    image: row?.image,
    postType: row?.postType,
    dob: row?.postType === 'onBirthday' ? row?.dob : null,
    thisDayDate: row?.postType === 'onThisDay' ? row?.thisDayDate : null,
    postPage: row?.postPage?._id
  }
  dispatch(postActions.editPublishedPost(row?._id, body, refresh))
  }

  const refresh = (status) => {
  setLoading(false);
  if(status === 'success') {
  setAlert('success', 'Post details updated successfully');
  if(window.location.pathname === '/admin/posts/published') {
  dispatch(postActions.updatePublishedPostList(row?._id, row, 'posts'));
  }
  else {
     let body = ''
    if (filter.pagePosts.contributor) {
      body = body.concat(`createdBy=${filter.pagePosts.contributor}&`)
    }
    if (filter.pagePosts.postType) {
      if (filter.pagePosts.postType?.fact) {
        body = body.concat(`postType=fact&`)
      }
      if (filter.pagePosts.postType?.birthday) {
        body = body.concat(`postType=onBirthday&`)
      }
      if (filter.pagePosts.postType?.onTheDay) {
        body = body.concat(`postType=onThisDay&`)
      }
      if (filter.pagePosts.postType?.inTheNews) {
        body = body.concat(`postType=inNews&`)
      }
    }
    if (filter.pagePosts.date.startDate || filter.pagePosts.date.endDate) {
      if (filter.pagePosts.date?.startDate) {
        body = body.concat(
          `createdAt[gte]=${moment(filter.pagePosts.date?.startDate).format(
            'YYYY-MM-DD'
          )}&`
        )
      }
      if (filter.pagePosts.date?.endDate) {
        body = body.concat(
          `createdAt[lte]=${moment(filter.pagePosts.date?.endDate).format(
            'YYYY-MM-DD'
          )}&`
        )
      }
    }
    dispatch(pageAction.filterPagePosts(null, id, 12, currentPage,body));
  }
}
else {
   setAlert('error', 'Something went wrong. Please try again later.');
}
  handleClose();
  }

     const ModalFooter = () => {
         return (
        <Grid item md={12} xs={12}>
          <Grid container spacing={2} justifyContent="flex-start" alignItems="center" style={{borderBottom: '1px solid #E3E5E8'}}>
     
            <Grid item md={6} xs={6} style={{ borderRight: '1px solid #E3E5E8' }}>
              <Grid container justifyContent="flex-start" alignItems="center" style={{ position: 'relative' }}>
                <Grid item className="pending-post-user-detail-image-div">
                  <Avatar src={row?.postPage?.image || QuestionAvatar} loading="lazy" style={{ height: '32px', width: '32px' }} />
                </Grid>
                <Grid item>
                  <Typography className="pending-post-user-label">Posted on</Typography>
                  <Typography className="pending-post-user-name" title={row?.postPage?.title || ''}>{row?.postPage?.title || 'Unassigned'}</Typography>
                </Grid>
                <Grid item style={{ position: 'absolute', right: '5px' }}>
                <IconButton size="small" onClick={() => {setOpenPageModel(true)}}><img src={EditIcon} loading="lazy" alt="Edit" style={{ height: '14px', width: '14px' }} /></IconButton>
                </Grid>
              </Grid>
            </Grid>
            <Grid item md={6} xs={6}>
              <Grid container justifyContent="flex-start" alignItems="center" style={{ position: 'relative' }}>
                <Grid item className="pending-post-user-detail-image-div">
                  <Avatar src={row?.postType === 'fact' ? icons1 : row?.postType === 'onBirthday' ? icons2 : row?.postType === 'onThisDay' ? icons3 : row?.postType === 'inNews' ? icons4 : ''} loading="lazy" style={{ height: 'auto', width: 'auto' }} />
                </Grid>
                <Grid item>
                  <Typography className="pending-post-user-label">Post Type</Typography>
                  <Typography className="pending-post-user-name" title={row?.postType || ''}>{postTypeText(row?.postType)}</Typography>
                </Grid>
                <Grid item style={{ position: 'absolute', right: '5px' }}>
                    <IconButton size="small" onClick={() => {setOpenTypeModel(true)}}><img src={EditIcon} loading="lazy" alt="Edit" style={{ height: '14px', width: '14px' }} /></IconButton>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
            <Grid container justifyContent="flex-end" alignItems="center" style={{padding: '20px 20px 0px 20px'}}>
            <div onMouseEnter={() => {
              textInput?.current?.blur();
            }}>
          <ButtonWithLoader variant="outlined" onClick={handleClose} color="primary" className="page-select-model-footer-btn" style={{marginRight: 10}}>Cancel</ButtonWithLoader>
          <ButtonWithLoader
            disabled={loading}
            loading={loading}
            variant="contained"
            color="primary"
            className="page-select-model-footer-btn"
            onClick={handleSave}
          >
            Update
          </ButtonWithLoader>
        </div>
            </Grid>
        </Grid>
         )
     }


  return (
    <>
      <Modal
        open={open}
        onClose={() => {}}
        aria-labelledby='modal-modal-title'
        aria-describedby='modal-modal-description'
        style={{overflowY: 'auto'}}
      >
        <Card className='modal-card-block' style={{height: 'auto', overflowX: 'hidden', overflowY: 'auto'}} >
          <Box>
            <div className='postImg-block'>
            <div
              style={{
                padding: '10px 10px',
                display: 'flex',
                alignItems: 'center',
                position: 'absolute',
                background: 'rgba(28, 33, 33, 0.2)',
                width: '100%',
              }}
            >
              <div className='postImg-div'>
                <CardMedia
                  component='img'
                  image={row?.createdBy?.profileImage}
                  alt='Contributor'
                  className='contributor-profile'
                />
              </div>
              <CardContent style={{ padding: '0' }} className='contributorName'>
                <Typography variant='h5'>
                  {row?.createdBy?.name} <span className='betweenText'>on</span>{' '}
                  <span className='pageTitle-name'>{row?.postPage?.title}</span>
                  {/* <span className='post-content' style={{ fontFamily: 'Lexend Deca' }}>{row?.text}</span> */}
                </Typography>
                <IconButton onClick={handleClose} size="small" style={{position: 'absolute', right: 5, top: 12, zIndex: 100 }}><CloseIcon style={{ color: 'white' }} /></IconButton>
              </CardContent>
            </div>
              <img
                src={row?.image}
                alt='post'
                style={{aspectRatio: '3/4', width:'100%'}}
              />
              {/* <img src={Dummy} alt="post image" style={{ width: '520px', height: '390px' }} /> */}
              <div className='postTest'>
                <Grid item md={12} xs={12} style={{ textAlign: 'right', margin: '60px 10px 0px 0px' }}>
              <input
                style={{ display: 'none' }}
                id={`profile-image${row?._id}`}
                type="file"
                accept=".jpeg, .png, .webp"
                disabled={!row?.text}
                onChange={(e) => handleImage(e.target.files[0])}
                ref={inputRef}
                onClick={(e) => {
                  e.target.value = '';
                }}
              />
              <label
                htmlFor={`profile-image${row?._id}`}
                style={{
                  width: '100%',
                  cursor: 'pointer',
                }}
              >
                <IconButton onClick={openImageSelect} size="small" style={{ backgroundColor: 'rgba(0,0,0,0.5)', color: '#FFFFFF', padding: '10px' }}>
                  <CameraAltOutlinedIcon style={{ height: '16px', width: '15px' }} />
                </IconButton>
              </label>
            </Grid>
                <div component='div' className='post-content' style={{ fontFamily: 'Poppins' }}>
                  {/* {row?.text} */}
                    <TextField
                    inputRef={textInput}
                    value={row?.text}
                    maxLength={125}
                    multiline
                    rows={3}
                    fullWidth
                    InputProps={{
                      disableUnderline: true,
                      classes: { input: classes.input },
                      // endAdornment: <InputAdornment position="end" style={{ display: (updateLoading && postKey === selectedPost?._id) ? '' : 'none' }}><CircularProgress size={20} /></InputAdornment>
                    }}
                    inputProps={{
                      min: 0,
                      max: 125,
                      style: {
                        textAlign: 'center',
                        color: '#FFF',
                        font: 'normal normal 18px/22px "Lexend Deca", sans-serif',
                        lineHeight: 'initial',
                        alignItems: 'center',
                        display: 'flex',
                        border: handleFocused ? '1px solid #EF613B' : '',
                        padding: '10px',
                      },
                    }}
                    onFocus={(e) => { setHandleFocused(true); e.target.placeholder = ''; }}
                    onBlur={(e) => {
                      setHandleFocused(false);
                      e.target.placeholder = 'Tap to type your fact max length 125 characters';
                      if (!row?.text) {
                        setRow({
                            ...row,
                            text: postText
                        });
                        return;
                      }
    
                    }}
                    placeholder="Tap to type your fact max length 125 characters"
                    onChange={(e) => e?.target?.value?.length < 126 && setRow({...row, text: e.target.value.trimLeft()})}
                  />
                     <Grid item md={12} xs={12} style={{ textAlign: 'center', display: (row?.postType === 'onThisDay' || row?.postType === 'onBirthday') ? '' : 'none' }}>
                  <Typography className="pending-post-dob-text" onClick={(e) => { e.preventDefault(); setOpenDateModel(true); }}>{row?.postType === 'onThisDay' ? (row?.thisDayDate ? DateConverter(row?.thisDayDate) : 'Add On this day') : row?.postType === 'onBirthday' ? (row?.dob ? DateConverter(row?.dob) : 'Add Birthday') : ''}</Typography>
                </Grid>
                </div>
              </div>
            </div>
            <div style={{margin: '20px 0', width: '100%'}}>
               <ModalFooter />
            </div>
          </Box>

        </Card>
      </Modal>
        {openImageModel ? (
          <ImageCropColorPalletModel
            openCropModel={openImageModel}
            selectedImage={postImage}
            setSelectedImage={setPostImage}
            closePalletModel={() => {
              setOpenImageModel(false);
            //   setSelectedPost('');
            }}
            handleUpdateData={handleImageUpdate}
            handleStep1Back={() => { setOpenImageModel(false); inputRef.current.click(); }}
            postDetails={row}
          />
        ) : ''}
        {openPageModel ? (
          <PageSelectionModel
            postKey={row?._id}
            postFullDetails={row}
            openPageModel={openPageModel}
            handleClosePageModel={() => {
              setOpenPageModel(false);
            //   setSelectedPost('');
            }}
            // postTypeComponent={postTypeComponent}
            handleUpdateData={handlePageUpdate}
            pageSelected={row?.postPage}
          />
        ) : ''}
        {openTypeModel  ? (
          <PostTypeSelectionModle
            postKey={row?._id}
            postFullDetails={row}
            openTypeModel={openTypeModel}
            handleCloseTypeModel={() => {
              setOpenTypeModel(false);
            //   setSelectedPost('');
            }}
            // postTypeComponent={postTypeComponent}
            handleUpdateData={handlePostTypeUpdate}
          />
        ) : null}
             <MuiPickersUtilsProvider utils={DateFnUtils} style={{ display: 'none' }}>
          <KeyboardDatePicker
            value={(row?.postType === 'onThisDay' && row?.thisDayDate) || (row?.postType === 'onBirthday' && row?.dob)}
            open={openDateModel}
            format="dd / MM / yyyy"
            onChange={(value) => {
            //   setDob(value);
              if (+new Date(value) !== +new Date(row?.dob)) {
                if (row?.postType === 'onThisDay') {
                  setRow({...row, thisDayDate: moment(value).format('YYYY-MM-DD') });
                } else {
                  setRow({...row, dob: moment(value).format('YYYY-MM-DD') });
                }
              }
              setOpenDateModel(true);
            }}
            maxDate={new Date()}
            KeyboardButtonProps={{
              'aria-label': 'change date',
            }}
            onClose={() => setOpenDateModel(false)}
            InputProps={{
              style: {
                display: 'none',
              },
            }}
          />
        </MuiPickersUtilsProvider>
    </>
  );
}

export default EditPublishedPost;
