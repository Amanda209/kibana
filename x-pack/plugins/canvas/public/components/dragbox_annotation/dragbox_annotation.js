/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import React from 'react';
import PropTypes from 'prop-types';
import { matrixToCSS } from '../../lib/dom';

export const DragBoxAnnotation = ({ transformMatrix, width, height }) => {
  const newStyle = {
    width,
    height,
    marginLeft: -width / 2,
    marginTop: -height / 2,
    transform: matrixToCSS(transformMatrix),
  };
  return <div className="canvasDragBoxAnnotation canvasLayoutAnnotation" style={newStyle} />;
};

DragBoxAnnotation.propTypes = {
  transformMatrix: PropTypes.arrayOf(PropTypes.number).isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
};
