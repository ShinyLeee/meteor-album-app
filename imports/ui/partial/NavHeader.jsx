import React, { Component } from 'react';

export default class NavHeader extends Component {

  constructor(props) {
    super(props);

    this.state = {
      location: 'index',
      authenticated: true,
    };
  }

  render() {
    return (
      <div className="nav-header">
        <button className="nav-header-submit pull-left" type="submit">
          发布图片
        </button>
        <a className="nav-header-logo" href="/">
          <img src="/img/logo.png" alt="logo" />
        </a>
        <a className="nav-header-user pull-right">
          <img src="https://images.unsplash.com/placeholder-avatars/extra-large.jpg?ixlib=rb-0.3.5&q=80&fm=jpg&crop=faces&cs=tinysrgb&fit=crop&h=64&w=64&s=356bd4b76a3d4eb97d63f45b818dd358" alt="avatar" />
        </a>
      </div>
    );
  }

}
