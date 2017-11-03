import React, { Component } from 'react';
import classnames from 'classnames';

export default class Toast extends Component {
  constructor() {
    super();
    this.state = {
      show: false
    };
  }

  componentDidMount() {
    setTimeout(() => this.setState({ show: true }), this.props.timer);
  }

  getStyles = () =>
    classnames({
      snackbar: true,
      show: this.state.show
    });

  hideToast = () => {
    this.setState({ show: false });
  }

  render() {
    return (
      <div className={this.getStyles()}>
        <div className="toast toast-primary">
          <button className="btn btn-clear float-right" onClick={this.hideToast}></button>
          { this.props.text }
        </div>
      </div>
    );
  }
}

