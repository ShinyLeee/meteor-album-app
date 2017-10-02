import { Meteor } from 'meteor/meteor';
import axios from 'axios';
import PropTypes from 'prop-types';
import moment from 'moment';
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { withStyles } from 'material-ui/styles';
import { CircularProgress } from 'material-ui/Progress';
import Dialog, { DialogContent } from 'material-ui/Dialog';
import { incView } from '/imports/api/images/methods.js';
import { zoomerClose, snackBarOpen } from '../../redux/actions';
import ZoomerInner from './components/ZoomerInner';
import {
  Wrapper,
  InfoHeader,
  InfoNumer,
  StyledHeartIcon,
  StyledEyeIcon,
  StyledCameraIcon,
  ExifLoader,
  ExifInfo,
} from './ZoomerHolder.style.js';

const domain = Meteor.settings.public.imageDomain;

class ZoomerHolder extends Component {
  static propTypes = {
    image: PropTypes.object.isRequired,
    classes: PropTypes.object.isRequired,
    snackBarOpen: PropTypes.func.isRequired,
    zoomerClose: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props);
    this._clientWidth = document.body.clientWidth;
    this._pixelRatio = window.devicePixelRatio;
    this.state = {
      infoDialog: false,
      exifDialog: false,
      isLoading: false,
      exif: {},
    };
  }

  componentDidMount() {
    // in mobile we need do more to disable scroll
    document.body.addEventListener('touchmove', this.disableMobileScroll);

    const { image } = this.props;
    incView.call({ imageIds: [image._id] });
  }

  componentWillUnmount() {
    document.body.removeEventListener('touchmove', this.disableMobileScroll);
  }

  get imgSrc() {
    const { image } = this.props;
    return `${domain}/${image.user}/${image.collection}/${image.name}.${image.type}`;
  }

  disableMobileScroll(e) {
    e.preventDefault(e);
  }

  _handleCloseZoomer = () => {
    document.body.style.overflow = '';
    this.props.zoomerClose();
  }

  _handleAccessUser = () => {
    this.props.history.push(`/user/${this.props.image.user}`);
  }

  _handleGetInfo = () => {
    this.setState({ infoDialog: true });
  }

  _handleGetExif = () => {
    if (this.props.image.type !== 'jpg') {
      this.props.snackBarOpen('只有JPG图片存有EXIF信息');
      return;
    }
    if (Object.keys(this.state.exif).length !== 0) {
      this.setState({ exifDialog: true });
      return;
    }
    this.setState({ exifDialog: true, isLoading: true });
    axios({
      method: 'GET',
      url: `${this.imgSrc}?exif`,
    })
    .then(({ data }) => {
      // console.log(data);
      this.setState({ exif: data, isLoading: false });
    })
    .catch((err) => {
      console.log(err);
      this.setState({ isLoading: false });
      this.props.snackBarOpen(`获取EXIF信息失败, ${err}`);
    });
  }

  render() {
    const { image, classes } = this.props;
    const { exif } = this.state;

    const imgSrc = this.imgSrc;
    const realDimension = Math.round(this._clientWidth * this._pixelRatio);
    const preSrc = `${imgSrc}?imageView2/2/w/${realDimension}`;
    const trueSrc = `${imgSrc}?imageView2/3/w/${realDimension}`;
    // double quote for special character see: https://www.w3.org/TR/CSS2/syndata.html#value-def-uri
    const imageHolderStyle = { backgroundImage: `url("${trueSrc}"),url("${preSrc}")` };
    return (
      <Wrapper>
        <ZoomerInner
          image={image}
          imageHolderStyle={imageHolderStyle}
          onLogoClick={this._handleCloseZoomer}
          onAvatarClick={this._handleAccessUser}
          onInfoActionClick={this._handleGetInfo}
          onExifActionClick={this._handleGetExif}
        />
        <Dialog
          classes={{ paper: classes.dialog }}
          open={this.state.infoDialog}
          onRequestClose={() => this.setState({ infoDialog: false })}
        >
          <DialogContent>
            <div>
              <InfoHeader><StyledHeartIcon />喜欢</InfoHeader>
              <InfoNumer>{image.liker.length}</InfoNumer>
            </div>
            <div>
              <InfoHeader><StyledEyeIcon />浏览</InfoHeader>
              {/* +1 because this component did not subscribe */}
              <InfoNumer>{(image.view && image.view + 1) || 1}</InfoNumer>
            </div>
            <div>
              <InfoHeader><StyledCameraIcon />所属相册</InfoHeader>
              <InfoNumer>{image.collection}</InfoNumer>
            </div>
          </DialogContent>
        </Dialog>
        <Dialog
          classes={{ paper: classes.dialog }}
          open={this.state.exifDialog}
          onRequestClose={() => this.setState({ exifDialog: false })}
        >
          <DialogContent>
            {
              this.state.isLoading
              ? (
                <ExifLoader>
                  <CircularProgress size={30} />
                  <span>加载中</span>
                </ExifLoader>
              )
              : (
                <div>
                  <ExifInfo>
                    <span>制造厂商：</span>{(exif.Make && exif.Make.val) || '--'}
                  </ExifInfo>
                  <ExifInfo>
                    <span>相机型号：</span>{(exif.Model && exif.Model.val) || '--'}
                  </ExifInfo>
                  <ExifInfo>
                    <span>处理软件：</span>{(exif.Software && exif.Software.val) || '--'}
                  </ExifInfo>
                  <ExifInfo>
                    <span>曝光时间：</span>{(exif.ExposureTime && exif.ExposureTime.val) || '--'}
                  </ExifInfo>
                  <ExifInfo>
                    <span>镜头焦距：</span>{(exif.FocalLength && exif.FocalLength.val) || '--'}
                  </ExifInfo>
                  <ExifInfo>
                    <span>拍摄时间：</span>{(exif.DateTimeOriginal && exif.DateTimeOriginal.val) || '--'}
                  </ExifInfo>
                  <ExifInfo>
                    <span>修改时间：</span>{(exif.DateTime && exif.DateTime.val) || '--'}
                  </ExifInfo>
                  <ExifInfo>
                    <span>上传时间：</span>{moment(image.createdAt).format('YYYY:MM:DD HH:mm:ss')}
                  </ExifInfo>
                  <ExifInfo>
                    <span>图像尺寸：</span>
                    {`${(exif.PixelXDimension && exif.PixelXDimension.val) || '-'} × ${(exif.PixelYDimension && exif.PixelYDimension.val) || '-'}`}
                  </ExifInfo>
                </div>
              )
            }
          </DialogContent>
        </Dialog>
      </Wrapper>
    );
  }
}

const mapDispatchToProps = (dispatch) => bindActionCreators({
  snackBarOpen,
  zoomerClose,
}, dispatch);

const styles = {
  dialog: {
    width: '75%',
  },


};

export default withRouter(
  connect(null, mapDispatchToProps)(
    withStyles(styles)(ZoomerHolder)
  )
);
