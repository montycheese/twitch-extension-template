import React, { Component } from 'react';

import Loader from 'react-loader-spinner';
import PropTypes from 'prop-types';
import './LoadingSpinner.scss';
import { COLOR_HEX } from '../../util/Constants';

export default class LoadingSpinner extends Component {
  render() {
    const {
      type, color
    } = this.props;
    let {
      height, width
    } = this.props;
    height = height ? (window.innerWidth * (height / 100)) : (window.innerWidth * 0.05);
    width = width ? (window.innerWidth * (width / 100)) : (window.innerWidth * 0.05);
    return (
      <div className="LoadingSpinner">
        <Loader
          type={type}
          color={color}
          height={height}
          width={width}
        />
      </div>
    );
  }
}

LoadingSpinner.propTypes = {
  type: PropTypes.oneOf(['Audio', 'Ball-Triangle', 'Bars', 'Circles', 'Grid', 'Hearts', 'Oval', 'Puff', 'Rings', 'TailSpin', 'ThreeDots']),
  color: PropTypes.string,
  height: PropTypes.number,
  width: PropTypes.number,
};

LoadingSpinner.defaultProps = {
  type: 'Circles',
  color: COLOR_HEX.BLUE,
};
