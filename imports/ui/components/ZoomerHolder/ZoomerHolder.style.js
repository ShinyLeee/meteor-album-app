import styled from 'styled-components';
import HeartIcon from 'material-ui/svg-icons/action/favorite';
import EyeIcon from 'material-ui/svg-icons/action/visibility';
import CameraIcon from 'material-ui/svg-icons/image/camera';

export const Wrapper = styled.div`
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: 1200;
`;

export const Inner = styled.div`
  width: 100%;
  height: 100%;
`;

export const ZoomerImage = styled.div`
  width: 100%;
  height: 100%;
  background-color: #68655B;
  background-size: cover;
  background-position: 50%;
  z-index: 9998;
  cursor: zoom-out;
`;

export const ZoomerBackground = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  background: transparent;
  background: linear-gradient(180deg,rgba(0,0,0,.25) 0,transparent 20%,transparent 60%,rgba(0,0,0,.3));
`;

export const ToolBoxSection = styled.section`
  position: fixed;
  top: 0;
  width: 100%;
  padding: 0 12px 5px;
  color: #fff;
  z-index: 9999;
  cursor: default;
`;

export const ActionSection = styled.section`
  position: fixed;
  bottom: 0;
  width: 100%;
  padding: 25px 12px 5px;
  color: #fff;
  z-index: 9999;
  cursor: default;
  & > div:first-child { float: left; }
  & > div:last-child { float: right; }
`;

export const UserAvatar = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 16px;
  background-color: rgb(188, 188, 188);
`;

export const ImageDetail = styled.div`
  display: inline-block;
  vertical-align: top;
  white-space: normal;
  & > span:first-child {
    display: block;
    fontSize: 15px;
  }
  & > span:last-child {
    display: block;
    fontSize: 14px;
  }
`;

export const InfoHeader = styled.h4`
  margin: 6px 0;
  fontSize: 14px;
`;

export const InfoNumer = styled.span`
  marginLeft: 2px;
  fontWeight: 700;
  fontSize: 28px;
  color: #222;
`;

export const StyledHeartIcon = styled(HeartIcon)`
  marginRight: 8px;
  verticalAlign: bottom;
`;

export const StyledEyeIcon = styled(EyeIcon)`
  marginRight: 8px;
  verticalAlign: bottom;
`;

export const StyledCameraIcon = styled(CameraIcon)`
  marginRight: 8px;
  verticalAlign: bottom;
`;

export const ExifLoader = styled.div`
  text-align: center;
  & > div {
    vertical-align: bottom;
  }
  & > span {
    margin-left: 12px;
  }
`;

export const ExifInfo = styled.div`
  margin-bottom: 8px;
  & > span {
    color: #111;
  }
`;
