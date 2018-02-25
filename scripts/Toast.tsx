import * as React from 'react';
import { Component } from 'react';
import * as classnames from 'classnames';

export default class Toast extends Component<any, any> {

  timeout;

  constructor(props) {
    super(props);
    this.state = {
      show: false
    };
  }

  componentDidMount() {
    this.timeout = setTimeout(() => this.setState({ show: true }), this.props.timer);
  }

  componentWillUnmount() {
    clearTimeout(this.timeout);
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

