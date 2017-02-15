import { Meteor } from 'meteor/meteor';
import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import moment from 'moment';
import CircularProgress from 'material-ui/CircularProgress';
import Dialog from 'material-ui/Dialog';
import HeartIcon from 'material-ui/svg-icons/action/favorite';
import EyeIcon from 'material-ui/svg-icons/action/visibility';
import CameraIcon from 'material-ui/svg-icons/image/camera';
import { incView } from '/imports/api/images/methods.js';
import { zoomerClose, snackBarOpen } from '../../redux/actions/index.js';
import ZoomerInner from './components/ZoomerInner/ZoomerInner.jsx';

const styles = {
  infoDialogIconStyle: {
    marginRight: '8px',
    color: '#999',
    verticalAlign: 'bottom',
  },
  infoHead: {
    margin: '6px 0',
    fontSize: '14px',
  },
  infoText: {
    marginLeft: '2px',
    fontWeight: 700,
    fontSize: '28px',
    color: '#222',
  },
};

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

    incView.call({ imageId: image._id }, (err) => err && console.log(err)); // eslint-disable-line no-console
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
    const { image, clientWidth } = this.props;
    const { exif } = this.state;

    const imgSrc = this.imgSrc;
    const slimSrc1 = `${imgSrc}?imageView2/2/w/${clientWidth * 2}`;
    const slimSrc2 = `${imgSrc}?imageView2/1/w/${clientWidth * 2}`;
    // double quote for special character see: https://www.w3.org/TR/CSS2/syndata.html#value-def-uri
    const imageHolderStyle = { backgroundImage: `url("${slimSrc2}"),url("${slimSrc1}")` };
    return (
      <div className="component__ZoomerHolder">
        <ZoomerInner
          image={image}
          imageHolderStyle={imageHolderStyle}
          onLogoClick={this.handleCloseZoomer}
          onInfoActionClick={this.handleGetInfo}
          onExifActionClick={this.handleGetExif}
        />
        <Dialog
          className="ZoomerHolder__infoDialog"
          open={this.state.infoDialog}
          onRequestClose={() => this.setState({ infoDialog: false })}
        >
          <div className="infoDialog__info">
            <div className="info__likes">
              <h4 style={styles.infoHead}><HeartIcon style={styles.infoDialogIconStyle} />喜欢</h4>
              <span style={styles.infoText}>{image.liker.length}</span>
            </div>
            <div className="info__view">
              <h4 style={styles.infoHead}><EyeIcon style={styles.infoDialogIconStyle} />浏览</h4>
              <span style={styles.infoText}>{image.view || 0}</span>
            </div>
            <div className="info__collection">
              <h4 style={styles.infoHead}><CameraIcon style={styles.infoDialogIconStyle} />所属相册</h4>
              <span style={styles.infoText}>{image.collection}</span>
            </div>
          </div>
        </Dialog>
        <Dialog
          className="ZoomerHolder__exifDialog"
          open={this.state.exifDialog}
          onRequestClose={() => this.setState({ exifDialog: false })}
          autoScrollBodyContent
        >
          { this.state.isLoading
            ? (
              <div className="exifDialog__loader">
                <CircularProgress
                  color="#3F51B5"
                  size={30}
                  thickness={2.5}
                />
                <span>加载中</span>
              </div>
            )
          : (
            <div className="exifDialog__exif">
              <div className="exif__info">
                <span>制造厂商：</span>{(exif.Make && exif.Make.val) || '--'}
              </div>
              <div className="exif__info">
                <span>相机型号：</span>{(exif.Model && exif.Model.val) || '--'}
              </div>
              <div className="exif__info">
                <span>处理软件：</span>{(exif.Software && exif.Software.val) || '--'}
              </div>
              <div className="exif__info">
                <span>曝光时间：</span>{(exif.ExposureTime && exif.ExposureTime.val) || '--'}
              </div>
              <div className="exif__info">
                <span>镜头焦距：</span>{(exif.FocalLength && exif.FocalLength.val) || '--'}
              </div>
              <div className="exif__info">
                <span>拍摄时间：</span>{(exif.DateTimeOriginal && exif.DateTimeOriginal.val) || '--'}
              </div>
              <div className="exif__info">
                <span>修改时间：</span>{(exif.DateTime && exif.DateTime.val) || '--'}
              </div>
              <div className="exif__info">
                <span>上传时间：</span>{moment(image.createdAt).format('YYYY:MM:DD HH:mm:ss')}
              </div>
              <div className="exif__info">
                <span>图像尺寸：</span>
                {`${(exif.PixelXDimension && exif.PixelXDimension.val) || '-'} × ${(exif.PixelYDimension && exif.PixelYDimension.val) || '-'}`}
              </div>
            </div>
            )
          }
        </Dialog>
      </div>
    );
  }
}

ZoomerHolder.displayName = 'ZoomerHolder';

ZoomerHolder.defaultProps = {
  domain: Meteor.settings.public.imageDomain,
  clientWidth: document.body.clientWidth,
};

ZoomerHolder.propTypes = {
  domain: PropTypes.string.isRequired,
  clientWidth: PropTypes.number.isRequired,
  image: PropTypes.object.isRequired,
  // Below Pass from Redux
  snackBarOpen: PropTypes.func.isRequired,
  zoomerClose: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => state;

const mapDispatchToProps = (dispatch) => bindActionCreators({
  snackBarOpen,
  zoomerClose,
}, dispatch);


export default connect(mapStateToProps, mapDispatchToProps)(ZoomerHolder);
