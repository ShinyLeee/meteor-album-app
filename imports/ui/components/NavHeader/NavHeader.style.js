import { purple500 } from 'material-ui/styles/colors';

export default {
  AppBar: {
    position: 'fixed',
    top: 0,
    backgroundColor: purple500,
  },
  AppBarTitle: {
    fontSize: '20px',
    fontFamily: 'Microsoft Yahei',
    cursor: 'pointer',
  },
  AppBarIconElementRight: {
    marginTop: 0,
    marginRight: 0,
  },
  AppBarIcon: {
    top: '4px',
  },
  AppBarIconSvg: {
    width: '28px',
    height: '28px',
    color: '#fff',
  },
  AppBarIconBtnForAvatar: {
    left: '10px',
    top: '8px',
    padding: 0,
  },
  AppBarIconBtnForLogin: {
    top: '8px',
    marginRight: '12px',
  },
  AppBarLoginBtn: {
    margin: '12px 0 0 0',
    color: '#fff',
  },
  SearchBarHolder: {
    width: '100%',
    height: '40px',
    fontSize: '18px',
    borderRdius: '3px',
  },
  SearchBarInput: {
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(255,255,255,.15)',
    border: 'none',
    padding: '0 12px',
    fontSize: '16px',
    color: '#fff',
  },
};
