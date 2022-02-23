import React, {
  useState, useEffect, useRef, useContext,
} from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import TextField from '@material-ui/core/TextField';
import IconButton from '@material-ui/core/IconButton';
import Avatar from '@material-ui/core/Avatar';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import moment from 'moment-mini';
import CameraAltOutlinedIcon from '@material-ui/icons/CameraAltOutlined';
import DateFnUtils from '@date-io/date-fns';
import { KeyboardDatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import CheckIcon from '@material-ui/icons/Check';
import CloseIcon from '@material-ui/icons/Close';
import { useDispatch, useSelector } from 'react-redux';
import unCheckImage from '../../../assets/checkbox/checkUn.svg';
import CheckBoxIcon from '../../../assets/checkbox/checkbox.svg';
import QuestionAvatar from '../../../assets/checkbox/questionAvatar.svg';
import EditIcon from '../../../assets/checkbox/editIcon.svg';
import { DateConverter } from '../../../elements/dateConverter';
import PageSelectionModel from './pageSelectModel';
import ImageCropColorPalletModel from './imageCrop&ColorPalletModel';
import { AlertNotificationContext } from '../../../elements/alert-notfication/alertState';
import ConfirmDialog from '../../../elements/confirmModel';
import * as pendingPostAction from '../../../actions/pendingPostAction';
import ButtonWithLoader from '../../../elements/buttonWithLoader';
import { SELECTED_PENDING_POSTS } from '../../../actions/types';
import './style.css';
import PostTypeSelectionModle from './postTypeSelection';
import icons1 from '../../../assets/postCategories/bulbIcon.svg';
import icons2 from '../../../assets/postCategories/birthdayIcon.svg';
import icons3 from '../../../assets/postCategories/calendarIcon.svg';
import icons4 from '../../../assets/postCategories/newsIcon.svg';

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

const PendingPostCard = ({ cardDetails, postKey, postTypeComponent }) => {
  const inputRef = useRef();
  const dispatch = useDispatch();
  const classes = styles();
  const confirmModelLoading = useSelector((state) => state?.pendingPosts?.postApproveRejectLoading);
  const { setAlert } = useContext(AlertNotificationContext);
  const [postImage, setPostImage] = useState('');
  const [postText, setPostText] = useState('');
  const [dob, setDob] = useState(null);
  const [selectedPost, setSelectedPost] = useState('');
  const currentPageNo = useSelector((state) => state?.pendingPosts?.currentPageNo);
  const [handleFocused, setHandleFocused] = useState(false);
  const [openDateModel, setOpenDateModel] = useState(false);
  const [openPageModel, setOpenPageModel] = useState(false);
  const [openTypeModel, setOpenTypeModel] = useState(false);
  const [openImageModel, setOpenImageModel] = useState(false);
  const [openConfirmModel, setOpenConfirmModel] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const postSelectedList = useSelector((state) => state?.pendingPosts?.selectedPendingPosts);
  const updateLoading = useSelector((state) => state?.pendingPosts?.updatePostLoading);
  const postFilter = useSelector((state) => state?.filter?.postPublished);

  useEffect(() => {
    setPostText(cardDetails?.text);
    if (cardDetails?.postType === 'onThisDay') {
      setDob(cardDetails?.thisDayDate ? new Date(cardDetails?.thisDayDate) : null);
    } else if (cardDetails?.postType === 'onBirthday') {
      setDob(cardDetails?.dob ? new Date(cardDetails?.dob) : null);
    }
  }, [cardDetails]);

  const handleImage = async (data) => {
    if (!postText) {
      setAlert('warning', 'Please enter a text before adding the image');
      return;
    }
    if (data?.size > 5000000) {
      setAlert('warning', 'Image size must be less than 5MB');
      return;
    }
    if (data?.type === 'image/png' || data?.type === 'image/jpeg' || data?.type === 'image/webp') {
      setPostImage(data);
      setSelectedPost(cardDetails);
      setOpenImageModel(true);
    } else {
      setAlert('warning', 'Upload only images on png or jpeg or webp format');
    }
  };

  const handleUpdatePage = () => {
    setOpenPageModel(true);
    setSelectedPost(cardDetails);
  };

  const handleUpdateType = () => {
    setOpenTypeModel(true);
    setSelectedPost(cardDetails);
  }

  const openImageSelect = () => {
    if (!postText) {
      setAlert('warning', 'Please enter a text before adding the image.');
    } else {
      inputRef.current.click();
    }
  };

  const handleCallBack = (status) => {
    setOpenConfirmModel(false);
    setIsLoading(false);
    setOpenDateModel(false);
    dispatch(pendingPostAction.getPendingUnAssignedPostList(postTypeComponent, currentPageNo, setAlert, postFilter));
    if (status !== 'NoClear') {
      setSelectedPost('');
      dispatch({ type: SELECTED_PENDING_POSTS, payload: [] });
    }
  };

  const handleValidation = (type) => {
    if (!cardDetails?.text) {
      setAlert('warning', `Please enter the text before ${type}`);
      return false;
    }
    if (!cardDetails?.postPage) {
      setAlert('warning', `Please Select Page before ${type}`);
      return false;
    }
    if (cardDetails?.postType === 'onThisDay' && !cardDetails?.thisDayDate) {
      setAlert('warning', `Please Enter On this Day Date to ${type}`);
      return false;
    }
    if(cardDetails?.postType === 'onBirthday' && !cardDetails?.dob) {
      setAlert('warning', `Please Enter DOB to ${type}`);
      return false;
    }
    return true;
  };

  const handleApproveReject = (type, status) => {
    if ((type === 'approve' && !status && handleValidation(type)) || (type === 'reject') || status === 'noValidation') {
      const data = {
        post: [cardDetails?._id],
      };
      if (type === 'approve') {
        setIsLoading(true);
      }
      dispatch(pendingPostAction.handlePostApprovieReject(type, data, setAlert, handleCallBack));
    }
  };

  const handleRecordSelect = (id) => {
    const currentIndex = postSelectedList.indexOf(id);
    const newChecked = [...postSelectedList];
    if (currentIndex === -1) {
      newChecked.push(id);
    } else {
      newChecked.splice(currentIndex, 1);
    }
    dispatch({ type: SELECTED_PENDING_POSTS, payload: newChecked });
  };

  const handelUpdate = (id, body, approve) => {
    dispatch(pendingPostAction.updatePostDetails(id, body, setAlert, approve ? () => { handleApproveReject('approve', 'noValidation'); setOpenPageModel(false); setSelectedPost(''); setOpenTypeModel(false); } : handleCallBack));
  };

  return (
    <>
      <Grid container spacing={2} className="pending-post-detail-card">
        <Grid item md={12} xs={12}>
          <Grid container spacing={2} justifyContent="flex-start" alignItems="center">
          <Grid item md={12} xs={12} style={{ borderBottom: '1px solid #E3E5E8' }}>
              <Grid container justifyContent="flex-start" alignItems="center">
                <Grid item>
                  <Checkbox
                    style={{ color: '' }}
                    color="primary"
                    onChange={(e) => handleRecordSelect(cardDetails?._id)}
                    checked={postSelectedList?.filter((item) => item === cardDetails?._id)?.length}
                    icon={<img src={unCheckImage} alt="crash" style={{ height: '18px', width: '18px' }} />}
                    checkedIcon={<img src={CheckBoxIcon} alt="crash" color="primary" style={{ height: '18px', width: '18px' }} />}
                  />
                </Grid>
                <Grid item className="pending-post-user-detail-image-div">
                  <Avatar loading="lazy" src={cardDetails?.createdBy?.profileImage || ''} style={{ height: '32px', width: '32px' }} />
                </Grid>
                <Grid item>
                  <Typography className="pending-post-user-label">Posted by</Typography>
                  <Typography className="pending-post-user-name" title={cardDetails?.createdBy?.name || ''}>{cardDetails?.createdBy?.name || ''}</Typography>
                </Grid>
              </Grid>
            </Grid>
            <Grid item md={6} xs={6}>
              <Grid container justifyContent="flex-start" alignItems="center" style={{ position: 'relative' }}>
                <Grid item className="pending-post-user-detail-image-div">
                  <Avatar src={cardDetails?.postPage?.image || QuestionAvatar} loading="lazy" style={{ height: '32px', width: '32px' }} />
                </Grid>
                <Grid item>
                  <Typography className="pending-post-user-label">Posted on</Typography>
                  <Typography className="pending-post-user-name" title={cardDetails?.postPage?.title || ''}>{cardDetails?.postPage?.title || 'Unassigned'}</Typography>
                </Grid>
                <Grid item style={{ position: 'absolute', right: '5px' }}>
                  {updateLoading && postKey === selectedPost?._id ? (<CircularProgress size={20} />) : (<IconButton size="small" onClick={() => handleUpdatePage()}><img src={EditIcon} loading="lazy" alt="Edit" style={{ height: '14px', width: '14px' }} /></IconButton>)}
                </Grid>
              </Grid>
            </Grid>
            <Grid item md={6} xs={6} style={{ borderLeft: '1px solid #E3E5E8' }}>
              <Grid container justifyContent="flex-start" alignItems="center" style={{ position: 'relative' }}>
                <Grid item className="pending-post-user-detail-image-div">
                  <Avatar src={cardDetails?.postType === 'fact' ? icons1 : cardDetails?.postType === 'onBirthday' ? icons2 : cardDetails?.postType === 'onThisDay' ? icons3 : cardDetails?.postType === 'inNews' ? icons4 : ''} loading="lazy" style={{ height: 'auto', width: 'auto' }} />
                </Grid>
                <Grid item>
                  <Typography className="pending-post-user-label">Post Type</Typography>
                  <Typography className="pending-post-user-name" title={cardDetails?.postType || ''}>{cardDetails?.postType}</Typography>
                </Grid>
                <Grid item style={{ position: 'absolute', right: '5px' }}>
                  {updateLoading && postKey === selectedPost?._id ? (<CircularProgress size={20} />) : (<IconButton size="small" onClick={() => handleUpdateType()}><img src={EditIcon} loading="lazy" alt="Edit" style={{ height: '14px', width: '14px' }} /></IconButton>)}
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Grid
          item
          md={12}
          xs={12}
          className="pending-post-image-div"
          style={{
            backgroundImage: `linear-gradient(359.55deg, #000000 -0.47%, rgba(0, 0, 0, 0.8) 18.05%, rgba(28, 33, 33, 0) 42.51%, rgba(0, 0, 0, 0) 42.51%), url(${typeof cardDetails?.image === 'object' ? URL.createObjectURL(cardDetails?.image) : cardDetails?.image})`,
            backgroundSize: 'cover',
            backgroundPosition: 'bottom, top center',
            backgroundRepeat: 'no-repeat, no-repeat',
          }}
        >
          <Grid container spacing={2} className="pending-post-action-div">
            <Grid item md={12} xs={12} style={{ textAlign: 'right', margin: '10px 10px 0px 0px' }}>
              <input
                style={{ display: 'none' }}
                id={`profile-image${postKey}`}
                type="file"
                accept=".jpeg, .png, .webp"
                disabled={!postText}
                onChange={(e) => handleImage(e.target.files[0])}
                ref={inputRef}
                onClick={(e) => {
                  e.target.value = '';
                }}
              />
              <label
                htmlFor={`profile-image${postKey}`}
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
            <Grid item md={12} xs={12}>
              <Grid container spacing={1} style={{ padding: '10px 30px' }}>
                <Grid item md={12} xs={12}>
                  <TextField
                    value={postText}
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
                    onFocus={(e) => { setHandleFocused(true); e.target.placeholder = ''; setSelectedPost(cardDetails); }}
                    onBlur={(e) => {
                      setHandleFocused(false);
                      e.target.placeholder = 'Tap to type your fact max length 125 characters';
                      if (!postText) {
                        setPostText(cardDetails?.text);
                        return;
                      }
                      if (postText !== cardDetails?.text) {
                        handelUpdate(cardDetails?._id, { text: postText });
                      }
                    }}
                    placeholder="Tap to type your fact max length 125 characters"
                    onChange={(e) => e?.target?.value?.length < 126 && setPostText(e.target.value.trimLeft())}
                  />
                </Grid>
                <Grid item md={12} xs={12} style={{ textAlign: 'center', display: (cardDetails?.postType === 'onThisDay' || cardDetails?.postType === 'onBirthday') ? '' : 'none' }}>
                  <Typography className="pending-post-dob-text" onClick={(e) => { e.preventDefault(); setOpenDateModel(true); }}>{cardDetails?.postType === 'onThisDay' ? (cardDetails?.thisDayDate ? DateConverter(cardDetails?.thisDayDate) : 'Enter Day Date') : cardDetails?.postType === 'onBirthday' ? (cardDetails?.dob ? DateConverter(cardDetails?.dob) : 'Enter DOB') : ''}</Typography>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Grid item md={12} xs={12} className="pending-post-footer-btns">
          <Grid container>
            <Grid item md={postTypeComponent === 'unAssignedPosts' ? 12 : 6} xs={postTypeComponent === 'unAssignedPosts' ? 12 : 6}>
              <Button onClick={() => setOpenConfirmModel(true)} fullWidth style={{ borderRadius: postTypeComponent === 'unAssignedPosts' ? '0px 0px 4px 4px' : '0px 0px 0px 4px', color: '#EF4444' }} variant="contained" className="pending-post-footer-accept-reject-btn">
                <CloseIcon fontSize="small" />
                {' '}
                Reject
              </Button>
            </Grid>
            <Grid item md={6} xs={6} style={{ borderLeft: '1px solid #E3E5E8', display: postTypeComponent !== 'unAssignedPosts' ? '' : 'none' }}>
              <ButtonWithLoader loading={isLoading} disabled={isLoading} onClick={() => handleApproveReject('approve')} fullWidth style={{ borderRadius: '0px 0px 4px 0px', color: '#55A44A' }} variant="contained" className="pending-post-footer-accept-reject-btn">
                <CheckIcon fontSize="small" />
                {' '}
                Approve
              </ButtonWithLoader>
            </Grid>
          </Grid>
        </Grid>
        <MuiPickersUtilsProvider utils={DateFnUtils} style={{ display: 'none' }}>
          <KeyboardDatePicker
            value={dob}
            open={openDateModel}
            format="dd / MM / yyyy"
            onChange={(value) => {
              setDob(value);
              if (+new Date(value) !== +new Date(cardDetails?.dob)) {
                if (cardDetails?.postType === 'onThisDay') {
                  handelUpdate(cardDetails?._id, { thisDayDate: moment(value).format('YYYY-MM-DD') });
                } else {
                  handelUpdate(cardDetails?._id, { dob: moment(value).format('YYYY-MM-DD') });
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
        {openImageModel && postKey === selectedPost?._id ? (
          <ImageCropColorPalletModel
            openCropModel={openImageModel}
            selectedImage={postImage}
            setSelectedImage={setPostImage}
            closePalletModel={() => {
              setOpenImageModel(false);
              setSelectedPost('');
            }}
            handleUpdateData={handelUpdate}
            postTypeComponent={postTypeComponent}
            handleStep1Back={() => { setOpenImageModel(false); inputRef.current.click(); }}
            postDetails={selectedPost}
          />
        ) : null}
        {openPageModel && postKey === selectedPost?._id ? (
          <PageSelectionModel
            postKey={postKey}
            postFullDetails={selectedPost}
            openPageModel={openPageModel}
            handleClosePageModel={() => {
              setOpenPageModel(false);
              setSelectedPost('');
            }}
            postTypeComponent={postTypeComponent}
            handleUpdateData={handelUpdate}
            pageSelected={selectedPost?.postPage}
          />
        ) : null}
        {openTypeModel && postKey === selectedPost?._id ? (
          <PostTypeSelectionModle
            postKey={postKey}
            postFullDetails={selectedPost}
            openTypeModel={openTypeModel}
            handleCloseTypeModel={() => {
              setOpenTypeModel(false);
              setSelectedPost('');
            }}
            postTypeComponent={postTypeComponent}
            handleUpdateData={handelUpdate}
          />
        ) : null}
        {openConfirmModel ? (
          <ConfirmDialog open={openConfirmModel} cancel={() => setOpenConfirmModel(false)} confirm={() => handleApproveReject('reject')} title="Reject" content="Are you sure want to reject the items?" cancelLabel="Cancel" confirmLabel="Confirm Reject" loading={confirmModelLoading} />
        ) : null}
      </Grid>
    </>
  );
};

export default PendingPostCard;
