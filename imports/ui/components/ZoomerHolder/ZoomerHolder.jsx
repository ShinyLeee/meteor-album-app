import { Meteor } from 'meteor/meteor';
import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import moment from 'moment';
import CircularProgress from 'material-ui/CircularProgress';
import Dialog from 'material-ui/Dialog';
import { incView } from '/imports/api/images/methods.js';
import { zoomerClose, snackBarOpen } from '../../redux/actions/index.js';
import ZoomerInner from './components/ZoomerInner/ZoomerInner.jsx';
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

class ZoomerHolder extends Component {

  constructor(props) {
    super(props);
    this.state = {
      infoDialog: false,
      exifDialog: false,
      isLoading: false,
      exif: {},
    };
    this.handleCloseZoomer = this.handleCloseZoomer.bind(this);
    this.handleGetInfo = this.handleGetInfo.bind(this);
    this.handleGetExif = this.handleGetExif.bind(this);
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
    const { domain, image } = this.props;
    return `${domain}/${image.user}/${image.collection}/${image.name}.${image.type}`;
  }

  disableMobileScroll(e) {
    e.preventDefault(e);
  }

  handleCloseZoomer() {
    document.body.style.overflow = '';
    this.props.zoomerClose();
  }

  handleGetInfo() {
    this.setState({ infoDialog: true });
  }

  handleGetExif() {
    if (this.props.image.type !== 'jpg') {
      this.props.snackBarOpen('只有JPG图片存有EXIF信息');
      return;
    }
    if (Object.keys(this.state.exif).length !== 0) {
      this.setState({ exifDialog: true });
      return;
    }
    this.setState({ exifDialog: true, isLoading: true });
    const imgSrc = this.imgSrc;
    $.ajax({
      method: 'get',
      url: `${imgSrc}?exif`,
    })
    .done((res) => {
      // console.log(res);
      this.setState({ exif: res, isLoading: false });
    })
    .fail((err) => {
      this.setState({ isLoading: false });
      this.props.snackBarOpen(`获取EXIF信息失败, ${err.responseJSON.error}`);
      console.log(err); // eslint-disable-line no-console
      throw new Meteor.Error(err);
    });
  }

  render() {
    const { image, clientWidth, devicePixelRatio } = this.props;
    const { exif } = this.state;

    const imgSrc = this.imgSrc;
    const realDimension = Math.round(clientWidth * devicePixelRatio);
    const preSrc = `${imgSrc}?imageView2/2/w/${realDimension}`;
    const trueSrc = `${imgSrc}?imageView2/3/w/${realDimension}`;
    // double quote for special character see: https://www.w3.org/TR/CSS2/syndata.html#value-def-uri
    const imageHolderStyle = { backgroundImage: `url("${trueSrc}"),url("${preSrc}")` };
    return (
      <Wrapper>
        <ZoomerInner
          image={image}
          imageHolderStyle={imageHolderStyle}
          onLogoClick={this.handleCloseZoomer}
          onInfoActionClick={this.handleGetInfo}
          onExifActionClick={this.handleGetExif}
        />
        <Dialog
          open={this.state.infoDialog}
          onRequestClose={() => this.setState({ infoDialog: false })}
        >
          <div>
            <div>
              <InfoHeader><StyledHeartIcon style={{ color: '#999' }} />喜欢</InfoHeader>
              {/* +1 because this component did not subscribe */}
              <InfoNumer>{image.liker.length + 1}</InfoNumer>
            </div>
            <div>
              <InfoHeader><StyledEyeIcon style={{ color: '#999' }} />浏览</InfoHeader>
              <InfoNumer>{image.view || 0}</InfoNumer>
            </div>
            <div>
              <InfoHeader><StyledCameraIcon style={{ color: '#999' }} />所属相册</InfoHeader>
              <InfoNumer>{image.collection}</InfoNumer>
            </div>
          </div>
        </Dialog>
        <Dialog
          open={this.state.exifDialog}
          onRequestClose={() => this.setState({ exifDialog: false })}
          autoScrollBodyContent
        >
          { this.state.isLoading
            ? (
              <ExifLoader>
                <CircularProgress
                  color="#3F51B5"
                  size={30}
                  thickness={2.5}
                />
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
        </Dialog>
      </Wrapper>
    );
  }
}

ZoomerHolder.displayName = 'ZoomerHolder';

ZoomerHolder.defaultProps = {
  domain: Meteor.settings.public.imageDomain,
  clientWidth: document.body.clientWidth,
  devicePixelRatio: window.devicePixelRatio,
};

ZoomerHolder.propTypes = {
  domain: PropTypes.string.isRequired,
  clientWidth: PropTypes.number.isRequired,
  devicePixelRatio: PropTypes.number.isRequired,
  image: PropTypes.object.isRequired,
  // Below Pass from Redux
  snackBarOpen: PropTypes.func.isRequired,
  zoomerClose: PropTypes.func.isRequired,
};

const mapDispatchToProps = (dispatch) => bindActionCreators({
  snackBarOpen,
  zoomerClose,
}, dispatch);


export default connect(null, mapDispatchToProps)(ZoomerHolder);
