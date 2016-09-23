import { Meteor } from 'meteor/meteor';
import React, { Component, PropTypes } from 'react';

// JS Plugin
import '/public/js/plupload.full.min';
import '/public/js/qiniu';

// Utils or Libs
import utils from '../../utils/utils.js';
import { displayAlert } from '../lib/displayAlert.js';

export default class Upload extends Component {

  constructor(props) {
    super(props);
    this.state = {
      name: 'Upload',
    };
  }

  componentDidMount() {
    // TODO MAKE PURE COMPONENT
    const uploader = Qiniu.uploader({
      runtimes: 'html5,flash,html4',      // 上传模式,依次退化
      browse_button: 'pickfiles',         // 上传选择的点选按钮，**必需**
      // 在初始化时，uptoken, uptoken_url, uptoken_func 三个参数中必须有一个被设置
      // 切如果提供了多个，其优先级为 uptoken > uptoken_url > uptoken_func
      // 其中 uptoken 是直接提供上传凭证，uptoken_url 是提供了获取上传凭证的地址，如果需要定制获取 uptoken 的过程则可以设置 uptoken_func
      // uptoken: '<Your upload token>', // uptoken 是上传凭证，由其他程序生成
      uptoken_url: 'api/uptoken',       // Ajax 请求 uptoken 的 Url，**强烈建议设置**（服务端提供）
      // uptoken_func: () => {         // 在需要获取 uptoken 时，该方法会被调用
      //   // do something
      // },
      get_new_uptoken: false,             // 设置上传文件的时候是否每次都重新获取新的 uptoken
      // downtoken_url: '/downtoken',
      // Ajax请求downToken的Url,私有空间时使用,
      // JS-SDK 将向该地址POST文件的key和domain,服务端返回的JSON必须包含`url`字段,`url`值为该文件的下载地址
      // unique_names: true, 默认 false，key 为文件名。若开启该选项，JS-SDK 会为每个文件自动生成key（文件名）
      // save_key: true,   默认 false.若在服务端生成 uptoken 的上传策略中指定了 `sava_key`,则开启,SDK在前端将不对key进行任何处理
      domain: 'http://o97tuh0p2.bkt.clouddn.com/', // bucket 域名，下载资源时用到，**必需**
      container: 'upload-container',     // 上传区域 DOM ID，默认是 browser_button 的父元素，
      max_file_size: '12mb',             // 最大文件体积限制
      flash_swf_url: '/public/js/Moxie.swf',  // 引入 flash,相对路径
      max_retries: 3,                     // 上传失败最大重试次数
      dragdrop: true,                     // 开启可拖曳上传
      drop_element: 'upload-container',   // 拖曳上传区域元素的 ID，拖曳文件或文件夹后可触发上传
      chunk_size: '4mb',                  // 分块上传时，每块的体积
      auto_start: false,                  // 选择文件后自动上传，若关闭需要自己绑定事件触发上传,
      // x_vars : {
      //    自定义变量，参考http://developer.qiniu.com/docs/v6/api/overview/up/response/vars.html
      //    'time' : function(up,file) {
      //        var time = (new Date()).getTime();
                // do something with 'time'
      //        return time;
      //    },
      //    'size' : function(up,file) {
      //        var size = file.size;
                // do something with 'size'
      //        return size;
      //    }
      // },
      init: {
        // PostInit: () => {
        // document.getElementById('filelist').innerHTML = '';
        // },
        FilesAdded: (up, files) => {
          const $filelist = $('#filelist');
          // const $pickfiles = $('#pickfiles');

          if (!utils.browser.mobile) {
            displayAlert('warning', 'PC端暂不支持上传图片');
            return;
          }

          if (utils.browser.mobile && files.length > 1) {
            displayAlert('warning', '手机端不支持批量上传,如需批量上传请使用PC端');
            return;
          }

          // TODO for multiple upload;
          // $pickfiles.next().css({ width: 0, height: 0 });
          // $pickfiles.next().remove().prependTo($('.upload-holder')).clone(true);
          // $pickfiles.remove().prependTo($('.upload-holder')).clone(true);
          $('#upload-container').css('background', 'none');

          plupload.each(files, (file) => {
            // 文件添加进队列后,处理相关的事情
            const item = $('<li></li>').appendTo($filelist);
            const imageHolder = $(`<a id=${file.id} class="upload-imageHolder"></a>`);
            const image = $(new Image()).appendTo(imageHolder);
            imageHolder.appendTo(item);
            // Create an instance of the mOxie Image object. This
            // utility object provides several means of reading in
            // and loading image data from various sources.
            // --
            // Wiki: https://github.com/moxiecode/moxie/wiki/Image
            const preloader = new mOxie.Image();
            // Define the onload BEFORE you execute the load()
            // command as load() does not execute async.
            preloader.onload = () => {
              // This will scale the image (in memory) before it
              // tries to render it. This just reduces the amount
              // of Base64 data that needs to be rendered.
              preloader.downsize(350, 350);
              // Now that the image is preloaded, grab the Base64
              // encoded data URL. This will show the image
              // without making an Network request using the
              // client-side file binary.
              image.prop('src', preloader.getAsDataURL());
              // NOTE: These previews "work" in the FLASH runtime.
              // But, they look seriously junky-to-the-monkey.
              // Looks like they are only using like 256 colors.
            };
            // Calling the .getSource() on the file will return an
            // instance of mOxie.File, which is a unified file
            // wrapper that can be used across the various runtimes.
            // --
            // Wiki: https://github.com/moxiecode/plupload/wiki/File
            preloader.load(file.getSource());
          });
          $('#upload').on('click', () => { uploader.start(); return; });
          // Bind Cancel DOM Click Event to remove All files from the Queue
          // Then Refresh the Uploader Instance
          $('#cancel').on('click', () => { uploader.splice(); uploader.refresh(); return; });
        },
        // BeforeUpload: (up, file) => {
        //   // 每个文件上传前,处理相关的事情
        // console.log(up, file);
        // },
        UploadProgress: (up, file) => {
          // 每个文件上传时,处理相关的事情
          console.log(file.percent);
        },
        FileUploaded: (up, file, info) => {
          // 每个文件上传成功后,处理相关的事情
          // 其中 info 是文件上传成功后，服务端返回的json，形式如
          // {
          //    "hash": "Fh8xVqod2MQ1mocfI4S4KpRL6D98",
          //    "key": "gogopher.jpg"
          //  }
          // 参考http://developer.qiniu.com/docs/v6/api/overview/up/response/simple-response.html
          const domain = up.getOption('domain');
          const res = JSON.parse(info);
          const sourceLink = domain + res.key;
          const detailObj = {
            id: file.id,
            name: file.name,
            size: Math.floor(file.origSize / 1024),
            type: file.type,
            speed: file.speed,
            status: file.status,
            response: res,
          };
          const imgObj = {
            name: document.getElementById('caption').value,
            tag: document.getElementById('tag').value,
            url: sourceLink,
            detail: detailObj,
            createdAt: new Date(),
          };
          // $(`#${file.id}`).prop('href', sourceLink);

          Meteor.call('images:insert', imgObj);
        },
        FilesRemoved: () => {
          displayAlert('success', '删除成功');
        },
        Error: (up, err) => {
          displayAlert('error', `${err.message} ${err.code}`);
          console.error(err); // TODO LOG
        },
        UploadComplete: () => {
          // 队列文件处理完毕后,处理相关的事情
          window.location.replace('/upload');
          displayAlert('success', '上传成功');
        },
        Key: (up, file) => {
          // 若想在前端对每个文件的key进行个性化处理，可以配置该函数
          // 该配置必须要在 unique_names: false , save_key: false 时才生效
          const key = `vivian/assets/${file.name}`;
          return key;
        },
      },
    });

    // domain 为七牛空间（bucket)对应的域名，选择某个空间后，可通过"空间设置->基本设置->域名设置"查看获取
    // uploader 为一个 plupload 对象，继承了所有 plupload 的方法，参考http://plupload.com/docs
  }

  handleReset() {
    document.getElementById('filelist').innerHTML = '';
    $('.upload-holder')
    .find(':input')
    .not(':button, :submit, :reset')
    .val('')
    .removeAttr('checked')
    .removeAttr('selected');
    $('#upload-container').css('background', 'transparent url(http://odsiu8xnd.bkt.clouddn.com/vivian/add-upload.svg) no-repeat center center');
  }

  render() {
    return (
      <div className="content">
        <div className="upload-holder">
          <div className="upload-drop">
            <div id="upload-container" className="upload-drop-box">
              <div id="filelist" />
              <button id="pickfiles" type="button">继续添加图片</button>
            </div>
            <input
              accept="image/*"
              type="file"
              style={{ opacity: 0 }}
              multiple
              required
            />
            <p className="text-right">
              <small className="drop-error pull-left" />
              <small>只接受.jpg文件，且大小不得超过4MB</small>
            </p>
            <div id="preview" />
          </div>
          <div className="upload-filelist" />
          <div className="upload-field">
            <div className="field field-caption">
              <label htmlFor="caption">图片名</label>
              <input id="caption" className="form-control" type="text" name="caption" required />
            </div>
            <div className="field field-tag">
              <label htmlFor="tag">标签</label>
              <input id="tag" className="form-control" type="text" name="tag" required />
            </div>
            <div className="field field-action">
              <button
                id="upload"
                type="submit"
                className="field-action-button field-action-submit"
              >
                <i className="fa fa-cloud-upload" />确认上传
              </button>
              <button
                id="cancel"
                type="reset"
                className="field-action-button field-action-reset"
                onClick={this.handleReset}
              >撤销</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

}

Upload.propTypes = {
  size: PropTypes.number,
  style: PropTypes.object,
};
