import { Codes } from '/imports/api/codes/code.js';

const isCodeExist = Codes.find().count();
if (isCodeExist === 0) {
  Codes.insert({ no: '59920944', isUsed: false });
  Codes.insert({ no: '94420599', isUsed: false });
  Codes.insert({ no: '15967425826', isUsed: false });
  Codes.insert({ no: '13429373356', isUsed: false });
}

