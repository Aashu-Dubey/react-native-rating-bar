import React from 'react';
import type { ColorValue } from 'react-native';

// TODO:- find better solution so we don't need this
export const getClonedElement = (
  children: React.ReactNode,
  iconSize: number,
  color?: number | ColorValue | undefined
) => {
  let clonedElement: JSX.Element | null = null;
  if (children && React.isValidElement(children)) {
    // Current Child component
    const childProps = children.props;
    const size = childProps.size || iconSize;
    // this condition to avoid getting warning, passing tintColor to 'Text' as component could be Icon too
    const childStyle = childProps.style ? { ...childProps.style } : undefined;

    // Cloned Child component
    const props = color
      ? { size, color, style: childStyle }
      : { size, style: childStyle };

    clonedElement = React.cloneElement(children, props);
    let style = clonedElement.props.style;
    if (style) {
      style.width = style.width || iconSize;
      style.height = style.height || iconSize;
      if (color) {
        style.tintColor = color;
      }
    }

    return clonedElement;
  }

  return children;
};

/* export const doubleCloneElement = (children: React.ReactNode, style: any) => {
  let clonedElement: JSX.Element | null = null;
  if (children && React.isValidElement(children)) {
    clonedElement = React.cloneElement(children, {
      style: { ...children.props.style, ...style },
    });
  }

  return clonedElement;
}; */
